import { categoryStyle } from '../../utils/dateCategories.js'
import { relativeUntil, isoDate } from '../../utils/dates.js'
import { SidebarHeading } from './ViewNav.jsx'
import { IconPlus, IconArrowR } from '../Icons.jsx'

export default function DatesNav({ dates, onItemClick, onAdd, onOpenAll, onClose }) {
  const today = isoDate(new Date())
  const upcoming = dates
    .filter((d) => (d.end_date || d.date) >= today)
    .slice(0, 5)

  const handle = (fn, arg) => {
    fn?.(arg)
    onClose?.()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <SidebarHeading className="mb-0">Important dates</SidebarHeading>
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => handle(onAdd)}
            className="text-[10.5px] text-[var(--text-3)] hover:text-[var(--accent)] inline-flex items-center gap-0.5"
            title="Add"
          >
            <IconPlus width={10} height={10} />
            Add
          </button>
          <span className="text-[var(--text-3)]">·</span>
          <button
            onClick={() => handle(onOpenAll)}
            className="text-[10.5px] text-[var(--text-3)] hover:text-[var(--accent)]"
          >
            All
          </button>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-[11px] text-[var(--text-3)] italic px-2.5 py-1">
          None upcoming
        </div>
      ) : (
        <div className="space-y-0.5">
          {upcoming.map((d) => {
            const c = categoryStyle(d.category)
            return (
              <button
                key={d.id}
                onClick={() => handle(onItemClick, d)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg)] transition group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.text }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[var(--text)] truncate group-hover:text-[var(--accent)]">
                      {d.label}
                    </div>
                    <div className="text-[10.5px] text-[var(--text-3)] flex items-center gap-1.5 mt-0.5">
                      <span>{relativeUntil(d.date)}</span>
                      <span>·</span>
                      <span className="truncate">{d.category}</span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
