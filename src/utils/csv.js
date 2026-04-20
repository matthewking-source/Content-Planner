const HEADERS = [
  'date',
  'channel',
  'content_type',
  'topic',
  'campaign',
  'owner',
  'status',
  'notes',
]

function escape(value) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function itemsToCsv(items) {
  const rows = [HEADERS.join(',')]
  for (const it of items) {
    rows.push(HEADERS.map((h) => escape(it[h])).join(','))
  }
  return rows.join('\r\n')
}

export function downloadCsv(items, filename = 'content-plan.csv') {
  const csv = itemsToCsv(items)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
