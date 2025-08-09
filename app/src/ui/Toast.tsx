import { useGame } from '../game/store'

export default function Toast() {
  const toast = useGame((s) => s.toast)
  if (!toast) return null
  return (
    <div className="fixed bottom-4 right-4 rounded bg-black px-3 py-2 text-sm text-white shadow">
      {toast}
    </div>
  )
}
