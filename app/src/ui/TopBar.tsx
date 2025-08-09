import { useGame } from '../game/store'
import { fmtHHMM, moonPhaseLabel, payrollRemainingMinutes, splitDay } from '../game/time'

export default function TopBar() {
  const { gameMinutes, gold, openTTC } = useGame((s) => ({
    gameMinutes: s.gameMinutes,
    gold: s.gold,
    openTTC: s.openTTC,
  }))
  const { day } = splitDay(gameMinutes)
  const hhmm = fmtHHMM(gameMinutes)
  const phase = moonPhaseLabel(gameMinutes)
  const { remaining } = payrollRemainingMinutes(gameMinutes)

  return (
    <div className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="relative mx-auto max-w-5xl px-4 py-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <Stat label="Gold" value={gold.toFixed(0)} />
          <Stat label={`Day ${day}`} value={hhmm} />
          <Stat label="Moon" value={phase} />
          <Stat label="Payroll in" value={`${Math.ceil(remaining)} min`} />
        </div>
        <button
          onClick={openTTC}
          className="absolute right-4 top-2 rounded bg-black px-3 py-1 text-xs text-white"
        >
          TTC
        </button>
      </div>
      <div className="h-px w-full bg-gray-200" />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
      <span className="opacity-60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
