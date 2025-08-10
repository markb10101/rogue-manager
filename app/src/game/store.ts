import { useToasts } from "../ui/Toasts";
import { create } from "zustand";
import { DAY_MINUTES, MOON_PERIOD_DAYS } from "./balance";

// ---- Types ----
type Dept = "FieldOps" | null;
type EmpStatus = "Untrained" | "Trainee" | "Certified" | "Injured" | "Recovering";
export type Employee = { id: string; dept: Dept; status: EmpStatus; wage: number };

type ContractStatus = "idle" | "active" | "complete";
export type Contract = {
  runId: number;
  name: string;
  status: "idle" | "active" | "complete";
  startAt: number;
  endAt: number;
  payout: number;
};

type Toast = { id: number; msg: string; createdAt: number };

type State = {
  // clock
  gameMinutes: number;
  timeScale: number;
  setTimeScale: (x: number) => void;
  advance: (realMs: number) => void;  // main loop ticks call this
  addMinutes: (mins: number) => void; // TTC and dev tools call this

  // money & payroll
  gold: number;
  employees: Employee[];
  projectedPayroll: number;
  payrollDueAt: number;
  lastPayrollAt: number;

  // HR
  hireFieldOp: () => void;

  // Field Ops contract (prototype)
  contract: Contract;
  startFieldContract: () => void;
  resetContract: () => void;

  // UI: TTC modal
  ttcOpen: boolean;
  openTTC: () => void;
  closeTTC: () => void;

  // UI: Toasts
  toasts: Toast[];
  addToast: (msg: string) => void;
  removeToast: (id: number) => void;
};

// ---- Seed tunables used by the prototype loop (real values live in balance.ts later) ----
const PAYROLL_PERIOD_MIN = MOON_PERIOD_DAYS * DAY_MINUTES; // every full moon
const SEED_WAGE = 5;                 // trainee wage
const CONTRACT_PAYOUT = 5;           // gold
const CONTRACT_DURATION_MIN = 10;    // minutes
const TOAST_MS = 2500;               // real milliseconds

let toastSeq = 1;
let runSeq = 1;

// ---- Store implementation ----
export const useGame = create<State>((set, get) => ({
  // clock
  gameMinutes: 0,
  timeScale: 1,
  setTimeScale: (x) => set({ timeScale: Math.max(0.1, Math.min(5, x)) }),

  // money & payroll
  gold: 0,
  employees: [],
  projectedPayroll: 0,
  payrollDueAt: PAYROLL_PERIOD_MIN,
  lastPayrollAt: -Infinity,

  // HR
  hireFieldOp: () => {
    const e: Employee = {
      id: `fo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      dept: "FieldOps",
      status: "Trainee",
      wage: SEED_WAGE,
    };
    set((s) => {
      const employees = [...s.employees, e];
      const projectedPayroll = employees.reduce((a, p) => a + p.wage, 0);
      return { employees, projectedPayroll };
    });
  },

  // Field Ops (one contract at a time for now)
  contract: { runId: 0, name: "Contract", status: "idle", startAt: 0, endAt: 0, payout: CONTRACT_PAYOUT },

  startFieldContract: () => {
    const s = get();
    if (s.contract.status === "active") return;
    const now = s.gameMinutes;
    const nextRunId = (s.contract.runId ?? 0) + 1;  // ← ensure a new id each start
    set({
      contract: {
        runId: nextRunId,
        name: "Contract",
        status: "active",
        startAt: now,
        endAt: now + CONTRACT_DURATION_MIN,
        payout: CONTRACT_PAYOUT,
      },
    });
  },


  resetContract: () =>
    set({
      contract: { runId: 0, name: "Contract", status: "idle", startAt: 0, endAt: 0, payout: CONTRACT_PAYOUT },
    }),

  // TTC modal
  ttcOpen: false,
  openTTC: () => set({ ttcOpen: true }),
  closeTTC: () => set({ ttcOpen: false }),

  // Toasts
  toasts: [],
  addToast: (msg) => {
    const id = toastSeq++;
    set((s) => ({ toasts: [...s.toasts, { id, msg, createdAt: get().gameMinutes }] }));
    if (typeof window !== "undefined") {
      setTimeout(() => get().removeToast(id), TOAST_MS);
    }
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // time advance
  advance: (realMs) => {
    // 1s real = 1 minute game * timeScale
    const deltaMin = (realMs / 1000) * get().timeScale;
    tick(deltaMin, set, get);
  },

  addMinutes: (mins) => tick(mins, set, get),
}));

// ---- Internal tick ----
function tick(deltaMin: number, set: any, get: any) {
  if (deltaMin <= 0) return;

  // advance the authoritative clock
  let newTime = get().gameMinutes + deltaMin;

  // payroll rollover — handle crossing multiple boundaries at once
  let gold = get().gold;
  let due = get().payrollDueAt;
  const projected = get().employees.reduce((a: number, e: Employee) => a + e.wage, 0);

  while (newTime >= due) {
    gold -= projected;
    useToasts.getState().addToast(`Paid ${projected}g in wages`);
    due += PAYROLL_PERIOD_MIN;
  }

  // contract completion
  const c = get().contract;
  if (c.status === "active" && newTime >= c.endAt) {
    gold += c.payout;
    useToasts.getState().addToast(`Contract complete: +${c.payout}g`);
    set({ contract: { ...c, status: "complete" } });
  }

  // commit tick results
  set({ gameMinutes: newTime, gold, payrollDueAt: due, projectedPayroll: projected });
}
