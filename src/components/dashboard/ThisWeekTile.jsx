import { format } from 'date-fns'
import { STATUSES, STATUS_STYLES } from '../../utils/channels.js'
import { currentWeekRange, lastWeekRange, inDateRange } from '../../utils/dates.js'
import { IconTrend } from '../Icons.jsx'

export default function ThisWeekTile({ allItems, onQuickFilter }) {
  const thisWeek = currentWeekRange()
  const lastWeek = lastWeekRange()

  const now = new Date()
  const thisWeekItems = allItems.filter((i) => i.date && inDateRange(i.date, thisWeek))
  const lastWeekItems = allItems.filter((i) => i.date && inDateRange(i.date, lastWeek))

  const statusCounts = {}
  for (const s of STATUSES) statusCounts[s] = 0
  for (const it of thisWeekItems) {
    if (statusCounts[it.status] !== undefined) statusCounts[it.status]++
  }

  const delta = thisWeekItems.length - lastWeekItems.length
  const deltaLabel = delta === 0
    ? 'same as last week'
    : `${delta > 0 ? '+' : ''}${delta} vs last week`

  return (
    <button
      onClick={() => onQuickFilter?.('this-week')}
      className="text-left bg-white rounded-xl shadow-card p-4 hover:shadow-pop transition block w-full h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest">
          This week
        </div>
        <div className="text-[10.5px] text-[var(--text-3)]">
          {format(new Date(thisWeek.from + 'T00:00'), 'd MMM')}–{format(new Date(thisWeek.to + 'T00:00'), 'd MMM')}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-[32px] font-semibold text-[var(--text)] leading-none tabular-nums">
          {thisWeekItems.length}
        </div>
        <div className="text-[11.5px] text-[var(--text-3)]">
          item{thisWeekItems.length === 1 ? '' : 's'} planned
        </div>
      </div>

      {lastWeekItems.length > 0 && (
        <div className="flex items-center gap-1 text-[11px] text-[var(--text-3)] mb-3">
          <IconTrend
            width={12}
            height={12}
            style={{ transform: delta < 0 ? 'scaleY(-1)' : 'none' }}
            className={delta > 0 ? 'text-green-600' : delta < 0 ? 'text-orange-600' : ''}
          />
          <span>{deltaLabel}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mt-2">
        {STATUSES.map((s) => {
          const ss = STATUS_STYLES[s]
          const n = statusCounts[s]
          return (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-medium"
              style={{
                backgroundColor: n > 0 ? ss.bg : 'var(--bg)',
                color: n > 0 ? ss.text : 'var(--text-3)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n > 0 ? ss.text : 'var(--border)' }} />
              {s} <span className="font-semibold tabular-nums">{n}</span>
            </span>
          )
        })}
      </div>
    </button>
  )
}
