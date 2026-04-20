import { useEffect, useState } from 'react'
import { format, parseISO, formatDistanceToNowStrict } from 'date-fns'
import { channelStyle } from '../utils/channels.js'
import { prettyDate } from '../utils/dates.js'
import { IconClose, IconCheck, IconTrash, IconChevDn, IconChevUp, IconSparkle } from './Icons.jsx'

export default function RequestsPanel({
  requests,
  tableMissing,
  onClose,
  onApprove,
  onIgnore,
  onReopen,
  onDelete,
  onSubmitNew,
}) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const pending = requests.filter((r) => r.status === 'pending')
  const archived = requests.filter((r) => r.status !== 'pending')
  const [archiveOpen, setArchiveOpen] = useState(false)

  return (
    <div
      className="fixed inset-0 bg-[rgba(14,18,48,0.45)] backdrop-blur-sm z-40 flex justify-end animate-fade"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg h-full shadow-modal flex flex-col animate-slide-r"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[var(--border-2)] flex items-start justify-between gap-3 bg-amber-50">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-semibold text-amber-700">
              <IconSparkle width={12} height={12} />
              Review requests
            </div>
            <h2 className="text-[17px] font-semibold text-[var(--text)] mt-1">
              Content requests
            </h2>
            <p className="text-[12px] text-[var(--text-2)] mt-1">
              {pending.length} pending · {archived.length} archived
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSubmitNew}
              className="px-2.5 py-1.5 text-[12px] rounded-lg border border-amber-300 bg-white text-amber-700 hover:bg-amber-100 transition"
            >
              + New
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-[var(--text-3)] hover:bg-white hover:text-[var(--text)] inline-flex items-center justify-center"
              aria-label="Close"
            >
              <IconClose />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tableMissing && (
            <div className="m-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-900">
              <strong>Supabase table missing.</strong> Run the migration at{' '}
              <code>supabase/migrations/0001_content_requests.sql</code> in Supabase's SQL editor,
              then refresh.
            </div>
          )}

          {!tableMissing && pending.length === 0 && (
            <div className="p-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg)] text-[var(--text-3)] mb-3">
                <IconSparkle width={18} height={18} />
              </div>
              <p className="text-[13px] text-[var(--text-2)]">
                No pending requests. All caught up.
              </p>
            </div>
          )}

          {pending.length > 0 && (
            <div className="p-3 sm:p-4 space-y-2">
              <div className="text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest px-1">
                Pending · {pending.length}
              </div>
              {pending.map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  onApprove={onApprove}
                  onIgnore={onIgnore}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}

          {archived.length > 0 && (
            <div className="border-t border-[var(--border-2)] mt-2">
              <button
                onClick={() => setArchiveOpen((a) => !a)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg)] transition"
              >
                <span className="text-[10.5px] font-semibold text-[var(--text-3)] uppercase tracking-widest">
                  Archived · {archived.length}
                </span>
                {archiveOpen ? <IconChevUp width={14} height={14} /> : <IconChevDn width={14} height={14} />}
              </button>
              {archiveOpen && (
                <div className="p-3 sm:p-4 space-y-2 animate-fade">
                  {archived.map((r) => (
                    <RequestCard
                      key={r.id}
                      request={r}
                      archived
                      onReopen={onReopen}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RequestCard({ request, archived, onApprove, onIgnore, onReopen, onDelete }) {
  const [ignoring, setIgnoring] = useState(false)
  const [reason, setReason] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const age = request.created_at ? formatDistanceToNowStrict(parseISO(request.created_at), { addSuffix: true }) : ''

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 ${
        archived
          ? 'border-[var(--border-2)] bg-[var(--surface-2)] opacity-80'
          : 'border-amber-200 bg-amber-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[var(--text)]">
            {request.requester_name}
            <span className="text-[11px] font-normal text-[var(--text-3)] ml-1.5">
              · {request.requester_department}
            </span>
          </div>
          <div className="text-[11px] text-[var(--text-3)] mt-0.5">
            {age}
            {request.requested_date && <> · wants {prettyDate(request.requested_date)}</>}
          </div>
        </div>
        {archived && request.status && (
          <span
            className="px-2 py-0.5 rounded-full text-[10.5px] font-medium shrink-0"
            style={{
              backgroundColor: request.status === 'approved' ? '#d1fae5' : '#fee2e2',
              color: request.status === 'approved' ? '#065f46' : '#991b1b',
            }}
          >
            {request.status}
          </span>
        )}
      </div>

      <div className="text-[13px] text-[var(--text)] mb-2 whitespace-pre-wrap">
        {request.description}
      </div>

      {request.notes && (
        <div className="text-[12px] text-[var(--text-2)] italic bg-white/60 rounded-md px-2 py-1.5 mb-2">
          {request.notes}
        </div>
      )}

      {request.channel_preferences?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {request.channel_preferences.map((k) => {
            const s = channelStyle(k)
            return (
              <span
                key={k}
                className="px-2 py-0.5 rounded-full text-[10.5px] font-medium"
                style={{ backgroundColor: s.bg, color: s.text }}
              >
                {k}
              </span>
            )
          })}
        </div>
      )}

      {archived && request.ignored_reason && (
        <div className="text-[11.5px] text-[var(--text-3)] mb-2">
          <span className="font-semibold text-[var(--text-2)]">Reason:</span> {request.ignored_reason}
        </div>
      )}
      {archived && request.reviewed_by && (
        <div className="text-[10.5px] text-[var(--text-3)] mb-2">
          {request.status === 'approved' ? 'Approved' : 'Ignored'} by {request.reviewed_by}
          {request.reviewed_at && <> · {format(parseISO(request.reviewed_at), 'd MMM yyyy')}</>}
        </div>
      )}

      {/* Actions */}
      {!archived && !ignoring && !confirmDelete && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onApprove(request)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            <IconCheck width={13} height={13} />
            Approve + add to calendar
          </button>
          <button
            onClick={() => setIgnoring(true)}
            className="px-3 py-1.5 text-[12.5px] text-[var(--text-2)] hover:bg-white rounded-lg transition"
          >
            Ignore
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="ml-auto text-[var(--text-3)] hover:text-red-600 p-1 rounded transition"
            aria-label="Delete"
            title="Delete"
          >
            <IconTrash width={13} height={13} />
          </button>
        </div>
      )}

      {!archived && ignoring && (
        <div className="mt-2 space-y-2">
          <input
            type="text"
            placeholder="Optional reason (e.g. already covered by Marathon campaign)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-[12.5px] bg-white focus:border-[var(--accent)] outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => onIgnore(request, reason)}
              className="px-3 py-1.5 text-[12.5px] bg-[var(--text)] text-white rounded-lg hover:bg-black font-medium"
            >
              Confirm ignore
            </button>
            <button
              onClick={() => { setIgnoring(false); setReason('') }}
              className="px-3 py-1.5 text-[12.5px] text-[var(--text-2)] hover:bg-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {archived && !confirmDelete && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onReopen(request)}
            className="px-3 py-1.5 text-[12.5px] text-[var(--accent)] hover:bg-[var(--accent-tint)] rounded-lg transition"
          >
            Reopen
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="ml-auto text-[var(--text-3)] hover:text-red-600 p-1 rounded transition"
            aria-label="Delete"
            title="Delete"
          >
            <IconTrash width={13} height={13} />
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="mt-2 flex items-center justify-between gap-2 text-[12px] bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <span className="text-red-700 font-medium">Delete this request permanently?</span>
          <div className="flex gap-1">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1 text-[11.5px] text-[var(--text-2)] hover:bg-white rounded"
            >
              No
            </button>
            <button
              onClick={() => onDelete(request.id)}
              className="px-2 py-1 text-[11.5px] text-white bg-red-600 hover:bg-red-700 rounded font-medium"
            >
              Yes, delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
