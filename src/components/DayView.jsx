import { format, isToday } from 'date-fns'
import DateBanner from './DateBanner.jsx'
import { IconChevL, IconChevR, IconPlus } from './Icons.jsx'
import { channelStyle, STATUS_STYLES } from '../utils/channels.js'
import { isoDate, dayLabel, addDays, subDays, importantDateCoversDay } from '../utils/dates.js'

export default function DayView({
  anchorDate,
  onAnchorChange,
  items,
  onItemClick,
  onAddItem,
  importantDates = [],
  onDateClick,
}) {
  const dateStr = isoDate(anchorDate)
  const dayItems = items.filter((i) => i.date === dateStr)
  const datesForDay = importantDates.filter((d) => importantDateCoversDay(d, anchorDate))
  const today = isToday(anchorDate)

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-2)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAnchorChange(subDays(anchorDate, 1))}
            className="w-8 h-8 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
            aria-label="Previous day"
          >
            <IconChevL />
          </button>
          <button
            onClick={() => onAnchorChange(addDays(anchorDate, 1))}
            className="w-8 h-8 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
            aria-label="Next day"
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

        <h2 className="text-[15px] sm:text-[17px] font-semibold tracking-tight flex items-center gap-2">
          {today && (
            <span className="text-[10.5px] font-semibold uppercase tracking-widest bg-[var(--accent-tint)] text-[var(--accent)] px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
          <span className="text-[var(--text)]">{dayLabel(anchorDate)}</span>
        </h2>

        <button
          onClick={() => onAddItem(dateStr)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12.5px] rounded-lg text-[var(--text-2)] hover:text-[var(--accent)] hover:bg-[var(--accent-tint)] transition"
          title={`Add item on ${format(anchorDate, 'd MMM yyyy')}`}
        >
          <IconPlus width={14} height={14} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-3">
        {datesForDay.length > 0 && (
          <DateBanner dates={datesForDay} variant="day" onClick={onDateClick} />
        )}

        {dayItems.length === 0 && datesForDay.length === 0 && (
          <div className="text-center py-14 border border-dashed border-[var(--border)] rounded-xl">
            <p className="text-[14px] text-[var(--text-2)] mb-1">
              Nothing planned for {format(anchorDate, 'EEEE d MMMM')}
            </p>
            <button
              onClick={() => onAddItem(dateStr)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] rounded-lg bg-[var(--text)] text-white hover:bg-black transition"
            >
              <IconPlus width={14} height={14} />
              Add the first one
            </button>
          </div>
        )}

        {dayItems.map((it) => {
          const cs = channelStyle(it.channel)
          const ss = STATUS_STYLES[it.status] || STATUS_STYLES.Planned
          return (
            <button
              key={it.id}
              onClick={() => onItemClick(it)}
              className="w-full text-left bg-white border border-[var(--border-2)] rounded-xl p-4 hover:shadow-pop hover:border-[var(--border)] transition group"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: cs.text }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                      className="chnchip"
                      style={{ backgroundColor: cs.bg, color: cs.text, borderColor: 'transparent' }}
                    >
                      <span className="dot" style={{ backgroundColor: cs.text }} />
                      {it.channel}
                    </span>
                    <span className="text-[11.5px] text-[var(--text-2)] font-medium">
                      {it.content_type}
                    </span>
                    <span
                      className="chnchip"
                      style={{ backgroundColor: ss.bg, color: ss.text, borderColor: 'transparent', padding: '2px 8px 2px 6px', fontSize: '10.5px' }}
                    >
                      <span className="dot" style={{ backgroundColor: ss.text }} />
                      {it.status}
                    </span>
                  </div>

                  <div className="text-[14.5px] text-[var(--text)] font-medium leading-snug group-hover:text-[var(--accent)] mb-1.5">
                    {it.topic}
                  </div>

                  <div className="flex items-center gap-3 text-[11.5px] text-[var(--text-3)] flex-wrap">
                    {it.campaign && (
                      <span className="inline-flex items-center gap-1">
                        <span className="uppercase tracking-wider text-[10px]">Campaign</span>
                        <span className="text-[var(--text-2)] font-medium">{it.campaign}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <span className="uppercase tracking-wider text-[10px]">Owner</span>
                      <span className="text-[var(--text-2)] font-medium">{it.owner}</span>
                    </span>
                  </div>

                  {it.notes && (
                    <div className="mt-2 text-[12.5px] text-[var(--text-2)] bg-[var(--bg)] rounded-lg px-3 py-2 italic">
                      {it.notes}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
