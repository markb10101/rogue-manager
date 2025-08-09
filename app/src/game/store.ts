import { create } from 'zustand'
import { MINUTES_PER_REAL_SECOND } from './balance'
import { nextPayrollDueAt } from './time'

type MissionStatus = 'idle' | 'active' | 'complete'

interface DemoMission {
  id: string
  name: string
  startAt: number
  endAt: number
  status: MissionStatus
  payout: number
}

interface GameState {
  gameMinutes: number
  timeScale: number
  gold: number
  projectedPayroll: number
  payrollDueAt: number
  demo: DemoMission

  advance: (realDeltaMs: number) => void
  addMinutes: (mins: number) => void
  setTimeScale: (v: number) => void

  startDemoMission: (durationMins?: number) => void
  resetDemo: () => void
}

function makeInitialMission(): DemoMission {
  return { id: 'demo-1', name: 'Kill Rats (demo)', startAt: 0, endAt: 0, status: 'idle', payout: 5 }
}

export const useGame = create<GameState>((set, get) => ({
  gameMinutes: 0,
  timeScale: 1,
  gold: 0,
  projectedPayroll: 50,
  payrollDueAt: nextPayrollDueAt(0),
  demo: makeInitialMission(),

  advance: (realDeltaMs: number) => {
    const s = get()
    const deltaMinutes = (realDeltaMs / 1000) * MINUTES_PER_REAL_SECOND * s.timeScale
    let gameMinutes = s.gameMinutes + deltaMinutes
    let { gold, payrollDueAt, projectedPayroll } = s
    let demo = { ...s.demo }

    if (demo.status === 'active' && gameMinutes >= demo.endAt) {
      demo.status = 'complete'
      gold += demo.payout
    }

    if (gameMinutes >= payrollDueAt) {
      payrollDueAt = nextPayrollDueAt(gameMinutes)
      projectedPayroll = projectedPayroll
    }

    set({ gameMinutes, gold, payrollDueAt, projectedPayroll, demo })
  },

  addMinutes: (mins: number) => {
    const s = get()
    get().advance((mins * 1000) / s.timeScale)
  },

  setTimeScale: (v: number) => set({ timeScale: v }),

  startDemoMission: (durationMins = 10) => {
    const s = get()
    if (s.demo.status === 'active') return
    const startAt = s.gameMinutes
    const endAt = startAt + durationMins
    set({ demo: { ...s.demo, startAt, endAt, status: 'active' } })
  },

  resetDemo: () => set({ demo: makeInitialMission() }),
}))
