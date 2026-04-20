import { SidebarHeading } from './ViewNav.jsx'
import { IconArrowR } from '../Icons.jsx'

export default function CampaignNav({ allItems, filters, onChange, onOpenCampaign }) {
  const counts = {}
  for (const it of allItems) {
    if (!it.campaign) continue
    counts[it.campaign] = (counts[it.campaign] || 0) + 1
  }
  const campaigns = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]) // most items first
    .map(([k]) => k)

  if (campaigns.length === 0) return null

  const active = filters.campaign
  const setCampaign = (c) => onChange({ ...filters, campaign: active === c ? null : c })

  return (
    <div>
      <SidebarHeading>
        Campaigns <span className="text-[var(--text-3)] font-normal normal-case tracking-normal">· {campaigns.length}</span>
      </SidebarHeading>
      <div className="space-y-0.5 max-h-[260px] overflow-y-auto pr-1">
        {campaigns.map((c) => {
          const on = active === c
          return (
            <div key={c} className="flex items-stretch gap-0.5 group">
              <button
                onClick={() => setCampaign(c)}
                className={`flex-1 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[13px] transition min-w-0 ${
                  on
                    ? 'bg-[var(--accent)] text-white font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)]'
                }`}
              >
                <span className="truncate text-left">{c}</span>
                <span className={on ? 'text-white/80 shrink-0' : 'text-[var(--text-3)] shrink-0'}>
                  {counts[c]}
                </span>
              </button>
              <button
                onClick={() => onOpenCampaign(c)}
                title={`Open ${c}`}
                aria-label={`Open campaign ${c}`}
                className={`px-1.5 rounded-lg transition ${
                  on
                    ? 'text-white/80 hover:bg-white/10'
                    : 'text-[var(--text-3)] opacity-0 group-hover:opacity-100 hover:text-[var(--accent)] hover:bg-[var(--bg)]'
                }`}
              >
                <IconArrowR width={12} height={12} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
