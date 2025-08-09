import { create } from 'zustand'
import { MINUTES_PER_REAL_SECOND, FIELD_OP_WAGE, FIELD_OP_CONTRACT_DURATION, FIELD_OP_CONTRACT_PAYOUT } from './balance'
import { nextPayrollDueAt } from './time'

type MissionStatus = 'idle' | 'active' | 'complete'

interface Mission {
  id: string
  name: string
  startAt: number
  endAt: number
  status: MissionStatus
  payout: number
}

interface Employee {
  id: string
  dept: 'FieldOps' | null
  status: 'Trainee' | 'Certified'
  wage: number
}

interface GameState {
  gameMinutes: number
  timeScale: number
  gold: number
  projectedPayroll: number
  payrollDueAt: number
  lastPayrollAt: number
  employees: Employee[]
  toast: string | null
  contract: Mission

  advance: (realDeltaMs: number) => void
  addMinutes: (mins: number) => void
  setTimeScale: (v: number) => void

  setToast: (msg: string) => void

  hireFieldOp: () => void
  startFieldContract: () => void
  resetContract: () => void
}

function makeInitialMission(): Mission {
  return { id: 'contract-1', name: 'Field Contract', startAt: 0, endAt: 0, status: 'idle', payout: FIELD_OP_CONTRACT_PAYOUT }
}

export const useGame = create<GameState>((set, get) => ({
  gameMinutes: 0,
  timeScale: 1,
  gold: 0,
  projectedPayroll: 0,
  payrollDueAt: nextPayrollDueAt(0),
  lastPayrollAt: 0,
  employees: [],
  toast: null,
  contract: makeInitialMission(),

  advance: (realDeltaMs: number) => {
    const s = get()
    const deltaMinutes = (realDeltaMs / 1000) * MINUTES_PER_REAL_SECOND * s.timeScale
    let gameMinutes = s.gameMinutes + deltaMinutes
    let { gold, payrollDueAt, lastPayrollAt } = s
    const projectedPayroll = s.employees.reduce((sum, e) => sum + e.wage, 0)
    let contract = { ...s.contract }

    if (contract.status === 'active' && gameMinutes >= contract.endAt) {
      contract.status = 'complete'
      gold += contract.payout
    }

    if (gameMinutes >= payrollDueAt) {
      gold -= projectedPayroll
      get().setToast(`Paid ${projectedPayroll.toFixed(0)} gold in wages`)
      payrollDueAt = nextPayrollDueAt(gameMinutes)
      lastPayrollAt = gameMinutes
    }

    set({ gameMinutes, gold, payrollDueAt, projectedPayroll, lastPayrollAt, contract })
  },

  addMinutes: (mins: number) => {
    const s = get()
    get().advance((mins * 1000) / s.timeScale)
  },

  setTimeScale: (v: number) => set({ timeScale: v }),

  setToast: (msg: string) => {
    set({ toast: msg })
    setTimeout(() => set({ toast: null }), 3000)
  },

  hireFieldOp: () => {
    const e: Employee = {
      id: `emp-${Date.now()}`,
      dept: 'FieldOps',
      status: 'Trainee',
      wage: FIELD_OP_WAGE,
    }
    set((s) => ({ employees: [...s.employees, e] }))
  },

  startFieldContract: () => {
    const s = get()
    if (s.contract.status === 'active') return
    const startAt = s.gameMinutes
    const endAt = startAt + FIELD_OP_CONTRACT_DURATION
    set({ contract: { ...s.contract, startAt, endAt, status: 'active', payout: FIELD_OP_CONTRACT_PAYOUT } })
  },

  resetContract: () => set({ contract: makeInitialMission() }),
}))
