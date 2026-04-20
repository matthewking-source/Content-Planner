import { useMemo } from 'react'
import { channelStyle, STATUS_STYLES } from '../utils/channels.js'
import { weekKey, weekLabel, prettyDate } from '../utils/dates.js'

export default function ListView({ items, onItemClick }) {
  const grouped = useMemo(() => groupByWeek(items), [items])

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card p-10 text-center text-[var(--text-3)] text-[13px] animate-fade">
        No items match your filters. Try clearing filters or change your search.
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade">
      {grouped.map(({ key, label, rows }) => (
        <div key={key} className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="sticky top-14 z-10 px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--border-2)] backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="text-[12.5px] font-semibold text-[var(--text)]">{label}</h3>
              <p className="text-[11px] text-[var(--text-3)]">
                {rows.length} item{rows.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <div className="divide-y divide-[var(--border-2)]">
            {rows.map((it) => {
              const cs = channelStyle(it.channel)
              const ss = STATUS_STYLES[it.status] || STATUS_STYLES.Planned
              return (
                <button
                  key={it.id}
                  onClick={() => onItemClick(it)}
                  className="w-full text-left px-3 sm:px-4 py-3 hover:bg-[var(--bg)] transition flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 group"
                >
                  <div className="text-[11.5px] text-[var(--text-3)] sm:w-28 shrink-0 font-medium">
                    {prettyDate(it.date)}
                  </div>

                  <span
                    className="chnchip shrink-0"
                    style={{ backgroundColor: cs.bg, color: cs.text, borderColor: 'transparent' }}
                  >
                    <span className="dot" style={{ backgroundColor: cs.text }} />
                    {it.channel}
                  </span>

                  <span className="text-[12px] text-[var(--text-2)] shrink-0 sm:w-28 truncate">
                    {it.content_type}
                  </span>

                  <span className="flex-1 text-[13px] text-[var(--text)] truncate group-hover:text-[var(--accent)]">
                    {it.topic}
                  </span>

                  {it.campaign && (
                    <span className="text-[11.5px] text-[var(--text-3)] shrink-0 sm:max-w-[140px] truncate italic">
                      {it.campaign}
                    </span>
                  )}

                  <span className="text-[11.5px] text-[var(--text-3)] shrink-0 sm:w-20 truncate">
                    {it.owner}
                  </span>

                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-medium shrink-0"
                    style={{ backgroundColor: ss.bg, color: ss.text }}
                  >
                    {it.status}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function groupByWeek(items) {
  const map = new Map()
  for (const it of items) {
    const k = weekKey(it.date)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(it)
  }
  const entries = Array.from(map.entries())
  entries.sort((a, b) => {
    if (a[0] === 'TBC') return 1
    if (b[0] === 'TBC') return -1
    return a[0] < b[0] ? -1 : 1
  })
  return entries.map(([key, rows]) => ({
    key,
    label: key === 'TBC' ? 'Date TBC' : weekLabel(rows[0].date),
    rows: rows.sort((a, b) => (a.date || '').localeCompare(b.date || '')),
  }))
}
