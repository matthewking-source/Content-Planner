import { useEffect, useRef, useState } from 'react'
import { CHANNELS, STATUSES, STATUS_STYLES, channelStyle } from '../utils/channels.js'
import { IconSearch, IconChevDn, IconChevUp, IconFilter, IconClose } from './Icons.jsx'

export default function Filters({
  allItems,
  allCampaigns,
  filters,
  onChange,
  onOpenCampaign,
}) {
  const [expanded, setExpanded] = useState(false)
  const searchRef = useRef(null)

  // Expose focus method globally so Cmd+K works from anywhere
  useEffect(() => {
    const onKey = (e) => {
      const inInput =
        e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)
      if (!inInput && e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const { channels, campaign, statuses, search } = filters

  // Pre-compute counts per option (against the full items list, not filtered — so we
  // show what's *available*, not what's hidden).
  const channelCounts = {}
  const statusCounts = {}
  const campaignCounts = {}
  for (const it of allItems) {
    channelCounts[it.channel] = (channelCounts[it.channel] || 0) + 1
    statusCounts[it.status] = (statusCounts[it.status] || 0) + 1
    if (it.campaign) campaignCounts[it.campaign] = (campaignCounts[it.campaign] || 0) + 1
  }

  const toggleChannel = (key) => {
    const next = new Set(channels)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onChange({ ...filters, channels: next })
  }

  const allOn = () => onChange({ ...filters, channels: new Set(CHANNELS.map((c) => c.key)) })
  const noneOn = () => onChange({ ...filters, channels: new Set() })

  const toggleStatus = (s) => {
    const next = new Set(statuses)
    if (next.has(s)) next.delete(s)
    else next.add(s)
    onChange({ ...filters, statuses: next })
  }

  const setCampaign = (c) => {
    onChange({ ...filters, campaign: filters.campaign === c ? null : c })
  }

  const reset = () => {
    onChange({
      channels: new Set(CHANNELS.map((c) => c.key)),
      statuses: new Set(STATUSES),
      campaign: null,
      search: '',
    })
  }

  const activeFilterCount =
    (channels.size < CHANNELS.length ? 1 : 0) +
    (statuses.size < STATUSES.length ? 1 : 0) +
    (campaign ? 1 : 0) +
    (search.trim() ? 1 : 0)

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        <div className="relative flex-1">
          <IconSearch
            width={15}
            height={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none"
          />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search topic, campaign, notes…"
            value={search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-9 py-2 text-[13px] bg-[var(--bg)] border border-transparent focus:border-[var(--accent)] focus:bg-white rounded-lg transition outline-none"
          />
          {!search && (
            <span className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] text-[var(--text-3)] pointer-events-none">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--border)] font-semibold">/</kbd>
            </span>
          )}
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-[13px] rounded-lg border transition ${
            expanded
              ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
              : 'border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg)]'
          }`}
        >
          <IconFilter width={14} height={14} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-[var(--accent)] text-white">
              {activeFilterCount}
            </span>
          )}
          {expanded ? <IconChevUp width={14} height={14} /> : <IconChevDn width={14} height={14} />}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={reset}
            title="Clear all filters"
            className="inline-flex items-center gap-1 px-2 py-2 text-[12px] text-[var(--text-3)] hover:text-[var(--text)] transition"
          >
            <IconClose width={13} height={13} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-[var(--border-2)] p-3 sm:p-4 space-y-4 animate-fade">
          {/* Channels */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider">
                Channels
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={allOn}
                  className="text-[11px] text-[var(--text-2)] hover:text-[var(--accent)]"
                >
                  All
                </button>
                <span className="text-[var(--text-3)]">·</span>
                <button
                  onClick={noneOn}
                  className="text-[11px] text-[var(--text-2)] hover:text-[var(--accent)]"
                >
                  None
                </button>
              </div>
            </div>

            {['Digital', 'Traditional'].map((group) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-3)] mb-1.5 ml-0.5">
                  {group}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CHANNELS.filter((c) => c.group === group).map((c) => {
                    const on = channels.has(c.key)
                    const style = channelStyle(c.key)
                    const count = channelCounts[c.key] || 0
                    return (
                      <button
                        key={c.key}
                        onClick={() => toggleChannel(c.key)}
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
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-2">
              Status
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const on = statuses.has(s)
                const ss = STATUS_STYLES[s]
                const count = statusCounts[s] || 0
                return (
                  <button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    className="chnchip"
                    style={{
                      backgroundColor: on ? ss.bg : 'transparent',
                      color: on ? ss.text : 'var(--text-3)',
                      borderColor: on ? 'transparent' : 'var(--border)',
                      opacity: count === 0 ? 0.4 : 1,
                    }}
                  >
                    <span className="dot" style={{ backgroundColor: ss.text }} />
                    {s}
                    <span className="ml-0.5 opacity-60 font-normal">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Campaigns */}
          {allCampaigns.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider mb-2">
                Campaigns ({allCampaigns.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allCampaigns.map((c) => {
                  const on = campaign === c
                  const count = campaignCounts[c] || 0
                  return (
                    <span
                      key={c}
                      className="inline-flex items-stretch rounded-full overflow-hidden border"
                      style={{ borderColor: on ? 'var(--accent)' : 'var(--border)' }}
                    >
                      <button
                        onClick={() => setCampaign(c)}
                        className={`px-2.5 py-1 text-[11.5px] transition inline-flex items-center gap-1.5 ${
                          on
                            ? 'bg-[var(--accent)] text-white font-medium'
                            : 'text-[var(--text-2)] hover:bg-[var(--bg)]'
                        }`}
                      >
                        {c}
                        <span className={on ? 'text-white/80' : 'text-[var(--text-3)]'}>{count}</span>
                      </button>
                      <button
                        onClick={() => onOpenCampaign(c)}
                        title="Open campaign detail and comments"
                        aria-label={`Open campaign ${c}`}
                        className={`px-2 py-1 text-[11px] transition border-l ${
                          on
                            ? 'bg-[var(--accent)] text-white border-white/20 hover:bg-[var(--accent-dk)]'
                            : 'text-[var(--text-3)] hover:text-[var(--accent)] hover:bg-[var(--bg)] border-[var(--border)]'
                        }`}
                      >
                        Open
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
