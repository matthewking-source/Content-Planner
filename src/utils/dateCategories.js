// Categories for important dates — picked to feel distinct from channel colours
// (which already live in utils/channels.js) so the two don't visually blur.
export const DATE_CATEGORIES = [
  { key: 'Awareness',     label: 'Awareness',       text: '#6b21a8', bg: '#f3e8ff' }, // purple
  { key: 'School',        label: 'School / term',   text: '#0f766e', bg: '#ccfbf1' }, // teal
  { key: 'Bank holiday',  label: 'Bank holiday',    text: '#b91c1c', bg: '#fee2e2' }, // red
  { key: 'Internal',      label: 'Internal',        text: '#1d4ed8', bg: '#dbeafe' }, // blue
  { key: 'Charity event', label: 'Charity event',   text: '#b45309', bg: '#fef3c7' }, // amber
  { key: 'Other',         label: 'Other',           text: '#475569', bg: '#f1f5f9' }, // slate
]

const CATEGORY_MAP = Object.fromEntries(DATE_CATEGORIES.map((c) => [c.key, c]))

export function categoryStyle(key) {
  return CATEGORY_MAP[key] || DATE_CATEGORIES[DATE_CATEGORIES.length - 1]
}

export const CATEGORY_KEYS = DATE_CATEGORIES.map((c) => c.key)
