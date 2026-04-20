import { useState } from 'react'
import { channelStyle, STATUS_STYLES } from '../utils/channels.js'
import { IconChevDn, IconChevUp, IconPlus, IconSparkle } from './Icons.jsx'

export default function TbcPanel({ items, onItemClick, onAdd }) {
  const [collapsed, setCollapsed] = useState(false)
  if (items.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-2)] hover:bg-[var(--bg)] transition"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 text-amber-700">
            <IconSparkle width={13} height={13} />
          </span>
          <span className="text-[13px] font-semibold text-[var(--text)]">
            Date TBC
          </span>
          <span className="text-[11.5px] text-[var(--text-3)]">
            {items.length} item{items.length === 1 ? '' : 's'} to schedule
          </span>
        </div>
        <span className="text-[var(--text-3)]">
          {collapsed ? <IconChevDn width={14} height={14} /> : <IconChevUp width={14} height={14} />}
        </span>
      </button>

      {!collapsed && (
        <div className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            {items.map((it) => {
              const style = channelStyle(it.channel)
              const ss = STATUS_STYLES[it.status] || STATUS_STYLES.Planned
              return (
                <button
                  key={it.id}
                  onClick={() => onItemClick(it)}
                  className="text-left max-w-xs rounded-lg px-3 py-2 text-[12px] border hover:shadow-pop transition"
                  style={{
                    backgroundColor: style.bg,
                    borderColor: 'rgba(14, 18, 48, 0.06)',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: style.text }}
                    />
                    <span className="font-semibold" style={{ color: style.text }}>
                      {it.channel} · {it.content_type}
                    </span>
                  </div>
                  <div className="text-[var(--text)] line-clamp-2 mb-1">{it.topic}</div>
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                    style={{ backgroundColor: ss.bg, color: ss.text }}
                  >
                    {it.status}
                  </span>
                </button>
              )
            })}
            <button
              onClick={() => onAdd(null)}
              className="text-[12px] text-[var(--text-2)] hover:text-[var(--accent)] px-3 py-2 rounded-lg border border-dashed border-[var(--border)] hover:border-[var(--accent)] transition inline-flex items-center gap-1.5"
            >
              <IconPlus width={12} height={12} />
              Add TBC item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
