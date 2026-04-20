import { useEffect, useRef, useState } from 'react'
import { addDays, format } from 'date-fns'
import {
  CHANNELS,
  STATUSES,
  STATUS_STYLES,
  channelStyle,
  CONTENT_TYPE_SUGGESTIONS,
} from '../utils/channels.js'
import CommentsThread from './CommentsThread.jsx'
import { IconClose, IconTrash, IconCopy, IconCheck } from './Icons.jsx'
import { isoDate, prettyDate } from '../utils/dates.js'

const EMPTY = {
  date: '',
  channel: 'Facebook',
  content_type: 'Post',
  topic: '',
  campaign: '',
  owner: 'Matt',
  status: 'Planned',
  notes: '',
}

export default function ItemModal({
  mode,
  initial,
  knownCampaigns = [],
  knownOwners = [],
  onSave,
  onDelete,
  onDuplicate,
  onClose,
}) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial || {}) }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const topicRef = useRef(null)

  useEffect(() => {
    setForm({ ...EMPTY, ...(initial || {}) })
    setConfirmDelete(false)
    setError(null)
  }, [initial])

  // Auto-focus topic on create; don't force focus on edit
  useEffect(() => {
    if (mode === 'create' && topicRef.current) {
      topicRef.current.focus()
    }
  }, [mode])

  // Auto-grow topic textarea
  useEffect(() => {
    if (!topicRef.current) return
    topicRef.current.style.height = 'auto'
    topicRef.current.style.height = Math.min(topicRef.current.scrollHeight, 260) + 'px'
  }, [form.topic])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        submit()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const setFromEvent = (k) => (e) => set(k)(e.target.value)

  const submit = async () => {
    if (saving) return
    if (!form.topic.trim()) {
      setError('Topic is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        date: form.date || null,
        channel: form.channel,
        content_type: form.content_type.trim() || 'Post',
        topic: form.topic.trim(),
        campaign: (form.campaign || '').trim(),
        owner: (form.owner || 'Matt').trim(),
        status: form.status,
        notes: form.notes || '',
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setSaving(true)
    try {
      await onDelete()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Delete failed')
      setSaving(false)
    }
  }

  const channelPreview = channelStyle(form.channel)
  const statusPreview = STATUS_STYLES[form.status] || STATUS_STYLES.Planned
  const suggestions = CONTENT_TYPE_SUGGESTIONS[form.channel] || []
  const today = new Date()
  const tomorrow = addDays(today, 1)

  // Filter known lists
  const campaignMatches = knownCampaigns
    .filter((c) => form.campaign && c.toLowerCase().includes(form.campaign.toLowerCase()) && c !== form.campaign)
    .slice(0, 6)

  return (
    <div
      className="fixed inset-0 bg-[rgba(14,18,48,0.45)] backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-modal overflow-hidden max-h-[96vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======= Header: live preview ======= */}
        <div className="px-5 pt-4 pb-3 border-b border-[var(--border-2)]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold">
                {mode === 'edit' ? 'Edit content item' : 'New content item'}
              </div>
              <div className="text-[12px] text-[var(--text-3)] mt-0.5">
                {form.date ? prettyDate(form.date) : 'No date set (will show in TBC panel)'}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-[var(--text-3)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center shrink-0"
              aria-label="Close"
            >
              <IconClose />
            </button>
          </div>

          {/* Live mini-preview — how the item will appear in calendar */}
          <div
            className="item-pill"
            style={{
              backgroundColor: channelPreview.bg,
              color: channelPreview.text,
              cursor: 'default',
            }}
          >
            <span className="pdot" style={{ backgroundColor: channelPreview.text }} />
            <span className="ptxt">
              {form.content_type ? `${form.content_type}: ` : ''}
              {form.topic || <span className="italic opacity-60">Write your topic below…</span>}
            </span>
          </div>
        </div>

        {/* ======= Body ======= */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* ----- Topic ----- */}
          <Field label="Topic / copy hook" required>
            <textarea
              ref={topicRef}
              value={form.topic}
              onChange={setFromEvent('topic')}
              rows={2}
              className="inp resize-none"
              placeholder="What is this post, article or flyer about?"
            />
          </Field>

          {/* ----- Channel (visual picker) ----- */}
          <Field label="Channel" required>
            {['Digital', 'Traditional'].map((group) => (
              <div key={group} className="mb-2 last:mb-0">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-3)] mb-1.5">
                  {group}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CHANNELS.filter((c) => c.group === group).map((c) => {
                    const on = form.channel === c.key
                    const style = channelStyle(c.key)
                    return (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => set('channel')(c.key)}
                        className="chnchip"
                        style={{
                          backgroundColor: on ? style.bg : 'transparent',
                          color: on ? style.text : 'var(--text-2)',
                          borderColor: on ? style.text : 'var(--border)',
                          fontWeight: on ? 600 : 500,
                          boxShadow: on ? `inset 0 0 0 1px ${style.text}20` : 'none',
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
          </Field>

          {/* ----- Content type (input + suggestion chips) ----- */}
          <Field label="Content type" required>
            <input
              type="text"
              value={form.content_type}
              onChange={setFromEvent('content_type')}
              placeholder="Post, Reel, Article, Flyer…"
              className="inp"
            />
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggestions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => set('content_type')(s)}
                    className={`px-2 py-1 text-[11.5px] rounded-md border transition ${
                      form.content_type === s
                        ? 'bg-[var(--text)] text-white border-[var(--text)]'
                        : 'bg-[var(--bg)] text-[var(--text-2)] border-transparent hover:border-[var(--border)] hover:text-[var(--text)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </Field>

          {/* ----- Date + quick shortcuts ----- */}
          <Field label="Date" hint="Leave blank for TBC">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={form.date || ''}
                onChange={setFromEvent('date')}
                className="inp max-w-[200px]"
              />
              <div className="inline-flex gap-1">
                <DateShortcut
                  label="Today"
                  active={form.date === isoDate(today)}
                  onClick={() => set('date')(isoDate(today))}
                />
                <DateShortcut
                  label="Tomorrow"
                  active={form.date === isoDate(tomorrow)}
                  onClick={() => set('date')(isoDate(tomorrow))}
                />
                <DateShortcut
                  label="TBC"
                  active={!form.date}
                  onClick={() => set('date')('')}
                />
              </div>
            </div>
          </Field>

          {/* ----- Status (visual picker) ----- */}
          <Field label="Status">
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const on = form.status === s
                const ss = STATUS_STYLES[s]
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => set('status')(s)}
                    className="chnchip"
                    style={{
                      backgroundColor: on ? ss.bg : 'transparent',
                      color: on ? ss.text : 'var(--text-2)',
                      borderColor: on ? ss.text : 'var(--border)',
                      fontWeight: on ? 600 : 500,
                      boxShadow: on ? `inset 0 0 0 1px ${ss.text}20` : 'none',
                    }}
                  >
                    <span className="dot" style={{ backgroundColor: ss.text }} />
                    {s}
                  </button>
                )
              })}
            </div>
          </Field>

          {/* ----- Campaign (autocomplete) + Owner (autocomplete) ----- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Campaign / theme" hint="Optional — groups related items">
              <input
                type="text"
                value={form.campaign}
                onChange={setFromEvent('campaign')}
                placeholder="Marathon, Ladies Lunch, Evergreen…"
                className="inp"
                list="modal-campaigns"
              />
              <datalist id="modal-campaigns">
                {knownCampaigns.map((c) => <option key={c} value={c} />)}
              </datalist>
              {campaignMatches.length > 0 && form.campaign && !knownCampaigns.includes(form.campaign) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {campaignMatches.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set('campaign')(c)}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-[var(--accent-tint)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </Field>

            <Field label="Owner">
              <input
                type="text"
                value={form.owner}
                onChange={setFromEvent('owner')}
                className="inp"
                list="modal-owners"
              />
              <datalist id="modal-owners">
                {knownOwners.map((o) => <option key={o} value={o} />)}
              </datalist>
            </Field>
          </div>

          {/* ----- Notes ----- */}
          <Field label="Notes" hint="Optional context, reminders, constraints">
            <textarea
              value={form.notes}
              onChange={setFromEvent('notes')}
              rows={2}
              className="inp resize-y"
              placeholder="e.g. Tag sponsor pages, use Alex photos…"
            />
          </Field>

          {error && (
            <div className="text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {mode === 'edit' && initial?.id && (
            <CommentsThread targetType="item" targetId={initial.id} />
          )}
        </div>

        {/* ======= Footer ======= */}
        <div className="px-5 py-3 border-t border-[var(--border-2)] bg-[var(--surface-2)]">
          {confirmDelete ? (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-[13px] text-red-700 font-medium">
                Delete this item? This cannot be undone.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-2 text-[12.5px] text-[var(--text-2)] hover:text-[var(--text)] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg font-medium transition"
                >
                  <IconTrash width={14} height={14} />
                  Yes, delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-1">
                {mode === 'edit' && onDelete && (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-2.5 py-2 text-[12.5px] text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <IconTrash width={14} height={14} />
                    Delete
                  </button>
                )}
                {mode === 'edit' && onDuplicate && (
                  <button
                    type="button"
                    onClick={() => onDuplicate(form)}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-2.5 py-2 text-[12.5px] text-[var(--text-2)] hover:bg-[var(--bg)] rounded-lg transition"
                  >
                    <IconCopy width={14} height={14} />
                    Duplicate
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <span className="hidden sm:inline text-[11px] text-[var(--text-3)]">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--border)] text-[10px] font-semibold">⌘</kbd>
                  <span className="mx-0.5">+</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--border)] text-[10px] font-semibold">Enter</kbd>
                  <span className="ml-1.5">to save</span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-[13px] text-[var(--text-2)] hover:text-[var(--text)] rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={submit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] bg-[var(--text)] text-white rounded-lg hover:bg-black disabled:opacity-60 font-medium transition shadow-sm"
                >
                  {saving ? (
                    'Saving…'
                  ) : (
                    <>
                      <IconCheck width={14} height={14} />
                      {mode === 'edit' ? 'Save changes' : 'Add item'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
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
        kbd {
          font-family: inherit;
        }
      `}</style>
    </div>
  )
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-[12px] font-semibold text-[var(--text-2)]">
          {label} {required && <span className="text-[var(--accent)]">*</span>}
        </label>
        {hint && (
          <span className="text-[10.5px] text-[var(--text-3)] italic">{hint}</span>
        )}
      </div>
      {children}
    </div>
  )
}

function DateShortcut({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-[11.5px] rounded-md border transition ${
        active
          ? 'bg-[var(--text)] text-white border-[var(--text)]'
          : 'bg-[var(--bg)] text-[var(--text-2)] border-transparent hover:border-[var(--border)] hover:text-[var(--text)]'
      }`}
    >
      {label}
    </button>
  )
}
