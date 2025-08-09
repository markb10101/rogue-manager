import { useGameStore } from '../game/store';
import {
  fmtHHMM,
  splitDay,
  moonPhaseLabel,
  payrollRemainingMinutes,
} from '../game/time';

export default function TopBar() {
  const gameMinutes = useGameStore((s) => s.gameMinutes);
  const gold = useGameStore((s) => s.gold);
  const payrollDueAt = useGameStore((s) => s.payrollDueAt);

  const { day } = splitDay(gameMinutes);
  const time = fmtHHMM(gameMinutes);
  const moon = moonPhaseLabel(gameMinutes);
  const payrollRem = payrollRemainingMinutes(gameMinutes, payrollDueAt);

  return (
    <div className="flex justify-between mb-4 text-sm">
      <div>Gold: {gold}</div>
      <div>
        Day {day} {time}
      </div>
      <div>Moon: {moon}</div>
      <div>Payroll in {Math.ceil(payrollRem)}m</div>
    </div>
  );
}
