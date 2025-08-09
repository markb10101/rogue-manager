import { create } from 'zustand';
import { MINUTES_PER_REAL_SECOND } from './balance';
import { nextPayrollDueAt } from './time';

export interface DemoMission {
  startAt: number;
  endAt: number;
  status: 'idle' | 'running' | 'complete';
}

interface GameState {
  gameMinutes: number;
  timeScale: number;
  gold: number;
  payrollDueAt: number;
  projectedPayroll: number;
  demoMission: DemoMission;
  advance: (realMs: number) => void;
  addMinutes: (mins: number) => void;
  setTimeScale: (scale: number) => void;
  startDemoMission: () => void;
  resetDemo: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameMinutes: 0,
  timeScale: 1,
  gold: 0,
  payrollDueAt: nextPayrollDueAt(0),
  projectedPayroll: 0,
  demoMission: { startAt: 0, endAt: 0, status: 'idle' },

  advance(realMs: number) {
    const mins = (realMs / 1000) * MINUTES_PER_REAL_SECOND * get().timeScale;
    get().addMinutes(mins);
  },

  addMinutes(mins: number) {
    set((state) => {
      let gameMinutes = state.gameMinutes + mins;
      let demo = state.demoMission;
      let gold = state.gold;
      if (demo.status === 'running' && gameMinutes >= demo.endAt) {
        demo = { ...demo, status: 'complete' };
        gold += 5;
      }
      let payrollDueAt = state.payrollDueAt;
      if (gameMinutes >= payrollDueAt) {
        payrollDueAt = nextPayrollDueAt(gameMinutes);
      }
      return { gameMinutes, demoMission: demo, gold, payrollDueAt };
    });
  },

  setTimeScale(scale: number) {
    set({ timeScale: scale });
  },

  startDemoMission() {
    const now = get().gameMinutes;
    set({ demoMission: { startAt: now, endAt: now + 60, status: 'running' } });
  },

  resetDemo() {
    set({ demoMission: { startAt: 0, endAt: 0, status: 'idle' } });
  },
}));
