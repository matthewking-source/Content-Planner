import { channelStyle, STATUS_STYLES } from '../utils/channels.js'

export default function CalendarItem({ item, onClick, onDragStart, onDragEnd, dragging }) {
  const style = channelStyle(item.channel)
  const published = item.status === 'Published'
  // Status stripe for anything that isn't the default "Planned"
  const showStatusStripe = item.status && item.status !== 'Planned'
  const statusStyle = STATUS_STYLES[item.status]
  const stripeColor = showStatusStripe ? statusStyle.text : null

  const handleDragStart = (e) => {
    if (!onDragStart) return
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.setData('application/x-wingate-item', item.id)
    onDragStart(item, e)
  }

  const handleDragEnd = (e) => {
    onDragEnd?.(item, e)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      draggable={Boolean(onDragStart)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="chip block w-full text-left relative group"
      style={{
        opacity: dragging ? 0.35 : published ? 0.65 : 1,
        cursor: onDragStart ? 'grab' : 'pointer',
      }}
    >
      <span
        className="item-pill"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          textDecoration: published ? 'line-through' : 'none',
          // Inset stripe on the left edge — respects the chip's border-radius
          boxShadow: stripeColor ? `inset 3px 0 0 0 ${stripeColor}` : 'none',
          paddingLeft: stripeColor ? '10px' : '6px',
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
