import { channelStyle } from '../../utils/channels.js'
import { within48h, prettyDate } from '../../utils/dates.js'
import { IconAlert } from '../Icons.jsx'

export default function NeedsAttentionTile({ allItems, onItemClick, onQuickFilter }) {
  const items = allItems
    .filter(
      (i) =>
        i.date &&
        (i.status === 'Draft' || i.status === 'Planned') &&
        within48h(i.date),
    )
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))

  const none = items.length === 0

  return (
    <div
      className={`bg-white rounded-xl shadow-card p-4 h-full flex flex-col ${
        none ? '' : 'ring-1 ring-amber-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest">
          Needs attention
        </div>
        <div
          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg ${
            none ? 'bg-[var(--bg)] text-[var(--text-3)]' : 'bg-amber-100 text-amber-700'
          }`}
        >
          <IconAlert width={12} height={12} />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <div className={`text-[32px] font-semibold leading-none tabular-nums ${none ? 'text-[var(--text-3)]' : 'text-amber-700'}`}>
          {items.length}
        </div>
        <div className="text-[11.5px] text-[var(--text-3)]">
          {none ? 'all caught up' : 'due in 48h, still Draft or Planned'}
        </div>
      </div>

      {none ? (
        <p className="text-[12px] text-[var(--text-3)] italic mt-auto">
          Nothing currently flagged — keep it up.
        </p>
      ) : (
        <>
          <div className="space-y-1 flex-1 min-h-0">
            {items.slice(0, 2).map((it) => {
              const cs = channelStyle(it.channel)
              return (
                <button
                  key={it.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onItemClick(it)
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[var(--bg)] transition flex items-start gap-2 group"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: cs.text }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[var(--text)] truncate group-hover:text-[var(--accent)]">
                      {it.topic}
                    </div>
                    <div className="text-[10.5px] text-[var(--text-3)]">
                      {prettyDate(it.date)} · {it.status}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {items.length > 2 && (
            <button
              onClick={() => onQuickFilter?.('needs-attention')}
              className="mt-2 text-[11px] text-amber-700 font-medium hover:text-amber-800"
            >
              View all {items.length} →
            </button>
          )}
        </>
      )}
    </div>
  )
}
