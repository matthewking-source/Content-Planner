import { useEffect, useRef } from 'react'
import { IconSearch, IconClose } from './Icons.jsx'
import { activeFilterCount } from '../utils/filters.js'

export default function SearchBar({ filters, onChange, onClear }) {
  const searchRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      const inInput =
        e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)
      if (!inInput && e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const count = activeFilterCount(filters)
  const { search } = filters

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl shadow-card p-2">
      <div className="relative flex-1">
        <IconSearch
          width={15}
          height={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none"
        />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search topic, campaign, notes, content type…"
          value={search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-20 py-2 text-[13px] bg-[var(--bg)] border border-transparent focus:border-[var(--accent)] focus:bg-white rounded-lg transition outline-none"
        />
        {!search && (
          <span className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] text-[var(--text-3)] pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--border)] font-semibold">/</kbd>
          </span>
        )}
      </div>
      {count > 0 && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 px-2.5 py-2 text-[12px] rounded-lg text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--bg)] border border-[var(--border)] transition shrink-0"
          title="Clear all filters"
        >
          <IconClose width={12} height={12} />
          <span className="hidden sm:inline">Clear filters</span>
          <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9.5px] font-semibold rounded-full bg-[var(--accent)] text-white">
            {count}
          </span>
        </button>
      )}
    </div>
  )
}
