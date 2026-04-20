import { startOfWeek, addWeeks } from 'date-fns'
import { IconCalendar, IconWeek, IconDay, IconList, IconArrowR } from '../Icons.jsx'

const VIEWS = [
  { key: 'month', label: 'Month', Icon: IconCalendar },
  { key: 'week',  label: 'Week',  Icon: IconWeek },
  { key: 'day',   label: 'Day',   Icon: IconDay },
  { key: 'list',  label: 'List',  Icon: IconList },
]

export default function ViewNav({ view, onViewChange, onAnchorChange, onClose }) {
  const handleView = (v) => {
    onViewChange(v)
    onClose?.()
  }

  const handleJump = (targetDate) => {
    onAnchorChange(targetDate)
    onClose?.()
  }

  return (
    <div>
      <SidebarHeading>View</SidebarHeading>
      <div className="space-y-0.5">
        {VIEWS.map(({ key, label, Icon }) => {
          const active = view === key
          return (
            <button
              key={key}
              onClick={() => handleView(key)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition ${
                active
                  ? 'bg-[var(--accent-tint)] text-[var(--accent)] font-medium'
                  : 'text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)]'
              }`}
            >
              <Icon width={15} height={15} />
              {label}
            </button>
          )
        })}
      </div>

      <SidebarHeading className="mt-4">Jump to</SidebarHeading>
      <div className="space-y-0.5">
        <JumpBtn onClick={() => handleJump(new Date())}>Today</JumpBtn>
        <JumpBtn onClick={() => handleJump(startOfWeek(new Date(), { weekStartsOn: 1 }))}>This week</JumpBtn>
        <JumpBtn onClick={() => handleJump(addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1))}>Next week</JumpBtn>
      </div>
    </div>
  )
}

function JumpBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[13px] text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition group"
    >
      <span>{children}</span>
      <IconArrowR width={12} height={12} className="opacity-0 group-hover:opacity-100 transition" />
    </button>
  )
}

export function SidebarHeading({ children, className = '' }) {
  return (
    <div className={`text-[10px] font-semibold text-[var(--text-3)] uppercase tracking-widest px-2.5 mb-1.5 ${className}`}>
      {children}
    </div>
  )
}
