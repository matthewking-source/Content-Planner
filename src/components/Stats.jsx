import { activeFilterCount } from '../utils/filters.js'

export default function Stats({ items, totalCount, filters }) {
  const n = activeFilterCount(filters)
  if (n === 0) return null

  return (
    <div className="text-[12px] text-[var(--text-3)] px-1">
      Showing <span className="font-semibold text-[var(--text-2)]">{items.length}</span>
      {' of '}
      <span className="font-semibold text-[var(--text-2)]">{totalCount}</span> items
      {' '}
      <span>· {n} filter{n === 1 ? '' : 's'} active</span>
    </div>
  )
}
