import { CHANNELS, STATUSES } from './channels.js'
import { currentWeekRange, nextNHoursRange } from './dates.js'
import { emptyFilters } from './filters.js'

/**
 * Each preset returns a complete `filters` object.
 *
 * Preset `id` is a short stable key used for active-state highlighting and
 * localStorage persistence.
 */

export const PRESETS = [
  {
    id: 'all',
    label: 'All items',
    build: () => emptyFilters(),
  },
  {
    id: 'this-week',
    label: 'This week',
    build: () => ({
      ...emptyFilters(),
      dateRange: currentWeekRange(),
    }),
  },
  {
    id: 'needs-attention',
    label: 'Needs attention',
    build: () => ({
      ...emptyFilters(),
      statuses: new Set(['Draft', 'Planned']),
      dateRange: nextNHoursRange(48),
    }),
  },
  {
    id: 'my-drafts',
    label: 'My drafts',
    build: (ctx = {}) => ({
      ...emptyFilters(),
      statuses: new Set(['Draft']),
      owners: new Set([ctx.currentOwner || 'Matt']),
    }),
  },
  {
    id: 'unscheduled',
    label: 'Unscheduled',
    build: () => ({
      ...emptyFilters(),
      tbcOnly: true,
    }),
  },
  {
    id: 'published',
    label: 'Published',
    build: () => ({
      ...emptyFilters(),
      statuses: new Set(['Published']),
    }),
  },
]

/**
 * Try to infer which preset id matches the current filters (for highlighting).
 * Returns a preset id string, or null if no match.
 */
export function detectActivePreset(filters, ctx = {}) {
  for (const p of PRESETS) {
    const target = p.build(ctx)
    if (filtersEqual(filters, target)) return p.id
  }
  return null
}

function filtersEqual(a, b) {
  if (!setsEqual(a.channels, b.channels)) return false
  if (!setsEqual(a.statuses, b.statuses)) return false
  if (!setsEqual(a.owners || new Set(), b.owners || new Set())) return false
  if ((a.campaign || null) !== (b.campaign || null)) return false
  if ((a.tbcOnly || false) !== (b.tbcOnly || false)) return false
  if (!rangeEqual(a.dateRange, b.dateRange)) return false
  if (((a.search || '').trim()) !== ((b.search || '').trim())) return false
  return true
}
function setsEqual(a, b) {
  if (a.size !== b.size) return false
  for (const v of a) if (!b.has(v)) return false
  return true
}
function rangeEqual(a, b) {
  if (!a && !b) return true
  if (!a || !b) return false
  return a.from === b.from && a.to === b.to
}
