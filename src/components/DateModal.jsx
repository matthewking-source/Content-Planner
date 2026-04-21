import { useEffect, useRef, useState } from 'react'
import { DATE_CATEGORIES, categoryStyle } from '../utils/dateCategories.js'
import { IconClose, IconCheck, IconTrash } from './Icons.jsx'

const EMPTY = {
  date: '',
  end_date: '',
  label: '',
  category: 'Awareness',
  notes: '',
}

export default function DateModal({
  mode, // 'create' | 'edit'
  initial,
  onSave,
  onDelete,
  onClose,
}) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial || {}) }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const labelRef = useRef(null)

  useEffect(() => {
    setForm({ ...EMPTY, ...(initial || {}) })
    setConfirmDelete(false)
    setError(null)
  }, [initial])

  useEffect(() => {
    if (mode === 'create' && labelRef.current) labelRef.current.focus()
  }, [mode])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); submit() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const setFromEvent = (k) => (e) => set(k)(e.target.value)

  const submit = async () => {
    if (saving) return
    if (!form.label.trim()) { setError('Please add a label.'); return }
    if (!form.date) { setError('Please pick a start date.'); return }
    if (form.end_date && form.end_date < form.date) {
      setError('End date must be on or after the start date.'); return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave({
        date: form.date,
        end_date: form.end_date || null,
        label: form.label.trim(),
        category: form.category || 'Other',
        notes: form.notes || '',
      })
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

  const catStyle = categoryStyle(form.category)
  const isRange = Boolean(form.end_date && form.end_date !== form.date)

  return (
    <div
      className="fixed inset-0 bg-[rgba(14,18,48,0.45)] backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-modal overflow-hidden max-h-[94vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 border-b border-[var(--border-2)]">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[var(--text-3)] font-semibold">
                {mode === 'edit' ? 'Edit important date' : 'Add important date'}
              </div>
              <div className="text-[12px] text-[var(--text-3)] mt-0.5">
                Awareness days, term dates, bank holidays, internal milestones — visible to the team.
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

          {/* Live preview strip */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
            style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catStyle.text }} />
            {form.label || <span className="italic opacity-60">Label goes here…</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <Field label="Label" required>
            <input
              ref={labelRef}
              type="text"
              value={form.label}
              onChange={setFromEvent('label')}
              placeholder="e.g. Mental Health Awareness Week"
              className="inp"
            />
          </Field>

          <Field label="Category" required>
            <div className="flex flex-wrap gap-1.5">
              {DATE_CATEGORIES.map((c) => {
                const on = form.category === c.key
                return (
                  <button
                    type="button"
                    key={c.key}
                    onClick={() => set('category')(c.key)}
                    className="chnchip"
                    style={{
                      backgroundColor: on ? c.bg : 'transparent',
                      color: on ? c.text : 'var(--text-2)',
                      borderColor: on ? c.text : 'var(--border)',
                      fontWeight: on ? 600 : 500,
                    }}
                  >
                    <span className="dot" style={{ backgroundColor: c.text }} />
                    {c.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Start date" required>
              <input
                type="date"
                value={form.date || ''}
                onChange={setFromEvent('date')}
                className="inp"
              />
            </Field>
            <Field label="End date" hint="Leave blank for single-day">
              <input
                type="date"
                value={form.end_date || ''}
                onChange={setFromEvent('end_date')}
                min={form.date || undefined}
                className="inp"
              />
            </Field>
          </div>

          {isRange && (
            <div className="text-[11.5px] text-[var(--text-3)] italic px-1">
              This will display on every day from {form.date} through {form.end_date}.
            </div>
          )}

          <Field label="Notes" hint="Optional context for the team">
            <textarea
              value={form.notes}
              onChange={setFromEvent('notes')}
              rows={2}
              className="inp resize-y"
              placeholder="Optional"
            />
          </Field>

          {error && (
            <div className="text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[var(--border-2)] bg-[var(--surface-2)]">
          {confirmDelete ? (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-[13px] text-red-700 font-medium">
                Delete this date? This cannot be undone.
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg font-medium"
                >
                  <IconTrash width={14} height={14} />
                  Yes, delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
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
              </div>
              <div className="flex gap-2 ml-auto">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] bg-[var(--text)] text-white rounded-lg hover:bg-black disabled:opacity-60 font-medium shadow-sm transition"
                >
                  {saving ? 'Saving…' : (
                    <>
                      <IconCheck width={14} height={14} />
                      {mode === 'edit' ? 'Save changes' : 'Add date'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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
      </div>
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
        {hint && <span className="text-[10.5px] text-[var(--text-3)] italic">{hint}</span>}
      </div>
      {children}
    </div>
  )
}
