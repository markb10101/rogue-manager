import { useGame } from "../../game/store";

export default function HR() {
  const hireFieldOp = useGame(s => s.hireFieldOp);
  const headcount = useGame(s => s.employees.length);
  const projected = useGame(s => s.projectedPayroll);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">HR</h3>
      <p className="text-sm opacity-70">Hire Field Ops and manage headcount.</p>
      <div className="flex gap-2">
        <button onClick={() => hireFieldOp()} className="rounded-md bg-indigo-600 px-3 py-1 text-white">
          Hire Field Op (5g wage)
        </button>
      </div>
      <div className="text-sm opacity-70">
        Headcount: <b>{headcount}</b> • Projected payroll: <b>{projected.toFixed(0)}g</b>
      </div>
    </div>
  );
}
