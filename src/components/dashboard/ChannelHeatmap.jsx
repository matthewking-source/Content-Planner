import { format, isToday } from 'date-fns'
import { CHANNELS, channelStyle } from '../../utils/channels.js'
import { weekDays, isoDate } from '../../utils/dates.js'

export default function ChannelHeatmap({ allItems, onCellClick }) {
  const days = weekDays(new Date())

  // channel -> day -> count
  const grid = {}
  for (const c of CHANNELS) grid[c.key] = {}
  for (const it of allItems) {
    if (!it.date) continue
    const d = it.date
    if (!grid[it.channel]) continue
    if (!days.find((x) => isoDate(x) === d)) continue
    grid[it.channel][d] = (grid[it.channel][d] || 0) + 1
  }

  const activeChannels = CHANNELS.filter((c) => {
    const row = grid[c.key]
    return row && Object.keys(row).length > 0
  })

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest">
          This week · channel activity
        </div>
        <div className="text-[10.5px] text-[var(--text-3)]">
          click a cell to filter
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-grid min-w-full gap-[3px]" style={{ gridTemplateColumns: '100px repeat(7, minmax(40px, 1fr))' }}>
          {/* Header row */}
          <div />
          {days.map((d) => (
            <div
              key={isoDate(d)}
              className="text-center text-[10px] text-[var(--text-3)]"
            >
              <div className="uppercase tracking-wider">{format(d, 'EEE')}</div>
              <div
                className={`mt-0.5 text-[11px] font-semibold ${
                  isToday(d) ? 'text-[var(--accent)]' : 'text-[var(--text-2)]'
                }`}
              >
                {format(d, 'd')}
              </div>
            </div>
          ))}

          {/* Body rows */}
          {CHANNELS.map((c) => {
            const cs = channelStyle(c.key)
            const row = grid[c.key] || {}
            const isActive = activeChannels.includes(c)
            return (
              <RowFragment
                key={c.key}
                channel={c}
                cs={cs}
                row={row}
                days={days}
                dimmed={!isActive}
                onCellClick={onCellClick}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RowFragment({ channel, cs, row, days, dimmed, onCellClick }) {
  return (
    <>
      <button
        onClick={() => onCellClick?.({ channel: channel.key })}
        className={`text-left text-[11px] pr-2 py-1 truncate hover:text-[var(--accent)] ${
          dimmed ? 'text-[var(--text-3)]' : 'text-[var(--text-2)]'
        }`}
        title={`Filter by ${channel.key}`}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cs.text }} />
          <span className="truncate">{channel.key}</span>
        </span>
      </button>
      {days.map((d) => {
        const iso = isoDate(d)
        const n = row[iso] || 0
        const intensity = n === 0 ? 0 : Math.min(1, 0.25 + n * 0.25)
        return (
          <button
            key={iso}
            onClick={() => onCellClick?.({ channel: channel.key, date: iso })}
            disabled={n === 0}
            className={`relative h-7 rounded-md transition ${n === 0 ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}`}
            style={{
              backgroundColor: n === 0 ? 'var(--bg)' : cs.bg,
              opacity: n === 0 ? 1 : intensity,
              boxShadow: n > 0 ? `inset 0 0 0 1px ${cs.text}20` : 'none',
            }}
            title={n === 0 ? '' : `${n} item${n === 1 ? '' : 's'} on ${format(d, 'd MMM')}`}
          >
            {n > 0 && (
              <span
                className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold"
                style={{ color: cs.text }}
              >
                {n}
              </span>
            )}
          </button>
        )
      })}
    </>
  )
}
