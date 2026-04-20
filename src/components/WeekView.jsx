import { format, isToday, getDay } from 'date-fns'
import CalendarItem from './CalendarItem.jsx'
import { IconChevL, IconChevR, IconPlus } from './Icons.jsx'
import { isoDate, weekDays, weekRangeLabel, addWeeks, subWeeks } from '../utils/dates.js'

export default function WeekView({
  anchorDate,
  onAnchorChange,
  items,
  onItemClick,
  onAddItem,
}) {
  const days = weekDays(anchorDate)

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-2)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAnchorChange(subWeeks(anchorDate, 1))}
            className="w-8 h-8 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
            aria-label="Previous week"
          >
            <IconChevL />
          </button>
          <button
            onClick={() => onAnchorChange(addWeeks(anchorDate, 1))}
            className="w-8 h-8 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
            aria-label="Next week"
          >
            <IconChevR />
          </button>
          <button
            onClick={() => onAnchorChange(new Date())}
            className="ml-1 px-2.5 h-8 text-[12px] rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
          >
            Today
          </button>
        </div>

        <h2 className="text-[15px] sm:text-[17px] font-semibold text-[var(--text)] tracking-tight">
          {weekRangeLabel(anchorDate)}
        </h2>

        <div className="w-[140px]" />
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 min-h-[60vh]">
        {days.map((day) => {
          const dateStr = isoDate(day)
          const dayItems = items.filter((i) => i.date === dateStr)
          const today = isToday(day)
          const dow = getDay(day)
          const weekend = dow === 0 || dow === 6

          return (
            <div
              key={day.toISOString()}
              className={`group relative border-r border-[var(--border-2)] last:border-r-0 flex flex-col min-h-full ${
                weekend ? 'bg-[var(--bg)]' : 'bg-white'
              }`}
            >
              <div className="px-2.5 py-2.5 border-b border-[var(--border-2)] sticky top-14 bg-inherit z-[5]">
                <div className="flex items-baseline justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-3)]">
                      {format(day, 'EEE')}
                    </div>
                    <div
                      className={`text-[14px] font-semibold mt-0.5 ${
                        today ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                      }`}
                    >
                      <span
                        className={
                          today
                            ? 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent)] text-white text-[12px]'
                            : ''
                        }
                      >
                        {format(day, 'd')}
                      </span>
                      <span className="text-[11.5px] text-[var(--text-3)] ml-1 font-normal">
                        {format(day, 'MMM')}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddItem(dateStr)}
                    aria-label={`Add item on ${format(day, 'd MMM yyyy')}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-md text-[var(--text-3)] hover:text-white hover:bg-[var(--accent)] inline-flex items-center justify-center"
                  >
                    <IconPlus width={12} height={12} />
                  </button>
                </div>
                {dayItems.length > 0 && (
                  <div className="text-[10.5px] text-[var(--text-3)] mt-1">
                    {dayItems.length} item{dayItems.length === 1 ? '' : 's'}
                  </div>
                )}
              </div>

              <div className="flex-1 p-2 space-y-1 overflow-y-auto day-items">
                {dayItems.length === 0 && (
                  <button
                    onClick={() => onAddItem(dateStr)}
                    className="w-full text-[11px] text-[var(--text-3)] hover:text-[var(--accent)] border border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-lg py-3 transition"
                  >
                    + Add
                  </button>
                )}
                {dayItems.map((it) => (
                  <CalendarItem key={it.id} item={it} onClick={() => onItemClick(it)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
