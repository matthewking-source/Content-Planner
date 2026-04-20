import { addMonths, subMonths, startOfMonth } from 'date-fns'
import CalendarDay from './CalendarDay.jsx'
import { monthGrid, monthLabel, weekdayHeaders } from '../utils/dates.js'
import { IconChevL, IconChevR } from './Icons.jsx'

export default function CalendarView({
  monthDate,
  onMonthChange,
  items,
  onItemClick,
  onAddItem,
}) {
  const grid = monthGrid(monthDate)
  const headers = weekdayHeaders()

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-2)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMonthChange(subMonths(monthDate, 1))}
            className="w-8 h-8 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
            aria-label="Previous month"
          >
            <IconChevL />
          </button>
          <button
            onClick={() => onMonthChange(addMonths(monthDate, 1))}
            className="w-8 h-8 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
            aria-label="Next month"
          >
            <IconChevR />
          </button>
          <button
            onClick={() => onMonthChange(startOfMonth(new Date()))}
            className="ml-1 px-2.5 h-8 text-[12px] rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
          >
            Today
          </button>
        </div>

        <h2 className="text-[15px] sm:text-[17px] font-semibold text-[var(--text)] tracking-tight">
          {monthLabel(monthDate)}
        </h2>

        <div className="w-[140px]" />
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--border-2)] bg-[var(--surface-2)]">
        {headers.map((h, i) => (
          <div
            key={h}
            className={`text-[10px] uppercase tracking-widest font-semibold text-[var(--text-3)] text-center py-2 border-r border-[var(--border-2)] last:border-r-0 ${
              i >= 5 ? 'text-[var(--text-3)]' : ''
            }`}
          >
            {h}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            monthDate={monthDate}
            items={items}
            onItemClick={onItemClick}
            onAddItem={onAddItem}
          />
        ))}
      </div>
    </div>
  )
}
