import { CHANNELS, channelStyle } from '../../utils/channels.js'

export default function ChannelRow({ allItems, filters, onChange }) {
  const counts = {}
  for (const it of allItems) counts[it.channel] = (counts[it.channel] || 0) + 1

  const channels = filters.channels
  const toggle = (k) => {
    const next = new Set(channels)
    if (next.has(k)) next.delete(k)
    else next.add(k)
    onChange({ ...filters, channels: next })
  }

  const allOn = channels.size === CHANNELS.length

  return (
    <div className="bg-white rounded-xl shadow-card p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest mr-1">
          Channels
        </span>
        {CHANNELS.map((c) => {
          const on = channels.has(c.key)
          const count = counts[c.key] || 0
          const style = channelStyle(c.key)
          return (
            <button
              key={c.key}
              onClick={() => toggle(c.key)}
              className="chnchip"
              style={{
                backgroundColor: on ? style.bg : 'transparent',
                color: on ? style.text : 'var(--text-3)',
                borderColor: on ? 'transparent' : 'var(--border)',
                opacity: count === 0 ? 0.4 : 1,
              }}
            >
              <span className="dot" style={{ backgroundColor: style.text }} />
              {c.key}
              <span className="ml-0.5 opacity-60 font-normal">{count}</span>
            </button>
          )
        })}
        {!allOn && (
          <button
            onClick={() => onChange({ ...filters, channels: new Set(CHANNELS.map((c) => c.key)) })}
            className="text-[11px] text-[var(--text-3)] hover:text-[var(--accent)] ml-1"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
