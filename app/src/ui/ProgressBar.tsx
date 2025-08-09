import { useEffect, useRef, useState } from 'react'
import { clamp } from '../game/time'
import { EMA_K } from '../game/balance'

type Props = { startAt: number; endAt: number; clock: number; label?: string }

export default function ProgressBar({ startAt, endAt, clock, label }: Props) {
  const raw = clamp((clock - startAt) / Math.max(0.0001, endAt - startAt))
  const [display, setDisplay] = useState(raw)
  const last = useRef(performance.now())

  useEffect(() => {
    let raf = 0
    const loop = (t: number) => {
      const dt = (t - last.current) / 1000
      last.current = t
      const alpha = 1 - Math.exp(-EMA_K * dt)
      setDisplay((d) => d + (raw - d) * alpha)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [raw])

  const pct = Math.round(display * 100)
  const duration = endAt - startAt
  const tempo = duration < 0.5 ? 'FAST' : duration >= 5 ? 'LONG' : 'STANDARD'

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">{label ?? 'Progress'}</span>
        <div className="text-xs opacity-70">{tempo} • {pct}%</div>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200">
        <div className="h-3 rounded-full bg-indigo-500 transition-[width] duration-150" style={{ width: `${clamp(display) * 100}%` }} />
      </div>
    </div>
  )
}
