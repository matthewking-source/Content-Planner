import { categoryStyle } from '../../utils/dateCategories.js'
import { relativeUntil, prettyDate, isoDate } from '../../utils/dates.js'
import { IconCalendar, IconPlus, IconArrowR } from '../Icons.jsx'

export default function DatesTile({ dates, onItemClick, onAdd, onOpenAll, tableMissing }) {
  const today = isoDate(new Date())
  // Show all upcoming dates — the row scrolls horizontally
  const upcoming = dates.filter((d) => (d.end_date || d.date) >= today)

  return (
    <div className="bg-white rounded-xl shadow-card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-purple-100 text-purple-700">
            <IconCalendar width={13} height={13} />
          </span>
          <div>
            <div className="text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest">
              Important dates
            </div>
            <div className="text-[11.5px] text-[var(--text-2)]">
              {upcoming.length === 0
                ? 'None upcoming'
                : `${upcoming.length} upcoming${upcoming.length > 4 ? ' · scroll for more →' : ''}`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11.5px] rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition"
            title="Add an important date"
          >
            <IconPlus width={11} height={11} />
            Add
          </button>
          <button
            onClick={onOpenAll}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11.5px] rounded-lg text-[var(--accent)] hover:bg-[var(--accent-tint)] transition"
          >
            View all
            <IconArrowR width={11} height={11} />
          </button>
        </div>
      </div>

      {tableMissing ? (
        <div className="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Run the <code>0002_important_dates.sql</code> migration in Supabase to enable this.
        </div>
      ) : upcoming.length === 0 ? (
        <div className="text-[12px] text-[var(--text-3)] italic py-2">
          No important dates in the pipeline. Click Add to create one.
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {upcoming.map((d) => {
            const c = categoryStyle(d.category)
            const isRange = d.end_date && d.end_date !== d.date
            return (
              <button
                key={d.id}
                onClick={() => onItemClick?.(d)}
                className="shrink-0 text-left rounded-lg px-3 py-2 border min-w-[180px] max-w-[240px] hover:shadow-card transition"
                style={{ backgroundColor: c.bg, borderColor: 'rgba(14, 18, 48, 0.06)' }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.text }} />
                  <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: c.text }}>
                    {d.category}
                  </span>
                </div>
                <div className="text-[13px] font-semibold text-[var(--text)] line-clamp-2 mb-1">
                  {d.label}
                </div>
                <div className="text-[11px] text-[var(--text-2)]">
                  {relativeUntil(d.date)} · {isRange ? `${prettyDate(d.date)} – ${prettyDate(d.end_date)}` : prettyDate(d.date)}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
