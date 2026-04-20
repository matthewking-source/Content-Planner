import { channelStyle } from '../utils/channels.js'

export default function CalendarItem({ item, onClick }) {
  const style = channelStyle(item.channel)
  const published = item.status === 'Published'

  return (
    <button
      type="button"
      onClick={onClick}
      className="chip block w-full text-left relative"
      style={{ opacity: published ? 0.65 : 1 }}
    >
      <span
        className="item-pill"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          textDecoration: published ? 'line-through' : 'none',
        }}
      >
        <span className="pdot" style={{ backgroundColor: style.text }} />
        <span className="ptxt">
          {item.content_type ? `${item.content_type}: ` : ''}
          {item.topic}
        </span>
      </span>

      <span className="chip-tooltip">
        <span className="block font-semibold mb-1">
          {item.channel} · {item.content_type}
        </span>
        <span className="block mb-1 text-white/90">{item.topic}</span>
        {item.campaign && (
          <span className="block text-white/60 text-[11px]">Campaign: {item.campaign}</span>
        )}
        <span className="block text-white/60 text-[11px]">
          Owner: {item.owner} · Status: {item.status}
        </span>
        {item.notes && (
          <span className="block text-white/60 mt-1.5 text-[11px]">Notes: {item.notes}</span>
        )}
      </span>
    </button>
  )
}
