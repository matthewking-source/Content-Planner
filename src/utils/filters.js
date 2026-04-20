import { CHANNELS, STATUSES } from './channels.js'
import { inDateRange } from './dates.js'

/**
 * Filter shape — single source of truth.
 *
 *   channels:   Set<string>     one entry per channel that is currently ON
 *   statuses:   Set<string>     one entry per status that is currently ON
 *   owners:     Set<string>     empty = no owner filter; otherwise ON list
 *   campaign:   string | null   single-select, or null for "any"
 *   dateRange:  { from, to } | null   ISO date strings; null for "any"
 *   tbcOnly:    boolean         when true, only items with date=NULL match
 *   search:     string          free text
 */

export function emptyFilters() {
  return {
    channels: new Set(CHANNELS.map((c) => c.key)),
    statuses: new Set(STATUSES),
    owners: new Set(),
    campaign: null,
    dateRange: null,
    tbcOnly: false,
    search: '',
  }
}

export function applyFilters(items, filters) {
  const q = (filters.search || '').trim().toLowerCase()
  return items.filter((it) => {
    if (filters.channels && filters.channels.size > 0 && !filters.channels.has(it.channel)) return false
    if (filters.statuses && filters.statuses.size > 0 && !filters.statuses.has(it.status)) return false
    if (filters.owners && filters.owners.size > 0 && !filters.owners.has(it.owner)) return false
    if (filters.campaign && it.campaign !== filters.campaign) return false
    if (filters.tbcOnly && it.date) return false
    if (filters.dateRange) {
      if (!it.date) return false
      if (!inDateRange(it.date, filters.dateRange)) return false
    }
    if (q) {
      const hay = `${it.topic} ${it.campaign} ${it.notes} ${it.content_type} ${it.owner}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

/**
 * Count active, user-set filter dimensions. Useful for the "Filters (3)" badge.
 */
export function activeFilterCount(filters) {
  let n = 0
  if (filters.channels && filters.channels.size < CHANNELS.length) n++
  if (filters.statuses && filters.statuses.size < STATUSES.length) n++
  if (filters.owners && filters.owners.size > 0) n++
  if (filters.campaign) n++
  if (filters.dateRange) n++
  if (filters.tbcOnly) n++
  if ((filters.search || '').trim()) n++
  return n
}
