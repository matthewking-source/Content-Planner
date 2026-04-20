import { useEffect } from 'react'

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  const dotColor = {
    success: '#16a34a',
    error:   '#dc2626',
    info:    '#3b45e6',
  }[toast.type] || '#3b45e6'

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div
        className="flex items-center gap-2.5 bg-[var(--text)] text-white text-[13px] pl-3 pr-4 py-2.5 rounded-full shadow-modal"
        role="status"
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
        {toast.message}
      </div>
    </div>
  )
}
