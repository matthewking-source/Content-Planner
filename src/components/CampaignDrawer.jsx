import { useEffect } from 'react'
import { channelStyle, STATUS_STYLES } from '../utils/channels.js'
import { prettyDate } from '../utils/dates.js'
import CommentsThread from './CommentsThread.jsx'
import { IconClose } from './Icons.jsx'

export default function CampaignDrawer({ campaign, items, onItemClick, onClose }) {
  const campaignItems = items
    .filter((i) => i.campaign === campaign)
    .sort((a, b) => (a.date || 'ZZZZ').localeCompare(b.date || 'ZZZZ'))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-[rgba(14,18,48,0.45)] backdrop-blur-sm z-40 flex justify-end animate-fade"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-md h-full shadow-modal flex flex-col animate-slide-r"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[var(--border-2)] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold">
              Campaign
            </div>
            <h2 className="text-[18px] font-semibold text-[var(--text)] tracking-tight mt-0.5 truncate">
              {campaign}
            </h2>
            <div className="text-[11.5px] text-[var(--text-3)] mt-0.5">
              {campaignItems.length} item{campaignItems.length === 1 ? '' : 's'} across the plan
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[var(--text-3)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <h3 className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-2">
              Items in this campaign
            </h3>
            <div className="space-y-1.5">
              {campaignItems.map((it) => {
                const cs = channelStyle(it.channel)
                const ss = STATUS_STYLES[it.status] || STATUS_STYLES.Planned
                return (
                  <button
                    key={it.id}
                    onClick={() => onItemClick(it)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[var(--bg)] border border-[var(--border-2)] flex items-start gap-2.5 transition group"
                  >
                    <div className="text-[11px] text-[var(--text-3)] w-20 shrink-0 pt-0.5 font-medium">
                      {prettyDate(it.date)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className="chnchip"
                          style={{ backgroundColor: cs.bg, color: cs.text, borderColor: 'transparent', padding: '2px 8px 2px 6px', fontSize: '10.5px' }}
                        >
                          <span className="dot" style={{ backgroundColor: cs.text }} />
                          {it.channel}
                        </span>
                        <span className="text-[10.5px] text-[var(--text-3)]">{it.content_type}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: ss.bg, color: ss.text }}
                        >
                          {it.status}
                        </span>
                      </div>
                      <div className="text-[12.5px] text-[var(--text)] line-clamp-2 group-hover:text-[var(--accent)]">
                        {it.topic}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <CommentsThread targetType="campaign" targetId={campaign} />
        </div>
      </div>
    </div>
  )
}
