import { CHANNELS, channelStyle } from '../utils/channels.js'

export default function Stats({ items }) {
  const byChannel = CHANNELS.map((c) => ({
    key: c.key,
    count: items.filter((x) => x.channel === c.key).length,
  })).filter((x) => x.count > 0)

  const withDate = items.filter((i) => i.date).length
  const tbc = items.length - withDate

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[var(--text-2)] px-1">
      <span className="font-semibold text-[var(--text)]">
        {items.length} item{items.length === 1 ? '' : 's'}
      </span>
      {tbc > 0 && (
        <span className="text-[var(--text-3)]">
          {withDate} dated · {tbc} TBC
        </span>
      )}
      {byChannel.length > 0 && (
        <>
          <span className="text-[var(--text-3)] hidden sm:inline">·</span>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {byChannel.map((x) => {
              const style = channelStyle(x.key)
              return (
                <span key={x.key} className="inline-flex items-center gap-1.5 text-[11.5px]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.text }} />
                  <span className="text-[var(--text-2)]">{x.key}</span>
                  <span className="text-[var(--text-3)] font-medium">{x.count}</span>
                </span>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
