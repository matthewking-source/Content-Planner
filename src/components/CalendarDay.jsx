import { format, isToday, getDay } from 'date-fns'
import CalendarItem from './CalendarItem.jsx'
import { IconPlus } from './Icons.jsx'
import { isoDate, sameMonth } from '../utils/dates.js'

export default function CalendarDay({ day, monthDate, items, onItemClick, onAddItem }) {
  const inMonth = sameMonth(day, monthDate)
  const today = isToday(day)
  const dateStr = isoDate(day)
  const dayItems = items.filter((i) => i.date === dateStr)
  const dow = getDay(day) // 0 = Sunday, 6 = Saturday
  const weekend = dow === 0 || dow === 6

  return (
    <div
      className={`group relative border-r border-b border-[var(--border-2)] min-h-[120px] sm:min-h-[140px] p-2 flex flex-col transition ${
        !inMonth
          ? 'bg-[var(--surface-2)]'
          : weekend
          ? 'bg-[var(--bg)]'
          : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <button
          type="button"
          onClick={() => onAddItem(dateStr)}
          title={`Add item on ${format(day, 'd MMM yyyy')}`}
          className={`inline-flex items-center justify-center text-[12px] font-medium rounded-full transition ${
            today
              ? 'w-6 h-6 bg-[var(--accent)] text-white hover:bg-[var(--accent-dk)]'
              : inMonth
              ? 'w-6 h-6 text-[var(--text)] hover:bg-[var(--bg)]'
              : 'w-6 h-6 text-[var(--text-3)] hover:bg-[var(--bg)]'
          }`}
        >
          {format(day, 'd')}
        </button>
        <button
          type="button"
          onClick={() => onAddItem(dateStr)}
          aria-label={`Add item on ${format(day, 'd MMM yyyy')}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-md text-[var(--text-3)] hover:text-white hover:bg-[var(--accent)] inline-flex items-center justify-center"
        >
          <IconPlus width={12} height={12} />
        </button>
      </div>

      <div className="day-items flex-1 space-y-1 overflow-y-auto max-h-[180px]">
        {dayItems.map((it) => (
          <CalendarItem key={it.id} item={it} onClick={() => onItemClick(it)} />
        ))}
      </div>
    </div>
  )
}
