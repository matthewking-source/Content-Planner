import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { channelStyle } from '../../utils/channels.js'
import { SidebarHeading } from './ViewNav.jsx'
import { IconClock } from '../Icons.jsx'

export default function ActivityFeed({ items, onItemClick, limit = 5 }) {
  const recent = [...items]
    .filter((i) => i.updated_at)
    .sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
    .slice(0, limit)

  if (recent.length === 0) return null

  return (
    <div>
      <SidebarHeading>
        <span className="inline-flex items-center gap-1.5">
          <IconClock width={11} height={11} />
          Recent activity
        </span>
      </SidebarHeading>
      <div className="space-y-0.5">
        {recent.map((it) => {
          const cs = channelStyle(it.channel)
          return (
            <button
              key={it.id}
              onClick={() => onItemClick(it)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg)] transition group"
            >
              <div className="flex items-start gap-2 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: cs.text }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[var(--text)] truncate group-hover:text-[var(--accent)]">
                    {it.topic}
                  </div>
                  <div className="text-[10.5px] text-[var(--text-3)] mt-0.5 flex items-center gap-1.5">
                    <span>{it.channel}</span>
                    <span>·</span>
                    <span>{relative(it.updated_at)}</span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function relative(iso) {
  try {
    return formatDistanceToNowStrict(parseISO(iso), { addSuffix: true })
  } catch {
    return ''
  }
}
