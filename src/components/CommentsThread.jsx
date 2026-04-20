import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { useComments } from '../hooks/useComments.js'
import { IconComment } from './Icons.jsx'

const AUTHOR_KEY = 'wingate_content_author'

function getDefaultAuthor() {
  if (typeof window === 'undefined') return 'Matt'
  return window.localStorage.getItem(AUTHOR_KEY) || 'Matt'
}

function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const AVATAR_PALETTE = [
  { bg: '#edefff', fg: '#3b45e6' },
  { bg: '#fce4ec', fg: '#E4405F' },
  { bg: '#e8f5e9', fg: '#2E7D32' },
  { bg: '#fff3e0', fg: '#F57C00' },
  { bg: '#f3e5f5', fg: '#7B1FA2' },
  { bg: '#e0f2f1', fg: '#00695C' },
]

function avatarColors(name) {
  const idx = Array.from(name || 'x').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[idx]
}

export default function CommentsThread({ targetType, targetId }) {
  const { comments, loading, addComment, deleteComment } = useComments(targetType, targetId)
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState(getDefaultAuthor)
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!body.trim() || saving) return
    setSaving(true)
    try {
      await addComment({ author, body })
      setBody('')
      if (typeof window !== 'undefined' && author) {
        window.localStorage.setItem(AUTHOR_KEY, author)
      }
    } catch (err) {
      console.error(err)
      alert('Could not post comment. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
      await deleteComment(id)
    } catch (err) {
      console.error(err)
      alert('Could not delete comment.')
    }
  }

  return (
    <div className="border-t border-[var(--border-2)] pt-4">
      <div className="flex items-center gap-2 mb-2">
        <IconComment width={14} height={14} className="text-[var(--text-3)]" />
        <h4 className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider">
          Comments {comments.length > 0 && <span className="text-[var(--text-2)]">· {comments.length}</span>}
        </h4>
      </div>

      <div className="space-y-2 mb-3 max-h-52 overflow-y-auto pr-1">
        {loading && <p className="text-[11.5px] text-[var(--text-3)]">Loading…</p>}
        {!loading && comments.length === 0 && (
          <p className="text-[11.5px] text-[var(--text-3)] italic">No comments yet. Start the thread below.</p>
        )}
        {comments.map((c) => {
          const av = avatarColors(c.author)
          return (
            <div key={c.id} className="flex gap-2.5 group">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                style={{ backgroundColor: av.bg, color: av.fg }}
              >
                {initials(c.author)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-[var(--text)]">{c.author}</span>
                    <span className="text-[10.5px] text-[var(--text-3)]">
                      {format(parseISO(c.created_at), 'd MMM · HH:mm')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="opacity-0 group-hover:opacity-100 text-[10.5px] text-[var(--text-3)] hover:text-red-600 transition"
                    title="Delete comment"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-[13px] text-[var(--text)] whitespace-pre-wrap">{c.body}</div>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={submit} className="flex gap-2 items-start">
        <input
          type="text"
          placeholder="Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-24 border border-[var(--border)] rounded-lg px-2.5 py-2 text-[12px] focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-tint)] outline-none"
        />
        <input
          type="text"
          placeholder="Add a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-tint)] outline-none"
        />
        <button
          type="submit"
          disabled={!body.trim() || saving}
          className="px-3 py-2 text-[12.5px] rounded-lg bg-[var(--text)] text-white font-medium hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {saving ? 'Posting…' : 'Post'}
        </button>
      </form>
    </div>
  )
}
