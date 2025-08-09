import ProgressBar from "../ProgressBar";
import { useGame } from "../../game/store";

export default function Overview() {
  const { timeScale, setTimeScale, addMinutes, gameMinutes, contract } = useGame((s) => ({
    timeScale: s.timeScale,
    setTimeScale: s.setTimeScale,
    addMinutes: s.addMinutes,
    gameMinutes: s.gameMinutes,
    contract: s.contract, // from payroll/HR PR
  }));

  const active = !!contract && contract.status !== "idle";

  return (
    <div className="space-y-4">
      <p className="text-sm opacity-70">
        1s real-time = 1 in-game minute. Use the Time Torture Chamber to jump time.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="text-sm font-medium">Time Scale</div>
          <input
            type="range" min={0.1} max={5} step={0.1}
            value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs opacity-70">x{timeScale.toFixed(1)}</div>
        </div>

        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="text-sm font-medium">Time Torture Chamber</div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => addMinutes(10)} className="rounded-md bg-black px-3 py-1 text-white">+10m</button>
            <button onClick={() => addMinutes(30)} className="rounded-md bg-black px-3 py-1 text-white">+30m</button>
            <button onClick={() => addMinutes(60)} className="rounded-md bg-black px-3 py-1 text-white">+60m</button>
          </div>
        </div>

        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="text-sm font-medium">Status</div>
          <div className="mt-2 text-xs opacity-70">{active ? "Contract active" : "No active contract"}</div>
        </div>
      </div>

      {active && (
        <ProgressBar
          label={(contract?.name ?? "Contract") + (contract?.status === "complete" ? " — Complete" : "")}
          startAt={contract?.startAt ?? 0}
          endAt={contract?.endAt ?? 0}
          clock={gameMinutes}
        />
      )}
    </div>
  );
}
