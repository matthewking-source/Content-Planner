import { useEffect, useRef, useState } from 'react'
import { supabase, hasSupabase } from '../supabase.js'
import { seedIfEmpty } from '../utils/seed.js'

/**
 * Live subscription to content_items.
 *
 * Returns { items, loading, error, addItem, updateItem, deleteItem }.
 * Realtime events are applied as incremental patches, not refetches.
 */
export function useContentItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    if (!hasSupabase) {
      setLoading(false)
      setError(new Error('Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'))
      return
    }

    let channel = null

    ;(async () => {
      try {
        // Seed on first ever load (no-op if already populated)
        await seedIfEmpty()

        const { data, error: fetchErr } = await supabase
          .from('content_items')
          .select('*')
          .order('date', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true })

        if (fetchErr) throw fetchErr
        if (!mounted.current) return
        setItems(data ?? [])
        setLoading(false)
      } catch (e) {
        console.error('[useContentItems] initial fetch failed', e)
        if (mounted.current) {
          setError(e)
          setLoading(false)
        }
      }

      channel = supabase
        .channel('content_items_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'content_items' },
          (payload) => {
            if (!mounted.current) return
            setItems((prev) => applyChange(prev, payload))
          },
        )
        .subscribe()
    })()

    return () => {
      mounted.current = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  async function addItem(row) {
    const { data, error: err } = await supabase
      .from('content_items')
      .insert(row)
      .select()
      .single()
    if (err) throw err
    // Local optimistic merge — realtime echo will dedupe by id.
    setItems((prev) => upsertById(prev, data))
    return data
  }

  async function updateItem(id, patch) {
    const { data, error: err } = await supabase
      .from('content_items')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setItems((prev) => upsertById(prev, data))
    return data
  }

  async function deleteItem(id) {
    const { error: err } = await supabase.from('content_items').delete().eq('id', id)
    if (err) throw err
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  return { items, loading, error, addItem, updateItem, deleteItem }
}

function applyChange(prev, payload) {
  const { eventType, new: nw, old } = payload
  if (eventType === 'INSERT') return upsertById(prev, nw)
  if (eventType === 'UPDATE') return upsertById(prev, nw)
  if (eventType === 'DELETE') return prev.filter((x) => x.id !== old.id)
  return prev
}

function upsertById(list, row) {
  const idx = list.findIndex((x) => x.id === row.id)
  if (idx === -1) return [...list, row]
  const next = list.slice()
  next[idx] = { ...next[idx], ...row }
  return next
}
