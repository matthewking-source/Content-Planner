import { IconCalendar, IconWeek, IconDay, IconList, IconDownload, IconPlus } from './Icons.jsx'

const VIEWS = [
  { key: 'month', label: 'Month', Icon: IconCalendar },
  { key: 'week',  label: 'Week',  Icon: IconWeek },
  { key: 'day',   label: 'Day',   Icon: IconDay },
  { key: 'list',  label: 'List',  Icon: IconList },
]

export default function Header({
  totalCount,
  visibleCount,
  view,
  onViewChange,
  onAdd,
  onExport,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-brand-900 flex items-center justify-center shrink-0">
            <div className="w-3 h-3 rounded-sm bg-white grid grid-cols-2 grid-rows-2 gap-[1px] overflow-hidden">
              <div className="bg-brand-900"></div>
              <div className="bg-brand-900"></div>
              <div className="bg-brand-900"></div>
              <div className="bg-brand-900"></div>
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold text-[var(--text)] leading-none truncate">
              Wingate Content Planner
            </h1>
            <p className="text-[11px] text-[var(--text-3)] mt-1 leading-none">
              {visibleCount} of {totalCount} shown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop segmented control — text labels */}
          <div className="hidden md:inline-flex rounded-lg bg-[var(--bg)] p-0.5 border border-[var(--border)]">
            {VIEWS.map(({ key, label, Icon }) => {
              const active = view === key
              return (
                <button
                  key={key}
                  className={`px-2.5 py-1.5 text-[12.5px] rounded-md inline-flex items-center gap-1.5 transition ${
                    active
                      ? 'bg-white text-[var(--text)] shadow-sm font-medium'
                      : 'text-[var(--text-2)] hover:text-[var(--text)]'
                  }`}
                  onClick={() => onViewChange(key)}
                >
                  <Icon width={14} height={14} />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Mobile segmented control — icons only */}
          <div className="md:hidden inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--bg)]">
            {VIEWS.map(({ key, label, Icon }) => {
              const active = view === key
              return (
                <button
                  key={key}
                  className={`p-1.5 rounded-md transition ${
                    active
                      ? 'bg-white text-[var(--accent)] shadow-sm'
                      : 'text-[var(--text-2)]'
                  }`}
                  onClick={() => onViewChange(key)}
                  aria-label={`${label} view`}
                  title={label}
                >
                  <Icon width={15} height={15} />
                </button>
              )
            })}
          </div>

          <button
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] rounded-lg text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--bg)] border border-transparent hover:border-[var(--border)] transition"
            onClick={onExport}
            title="Export visible items to CSV"
          >
            <IconDownload width={14} height={14} />
            Export
          </button>

          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-lg bg-[var(--text)] text-white font-medium hover:bg-black transition shadow-sm"
            onClick={onAdd}
          >
            <IconPlus width={14} height={14} />
            Add
          </button>
        </div>
      </div>
    </header>
  )
}
