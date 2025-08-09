import { useEffect, useRef } from 'react'
import TopBar from './ui/TopBar'
import { useGame } from './game/store'
import ProgressBar from './ui/ProgressBar'

export default function App() {
  const advance = useGame((s) => s.advance)
  const { gameMinutes, timeScale, setTimeScale, addMinutes, startDemoMission, demo, resetDemo } = useGame()

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

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">Rogue Manager — Prototype Loop</h1>
          <p className="mt-1 text-sm opacity-70">
            1s real-time = 1 in-game minute. Use the Time Torture Chamber to jump time.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
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
              <div className="text-sm font-medium">Demo Mission</div>
              {demo.status !== 'active' ? (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => startDemoMission(10)} className="rounded-md bg-indigo-600 px-3 py-1 text-white">Start (10m)</button>
                  <button onClick={() => resetDemo()} className="rounded-md border px-3 py-1">Reset</button>
                </div>
              ) : (
                <div className="mt-2 text-xs opacity-70">Active…</div>
              )}
            </div>
          </div>

          <div className="mt-6">
            {demo.status !== 'idle' && (
              <ProgressBar
                label={demo.name + (demo.status === 'complete' ? ' — Complete' : '')}
                startAt={demo.startAt}
                endAt={demo.endAt}
                clock={gameMinutes}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
