import { create } from 'zustand'
import { TOAST_LIFETIME_MS } from '../game/balance'

interface Toast {
  id: number
  msg: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (msg: string) => void
  removeToast: (id: number) => void
}

let idCounter = 0
export const useToasts = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (msg: string) => {
    const id = ++idCounter
    set((s) => ({ toasts: [...s.toasts, { id, msg }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, TOAST_LIFETIME_MS)
  },
  removeToast: (id: number) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function Toasts() {
  const toasts = useToasts((s) => s.toasts)
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className="rounded bg-black text-white px-3 py-2 text-sm shadow">
          {t.msg}
        </div>
      ))}
    </div>
  )
}
