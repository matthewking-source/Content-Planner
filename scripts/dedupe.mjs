// One-off cleanup: removes duplicate content_items rows created by the seed race.
// Keeps the earliest-created copy of each (date, channel, content_type, topic, campaign, owner) tuple.
// Run with: node scripts/dedupe.mjs

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Load .env manually so we don't need dotenv installed
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env')
const envRaw = readFileSync(envPath, 'utf8')
const env = Object.fromEntries(
  envRaw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx), l.slice(idx + 1)]
    }),
)

const URL = env.VITE_SUPABASE_URL
const KEY = env.VITE_SUPABASE_ANON_KEY
if (!URL || !KEY) throw new Error('Missing Supabase creds in .env')

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
}

console.log('→ Fetching all rows…')
const r = await fetch(`${URL}/rest/v1/content_items?select=id,date,channel,content_type,topic,campaign,owner,created_at&order=created_at.asc`, { headers })
if (!r.ok) {
  console.error('Fetch failed:', r.status, await r.text())
  process.exit(1)
}
const rows = await r.json()
console.log(`  found ${rows.length} rows total`)

// Group by the tuple that identifies a "same item"
const groups = new Map()
for (const row of rows) {
  const key = [
    row.date || 'NULL',
    row.channel,
    row.content_type,
    row.topic,
    row.campaign || '',
    row.owner || '',
  ].join('|')
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(row)
}

const toDelete = []
let keptCount = 0
for (const [, rowsInGroup] of groups) {
  // Keep the oldest (already sorted ascending by created_at)
  keptCount++
  for (let i = 1; i < rowsInGroup.length; i++) {
    toDelete.push(rowsInGroup[i].id)
  }
}

console.log(`  → keeping ${keptCount} unique items`)
console.log(`  → deleting ${toDelete.length} duplicate rows`)

if (toDelete.length === 0) {
  console.log('Nothing to delete. Already clean.')
  process.exit(0)
}

// Delete in chunks — PostgREST "in" filter is URL-length-bounded
const CHUNK = 50
for (let i = 0; i < toDelete.length; i += CHUNK) {
  const chunk = toDelete.slice(i, i + CHUNK)
  const inList = chunk.map((id) => `"${id}"`).join(',')
  const url = `${URL}/rest/v1/content_items?id=in.(${inList})`
  const res = await fetch(url, { method: 'DELETE', headers })
  if (!res.ok) {
    console.error('  DELETE failed:', res.status, await res.text())
    process.exit(1)
  }
  console.log(`  deleted ${Math.min(i + CHUNK, toDelete.length)}/${toDelete.length}`)
}

// Verify
const v = await fetch(`${URL}/rest/v1/content_items?select=id`, {
  headers: { ...headers, Prefer: 'count=exact', Range: '0-0' },
})
const range = v.headers.get('content-range')
const total = range?.split('/')[1]
console.log(`\n✓ Done. content_items now has ${total} rows.`)
