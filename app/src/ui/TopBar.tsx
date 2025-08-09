import { useGame } from '../game/store'
import { fmtHHMM, moonPhaseLabel, payrollRemainingMinutes, splitDay } from '../game/time'

export default function TopBar() {
  const { gameMinutes, gold, projectedPayroll, headcount } = useGame((s) => ({
    gameMinutes: s.gameMinutes,
    gold: s.gold,
    projectedPayroll: s.projectedPayroll,
    headcount: s.employees.length,
  }))
  const { day } = splitDay(gameMinutes)
  const hhmm = fmtHHMM(gameMinutes)
  const phase = moonPhaseLabel(gameMinutes)
  const { remaining } = payrollRemainingMinutes(gameMinutes)

  return (
    <div className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-5xl px-4 py-2 grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
        <Stat label="Gold" value={gold.toFixed(0)} />
        <Stat label={`Day ${day}`} value={hhmm} />
        <Stat label="Moon" value={phase} />
        <Stat label="Payroll in" value={`${Math.ceil(remaining)} min`} />
        <Stat label="Projected Payroll" value={projectedPayroll.toFixed(0)} />
        <Stat label="Headcount" value={headcount.toString()} />
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
