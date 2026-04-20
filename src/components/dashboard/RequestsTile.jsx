import { IconSparkle, IconArrowR, IconPlus } from '../Icons.jsx'

/**
 * Yellow banner above the dashboard tiles — always visible.
 *
 *   • When there are pending requests → prominent "N pending" + Review CTA.
 *   • When there are none → subdued encouragement to submit.
 */
export default function RequestsTile({ pendingCount, onReview, onSubmit }) {
  const anyPending = pendingCount > 0

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap transition ${
        anyPending
          ? 'border-amber-300 bg-amber-50 shadow-card'
          : 'border-amber-200 bg-amber-50/60'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
          anyPending ? 'bg-amber-400 text-amber-900' : 'bg-amber-100 text-amber-700'
        }`}>
          <IconSparkle width={15} height={15} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-amber-700">
            Requests
          </div>
          <div className="text-[14px] font-semibold text-[var(--text)] leading-tight">
            {anyPending
              ? `${pendingCount} pending request${pendingCount === 1 ? '' : 's'} to review`
              : 'No pending requests'}
          </div>
          <div className="text-[11.5px] text-[var(--text-2)] mt-0.5">
            Other teams can send in content requests for you and Fran to approve.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 font-medium transition"
        >
          <IconPlus width={13} height={13} />
          Submit a request
        </button>
        <button
          onClick={onReview}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] rounded-lg font-medium transition ${
            anyPending
              ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
              : 'text-amber-700 hover:bg-amber-100'
          }`}
        >
          Review
          <IconArrowR width={13} height={13} />
        </button>
      </div>
    </div>
  )
}
