import { useEffect, useRef, useState } from 'react'
import { TTC_AMBIENT_INTERVAL_MS, TTC_OPTIONS_MINUTES } from '../game/balance'
import { useGame } from '../game/store'

const lines = [
  'You hear water dripping…',
  'Chains clatter in the dark…',
  'A clock ticks too slowly…',
  'Distant chanting rises and falls…',
  'A lock clicks, then stops.',
]

export default function TTCModal() {
  const addMinutes = useGame((s) => s.addMinutes)
  const closeTTC = useGame((s) => s.closeTTC)
  const [idx, setIdx] = useState(0)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    btnRef.current?.focus()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % lines.length), TTC_AMBIENT_INTERVAL_MS)
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTTC()
    }
    window.addEventListener('keydown', handler)
    return () => {
      clearInterval(id)
      window.removeEventListener('keydown', handler)
    }
  }, [closeTTC])

  const onAdd = (mins: number) => {
    addMinutes(mins)
    closeTTC()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90" onClick={closeTTC}>
      <div className="space-y-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm opacity-70">{lines[idx]}</div>
        <div className="flex justify-center gap-3">
          {TTC_OPTIONS_MINUTES.map((m, i) => (
            <button
              key={m}
              ref={i === 0 ? btnRef : undefined}
              onClick={() => onAdd(m)}
              className="rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/20 focus:outline-none"
            >
              +{m}m
            </button>
          ))}
        </div>
        <button onClick={closeTTC} className="text-sm underline">Close</button>
      </div>
    </div>
  )
}
