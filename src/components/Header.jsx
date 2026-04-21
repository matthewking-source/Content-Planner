import { IconCalendar, IconWeek, IconDay, IconList, IconDownload, IconPlus, IconMenu, IconSparkle } from './Icons.jsx'

const VIEWS = [
  { key: 'month', label: 'Month', Icon: IconCalendar },
  { key: 'week',  label: 'Week',  Icon: IconWeek },
  { key: 'day',   label: 'Day',   Icon: IconDay },
  { key: 'list',  label: 'List',  Icon: IconList },
  { key: 'dates', label: 'Dates', Icon: IconSparkle },
]

export default function Header({
  totalCount,
  visibleCount,
  view,
  onViewChange,
  onAdd,
  onExport,
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-[var(--border)]">
      <div className="px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-lg text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
            aria-label="Open menu"
          >
            <IconMenu />
          </button>

          <a
            href="/"
            className="shrink-0 inline-flex items-center"
            aria-label="The Wingate Centre — home"
          >
            <img
              src="/logo.png"
              alt="The Wingate Centre"
              className="h-9 w-auto block"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </a>
          <div className="min-w-0">
            <h1 className="text-[14px] sm:text-[15px] font-semibold text-[var(--text)] leading-none truncate">
              Content Planner
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
