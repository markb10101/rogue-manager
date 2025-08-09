import { useEffect, useRef } from 'react'
import TopBar from './ui/TopBar'
import { useGame } from './game/store'
import ProgressBar from './ui/ProgressBar'
import Toast from './ui/Toast'

export default function App() {
  const advance = useGame((s) => s.advance)
  const { gameMinutes, timeScale, setTimeScale, addMinutes, startFieldContract, contract, resetContract, hireFieldOp } = useGame()

  const rafId = useRef(0)
  const last = useRef(performance.now())
  useEffect(() => {
    const loop = (t: number) => {
      const dt = t - last.current
      last.current = t
      advance(dt)
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [advance])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <TopBar />
      <Toast />

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">Rogue Manager — Prototype Loop</h1>
          <p className="mt-1 text-sm opacity-70">
            1s real-time = 1 in-game minute. Use the Time Torture Chamber to jump time.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
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
              <div className="text-sm font-medium">HR</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => hireFieldOp()} className="rounded-md bg-indigo-600 px-3 py-1 text-white">Hire Field Op (5g wage)</button>
              </div>
            </div>

            <div className="rounded-lg border bg-gray-50 p-3">
              <div className="text-sm font-medium">Field Ops</div>
              {contract.status !== 'active' ? (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => startFieldContract()} className="rounded-md bg-indigo-600 px-3 py-1 text-white">Start Contract (10m, pays 5g)</button>
                  <button onClick={() => resetContract()} className="rounded-md border px-3 py-1">Reset</button>
                </div>
              ) : (
                <div className="mt-2 text-xs opacity-70">Active…</div>
              )}
            </div>
          </div>

          <div className="mt-6">
            {contract.status !== 'idle' && (
              <ProgressBar
                label={contract.name + (contract.status === 'complete' ? ' — Complete' : '')}
                startAt={contract.startAt}
                endAt={contract.endAt}
                clock={gameMinutes}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
