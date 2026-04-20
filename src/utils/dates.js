import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  getISOWeek,
  getYear,
  parseISO,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns'

// Monday-first weeks (UK).
const WEEK_OPTS = { weekStartsOn: 1 }

export function monthGrid(monthDate) {
  const start = startOfWeek(startOfMonth(monthDate), WEEK_OPTS)
  const end = endOfWeek(endOfMonth(monthDate), WEEK_OPTS)
  return eachDayOfInterval({ start, end })
}

export function weekdayHeaders() {
  // Mon..Sun starting from a known Monday
  const ref = new Date(2024, 0, 1) // Mon 1 Jan 2024
  return [0, 1, 2, 3, 4, 5, 6].map((i) =>
    format(new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + i), 'EEE'),
  )
}

export function isoDate(d) {
  return format(d, 'yyyy-MM-dd')
}

export function fromIso(s) {
  if (!s) return null
  return parseISO(s)
}

export function prettyDate(s) {
  const d = fromIso(s)
  if (!d) return 'Date TBC'
  return format(d, 'EEE d MMM yyyy')
}

export function monthLabel(d) {
  return format(d, 'MMMM yyyy')
}

export function isSameDayIso(a, bDate) {
  const d = fromIso(a)
  if (!d) return false
  return isSameDay(d, bDate)
}

export function sameMonth(a, b) {
  return isSameMonth(a, b)
}

export function weekKey(iso) {
  const d = fromIso(iso)
  if (!d) return 'TBC'
  return `${getYear(d)}-W${String(getISOWeek(d)).padStart(2, '0')}`
}

export function weekLabel(iso) {
  const d = fromIso(iso)
  if (!d) return 'Date TBC'
  const start = startOfWeek(d, WEEK_OPTS)
  const end = endOfWeek(d, WEEK_OPTS)
  return `Week ${getISOWeek(d)} — ${format(start, 'd MMM')} to ${format(end, 'd MMM yyyy')}`
}

// ----- Week / day helpers (for the Week and Day views) -----

export function weekDays(anchor) {
  const start = startOfWeek(anchor, WEEK_OPTS)
  const end = endOfWeek(anchor, WEEK_OPTS)
  return eachDayOfInterval({ start, end })
}

export function weekRangeLabel(anchor) {
  const start = startOfWeek(anchor, WEEK_OPTS)
  const end = endOfWeek(anchor, WEEK_OPTS)
  const iso = getISOWeek(anchor)
  const sameMo = format(start, 'MMM yyyy') === format(end, 'MMM yyyy')
  if (sameMo) {
    return `Week ${iso} · ${format(start, 'd')}–${format(end, 'd MMM yyyy')}`
  }
  return `Week ${iso} · ${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`
}

export function dayLabel(d) {
  return format(d, 'EEEE · d MMMM yyyy')
}

export function dayShortLabel(d) {
  return format(d, 'EEE d MMM')
}

export { addWeeks, subWeeks, addDays, subDays }
