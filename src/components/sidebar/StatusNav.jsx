import { STATUSES, STATUS_STYLES } from '../../utils/channels.js'
import { SidebarHeading } from './ViewNav.jsx'

export default function StatusNav({ allItems, filters, onChange }) {
  const counts = {}
  for (const it of allItems) counts[it.status] = (counts[it.status] || 0) + 1

  const statuses = filters.statuses
  const toggle = (s) => {
    const next = new Set(statuses)
    if (next.has(s)) next.delete(s)
    else next.add(s)
    onChange({ ...filters, statuses: next })
  }

  return (
    <div>
      <SidebarHeading>Status</SidebarHeading>
      <div className="space-y-0.5">
        {STATUSES.map((s) => {
          const on = statuses.has(s)
          const ss = STATUS_STYLES[s]
          const count = counts[s] || 0
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[13px] transition ${
                on
                  ? 'bg-[var(--bg)] text-[var(--text)]'
                  : 'text-[var(--text-3)] hover:bg-[var(--bg)]'
              }`}
              style={{ opacity: count === 0 ? 0.4 : 1 }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: on ? ss.text : 'var(--border)' }}
                />
                {s}
              </span>
              <span className={on ? 'text-[var(--text-2)] font-medium' : 'text-[var(--text-3)]'}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
