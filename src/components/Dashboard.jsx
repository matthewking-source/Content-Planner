import ThisWeekTile from './dashboard/ThisWeekTile.jsx'
import NeedsAttentionTile from './dashboard/NeedsAttentionTile.jsx'
import ChannelHeatmap from './dashboard/ChannelHeatmap.jsx'
import ChannelRow from './dashboard/ChannelRow.jsx'
import { IconChevDn, IconChevUp, IconGrid } from './Icons.jsx'

export default function Dashboard({
  collapsed,
  onToggleCollapsed,
  allItems,
  filters,
  onFiltersChange,
  onItemClick,
  onQuickFilter,
  onHeatmapCellClick,
}) {
  return (
    <section className="space-y-3 animate-fade">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--accent-tint)] text-[var(--accent)]">
            <IconGrid width={14} height={14} />
          </span>
          <div>
            <h2 className="text-[14px] font-semibold text-[var(--text)] leading-none">
              Dashboard
            </h2>
            <p className="text-[11px] text-[var(--text-3)] mt-1 leading-none">
              Everything at a glance
            </p>
          </div>
        </div>
        <button
          onClick={onToggleCollapsed}
          className="inline-flex items-center gap-1 px-2 py-1 text-[11.5px] rounded-lg text-[var(--text-3)] hover:text-[var(--text)] hover:bg-white transition"
        >
          {collapsed ? 'Expand' : 'Collapse'}
          {collapsed ? <IconChevDn width={12} height={12} /> : <IconChevUp width={12} height={12} />}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ThisWeekTile
              allItems={allItems}
              onQuickFilter={onQuickFilter}
            />
            <NeedsAttentionTile
              allItems={allItems}
              onItemClick={onItemClick}
              onQuickFilter={onQuickFilter}
            />
            <ChannelHeatmap
              allItems={allItems}
              onCellClick={onHeatmapCellClick}
            />
          </div>

          <ChannelRow
            allItems={allItems}
            filters={filters}
            onChange={onFiltersChange}
          />
        </>
      )}
    </section>
  )
}
