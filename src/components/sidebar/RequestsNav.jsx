import { SidebarHeading } from './ViewNav.jsx'
import { IconSparkle, IconPlus, IconArrowR } from '../Icons.jsx'

export default function RequestsNav({ pendingCount, onReview, onSubmit, onClose }) {
  const anyPending = pendingCount > 0

  const handleReview = () => {
    onReview()
    onClose?.()
  }
  const handleSubmit = () => {
    onSubmit()
    onClose?.()
  }

  return (
    <div>
      <SidebarHeading>Requests</SidebarHeading>
      <div
        className={`rounded-xl border p-2.5 ${
          anyPending ? 'border-amber-300 bg-amber-50' : 'border-amber-200 bg-amber-50/60'
        }`}
      >
        <button
          onClick={handleReview}
          className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition ${
            anyPending
              ? 'bg-amber-400/20 hover:bg-amber-400/30'
              : 'hover:bg-amber-100'
          }`}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg shrink-0 ${
              anyPending ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
            }`}>
              <IconSparkle width={12} height={12} />
            </span>
            <span className="text-[12.5px] font-semibold text-amber-900 truncate">
              {anyPending ? `${pendingCount} pending` : 'No pending'}
            </span>
          </span>
          <IconArrowR width={12} height={12} className="text-amber-700 shrink-0" />
        </button>

        <button
          onClick={handleSubmit}
          className="w-full mt-1.5 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[12px] font-medium text-amber-800 bg-white border border-amber-300 hover:bg-amber-100 transition"
        >
          <IconPlus width={12} height={12} />
          Submit a request
        </button>
      </div>
    </div>
  )
}
