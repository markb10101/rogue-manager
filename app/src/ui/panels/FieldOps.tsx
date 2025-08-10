import { useGame } from "../../game/store";
import ProgressBar from "../ProgressBar";

export default function FieldOps() {
  const { gameMinutes, contract, startFieldContract, resetContract } = useGame(s => ({
    gameMinutes: s.gameMinutes,
    contract: s.contract,
    startFieldContract: s.startFieldContract,
    resetContract: s.resetContract,
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Field Ops</h3>
      <p className="text-sm opacity-70">Run contracts to earn gold.</p>

      {contract.status !== "active" ? (
        <div className="flex gap-2">
          <button onClick={() => startFieldContract()} className="rounded-md bg-indigo-600 px-3 py-1 text-white">
            Start Contract (10m, pays 5g)
          </button>
          <button onClick={() => resetContract()} className="rounded-md border px-3 py-1">
            Reset
          </button>
        </div>
      ) : (
        <div className="text-xs opacity-70">Active…</div>
      )}

      <div className="mt-2">
        {contract.status !== "idle" && (
          <ProgressBar
            key={contract.runId ?? contract.startAt}   // ← this line forces a remount each run
            label={contract.name + (contract.status === "complete" ? " — Complete" : "")}
            startAt={contract.startAt}
            endAt={contract.endAt}
            clock={gameMinutes}
          />

        )}
      </div>
    </div>
  );
}
