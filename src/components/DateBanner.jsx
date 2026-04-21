import { categoryStyle } from '../utils/dateCategories.js'

/**
 * Thin coloured strip shown at the top of a calendar day cell when one or more
 * important dates cover that day. Hover shows notes; click opens the DateModal.
 *
 * variant:
 *   'month' — tightest: small text, truncated
 *   'week'  — medium: slightly fuller
 *   'day'   — loose: full card-like display
 */
export default function DateBanner({ dates, variant = 'month', onClick }) {
  if (!dates || dates.length === 0) return null

  if (variant === 'day') {
    return (
      <div className="space-y-1.5 mb-3">
        {dates.map((d) => {
          const c = categoryStyle(d.category)
          const isRange = d.end_date && d.end_date !== d.date
          return (
            <button
              key={d.id}
              onClick={() => onClick?.(d)}
              className="w-full text-left rounded-lg px-3 py-2 text-[12.5px] hover:shadow-card transition flex items-center gap-2"
              style={{ backgroundColor: c.bg, color: c.text }}
              title={d.notes || d.label}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.text }} />
              <span className="font-semibold truncate">{d.label}</span>
              {isRange && (
                <span className="text-[10.5px] opacity-70 ml-auto shrink-0">
                  {d.date} – {d.end_date}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // month + week: compact strip(s) at top of cell
  const textSize = variant === 'week' ? 10.5 : 10
  const maxShown = variant === 'week' ? 2 : 2
  const shown = dates.slice(0, maxShown)
  const extra = dates.length - shown.length

  return (
    <div className="space-y-0.5 mb-1">
      {shown.map((d) => {
        const c = categoryStyle(d.category)
        return (
          <button
            key={d.id}
            onClick={(e) => { e.stopPropagation(); onClick?.(d) }}
            className="w-full text-left rounded px-1.5 py-0.5 truncate hover:brightness-95 transition"
            style={{
              backgroundColor: c.bg,
              color: c.text,
              fontSize: `${textSize}px`,
              fontWeight: 600,
              lineHeight: 1.2,
            }}
            title={`${d.label}${d.notes ? ` — ${d.notes}` : ''}`}
          >
            {d.label}
          </button>
        )
      })}
      {extra > 0 && (
        <div
          className="text-[9.5px] text-[var(--text-3)] px-1.5"
          title={`${extra} more important date${extra === 1 ? '' : 's'} on this day`}
        >
          +{extra} more
        </div>
      )}
    </div>
  )
}
