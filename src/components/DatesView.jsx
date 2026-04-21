import { useMemo, useState } from 'react'
import { DATE_CATEGORIES, categoryStyle } from '../utils/dateCategories.js'
import { prettyDate, relativeUntil, isoDate } from '../utils/dates.js'
import { IconPlus, IconCalendar } from './Icons.jsx'

export default function DatesView({ dates, tableMissing, onItemClick, onAdd }) {
  const [filterCategory, setFilterCategory] = useState(null)
  const [showPast, setShowPast] = useState(false)

  const today = isoDate(new Date())

  const filtered = useMemo(() => {
    return dates.filter((d) => {
      if (filterCategory && d.category !== filterCategory) return false
      const end = d.end_date || d.date
      if (!showPast && end < today) return false
      return true
    })
  }, [dates, filterCategory, showPast, today])

  const countsByCategory = useMemo(() => {
    const out = {}
    for (const d of dates) out[d.category] = (out[d.category] || 0) + 1
    return out
  }, [dates])

  const grouped = useMemo(() => groupByMonth(filtered), [filtered])

  if (tableMissing) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center animate-fade">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-700 mb-3">
          <IconCalendar width={20} height={20} />
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--text)] mb-1">Supabase table missing</h3>
        <p className="text-[12.5px] text-[var(--text-2)] max-w-md mx-auto">
          Run the migration at <code>supabase/migrations/0002_important_dates.sql</code> in Supabase's SQL editor, then refresh.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-2)] flex-wrap gap-2">
        <div>
          <h2 className="text-[15px] sm:text-[17px] font-semibold text-[var(--text)] tracking-tight">
            Important dates
          </h2>
          <p className="text-[11.5px] text-[var(--text-3)]">
            {dates.length} total · {filtered.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--text-2)] cursor-pointer">
            <input
              type="checkbox"
              checked={showPast}
              onChange={(e) => setShowPast(e.target.checked)}
              className="rounded border-[var(--border)]"
            />
            Show past
          </label>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-lg bg-[var(--text)] text-white hover:bg-black font-medium shadow-sm transition"
          >
            <IconPlus width={14} height={14} />
            Add date
          </button>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="px-4 py-3 border-b border-[var(--border-2)] bg-[var(--surface-2)] flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilterCategory(null)}
          className={`chnchip ${
            filterCategory === null ? 'font-semibold' : ''
          }`}
          style={
            filterCategory === null
              ? { backgroundColor: 'var(--text)', color: '#fff', borderColor: 'var(--text)' }
              : { backgroundColor: 'transparent', color: 'var(--text-2)', borderColor: 'var(--border)' }
          }
        >
          All
          <span className="ml-0.5 opacity-60 font-normal">{dates.length}</span>
        </button>
        {DATE_CATEGORIES.map((c) => {
          const on = filterCategory === c.key
          const count = countsByCategory[c.key] || 0
          return (
            <button
              key={c.key}
              onClick={() => setFilterCategory(on ? null : c.key)}
              className="chnchip"
              style={{
                backgroundColor: on ? c.bg : 'transparent',
                color: on ? c.text : 'var(--text-3)',
                borderColor: on ? 'transparent' : 'var(--border)',
                opacity: count === 0 ? 0.4 : 1,
                fontWeight: on ? 600 : 500,
              }}
            >
              <span className="dot" style={{ backgroundColor: c.text }} />
              {c.label}
              <span className="ml-0.5 opacity-60 font-normal">{count}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center text-[var(--text-3)] text-[13px]">
          {dates.length === 0
            ? 'No important dates yet. Click Add to create one.'
            : 'No dates match this filter.'}
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-2)]">
          {grouped.map(({ monthKey, label, rows }) => (
            <div key={monthKey}>
              <div className="sticky top-14 z-10 px-4 py-2 bg-[var(--surface-2)] border-b border-[var(--border-2)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12.5px] font-semibold text-[var(--text)]">{label}</h3>
                  <p className="text-[11px] text-[var(--text-3)]">{rows.length} item{rows.length === 1 ? '' : 's'}</p>
                </div>
              </div>
              <div className="divide-y divide-[var(--border-2)]">
                {rows.map((d) => {
                  const c = categoryStyle(d.category)
                  const isRange = d.end_date && d.end_date !== d.date
                  const past = (d.end_date || d.date) < today
                  return (
                    <button
                      key={d.id}
                      onClick={() => onItemClick(d)}
                      className={`w-full text-left px-3 sm:px-4 py-3 hover:bg-[var(--bg)] transition flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 group ${
                        past ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="text-[11.5px] text-[var(--text-3)] sm:w-36 shrink-0 font-medium">
                        {isRange
                          ? `${prettyDate(d.date)} – ${prettyDate(d.end_date)}`
                          : prettyDate(d.date)}
                      </div>
                      <span
                        className="chnchip shrink-0"
                        style={{ backgroundColor: c.bg, color: c.text, borderColor: 'transparent' }}
                      >
                        <span className="dot" style={{ backgroundColor: c.text }} />
                        {d.category}
                      </span>
                      <span className="flex-1 text-[13px] text-[var(--text)] group-hover:text-[var(--accent)] truncate">
                        {d.label}
                      </span>
                      {d.notes && (
                        <span className="text-[11.5px] text-[var(--text-3)] italic shrink-0 sm:max-w-[240px] truncate">
                          {d.notes}
                        </span>
                      )}
                      <span className="text-[11px] text-[var(--text-3)] shrink-0 sm:w-24 text-right">
                        {past ? 'past' : relativeUntil(d.date)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function groupByMonth(dates) {
  const map = new Map()
  for (const d of dates) {
    const [y, m] = d.date.split('-')
    const key = `${y}-${m}`
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(d)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, rows]) => {
      const d = new Date(rows[0].date + 'T00:00')
      return {
        monthKey: key,
        label: d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
        rows: [...rows].sort((a, b) => a.date.localeCompare(b.date)),
      }
    })
}
