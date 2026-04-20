import { useEffect, useRef, useState } from 'react'
import { CHANNELS, channelStyle } from '../utils/channels.js'
import { DEPARTMENTS } from '../utils/departments.js'
import { IconClose, IconCheck, IconSparkle } from './Icons.jsx'

const AUTHOR_KEY = 'wingate_content_author'
const DEPT_KEY = 'wingate_requester_dept'

function loadPref(key, fallback = '') {
  if (typeof window === 'undefined') return fallback
  return window.localStorage.getItem(key) || fallback
}

export default function RequestModal({ onSubmit, onClose }) {
  const [name, setName] = useState(() => loadPref(AUTHOR_KEY, ''))
  const [department, setDepartment] = useState(() => loadPref(DEPT_KEY, 'All Stars'))
  const [requestedDate, setRequestedDate] = useState('')
  const [channels, setChannels] = useState(new Set())
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    if (nameRef.current && !name) nameRef.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const toggleChannel = (key) => {
    setChannels((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const submit = async (e) => {
    e?.preventDefault()
    if (saving) return
    if (!name.trim()) { setError('Please add your name.'); return }
    if (!description.trim()) { setError('Please describe what you would like posted.'); return }
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        requester_name: name.trim(),
        requester_department: department || 'Other',
        requested_date: requestedDate || null,
        channel_preferences: Array.from(channels),
        description: description.trim(),
        notes: notes.trim(),
      })
      try {
        window.localStorage.setItem(AUTHOR_KEY, name.trim())
        window.localStorage.setItem(DEPT_KEY, department)
      } catch {}
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not submit the request')
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return (
      <Shell onClose={onClose}>
        <div className="px-6 py-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-700 mb-4">
            <IconCheck width={26} height={26} />
          </div>
          <h2 className="text-[18px] font-semibold text-[var(--text)] mb-1">
            Thanks, {name.split(/\s+/)[0]}!
          </h2>
          <p className="text-[13px] text-[var(--text-2)] max-w-sm mx-auto">
            Your request has been sent to Matt and Fran. You'll see it appear on the calendar when it's approved.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 text-[13px] bg-[var(--text)] text-white rounded-lg hover:bg-black font-medium"
          >
            Done
          </button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell onClose={onClose}>
      <div className="px-5 pt-4 pb-3 border-b border-[var(--border-2)] bg-amber-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-semibold text-amber-700">
              <IconSparkle width={12} height={12} />
              Content request
            </div>
            <h2 className="text-[17px] font-semibold text-[var(--text)] mt-1">
              Request a social post or marketing activity
            </h2>
            <p className="text-[12px] text-[var(--text-2)] mt-1">
              Tell Matt and Fran what you'd like promoted. They'll review and add it to the calendar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[var(--text-3)] hover:bg-white hover:text-[var(--text)] inline-flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Your name" required>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last"
              className="inp"
            />
          </Field>
          <Field label="Department / area" required>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="inp bg-white"
            >
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        <Field label="What would you like posted?" required>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Tell people about our new pottery classes starting Tuesday 5 May, 6pm at Reiber Hall. Photos available from reception."
            className="inp resize-y"
          />
        </Field>

        <Field label="When would you like it to go out?" hint="Optional — leave blank if flexible">
          <input
            type="date"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            className="inp max-w-[220px]"
          />
        </Field>

        <Field label="Which channels?" hint="Optional — Matt and Fran will choose if you don't mind">
          <div className="space-y-2">
            {['Digital', 'Traditional'].map((group) => (
              <div key={group}>
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-3)] mb-1">{group}</div>
                <div className="flex flex-wrap gap-1.5">
                  {CHANNELS.filter((c) => c.group === group).map((c) => {
                    const on = channels.has(c.key)
                    const style = channelStyle(c.key)
                    return (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => toggleChannel(c.key)}
                        className="chnchip"
                        style={{
                          backgroundColor: on ? style.bg : 'transparent',
                          color: on ? style.text : 'var(--text-2)',
                          borderColor: on ? style.text : 'var(--border)',
                          fontWeight: on ? 600 : 500,
                        }}
                      >
                        <span className="dot" style={{ backgroundColor: style.text }} />
                        {c.key}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Field>

        <Field label="Anything else?" hint="Optional — photos available, people to tag, key messaging">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Optional notes"
            className="inp resize-y"
          />
        </Field>

        {error && (
          <div className="text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </form>

      <div className="px-5 py-3 border-t border-[var(--border-2)] bg-[var(--surface-2)] flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 text-[13px] text-[var(--text-2)] hover:text-[var(--text)] rounded-lg"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60 rounded-lg font-medium shadow-sm transition"
        >
          {saving ? 'Sending…' : (
            <>
              <IconCheck width={14} height={14} />
              Send request
            </>
          )}
        </button>
      </div>

      <style>{`
        .inp {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13.5px;
          color: var(--text);
          background: var(--surface);
          transition: border-color 0.12s, box-shadow 0.12s;
          outline: none;
        }
        .inp:hover { border-color: var(--text-3); }
        .inp:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-tint);
        }
      `}</style>
    </Shell>
  )
}

function Shell({ onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-[rgba(14,18,48,0.45)] backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-xl sm:rounded-2xl shadow-modal overflow-hidden max-h-[94vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[12px] font-semibold text-[var(--text-2)]">
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
        {hint && <span className="text-[10.5px] text-[var(--text-3)] italic">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
