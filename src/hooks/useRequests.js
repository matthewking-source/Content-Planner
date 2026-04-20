import { useEffect, useRef, useState } from 'react'
import { supabase, hasSupabase } from '../supabase.js'

/**
 * Live subscription to content_requests.
 *
 * Returns { requests, loading, error, submitRequest, approveRequest,
 *           ignoreRequest, reopenRequest, deleteRequest }.
 *
 * `requests` is sorted newest-first by created_at.
 */
export function useRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tableMissing, setTableMissing] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    if (!hasSupabase) {
      setLoading(false)
      return
    }

    let channel = null

    ;(async () => {
      try {
        const { data, error: fetchErr } = await supabase
          .from('content_requests')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchErr) throw fetchErr
        if (!mounted.current) return
        setRequests(data ?? [])
        setLoading(false)
      } catch (e) {
        console.error('[useRequests] initial fetch failed', e)
        // Very common first-run state: table doesn't exist yet.
        const msg = String(e?.message || e)
        if (/relation .* does not exist|schema cache/i.test(msg) || e?.code === '42P01' || e?.code === 'PGRST205') {
          if (mounted.current) {
            setTableMissing(true)
            setLoading(false)
          }
          return
        }
        if (mounted.current) {
          setError(e)
          setLoading(false)
        }
      }

      channel = supabase
        .channel('content_requests_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'content_requests' },
          (payload) => {
            if (!mounted.current) return
            setRequests((prev) => applyChange(prev, payload))
          },
        )
        .subscribe()
    })()

    return () => {
      mounted.current = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  async function submitRequest(payload) {
    if (tableMissing) throw new Error('Request table not yet created — run the SQL migration first.')
    const { data, error: err } = await supabase
      .from('content_requests')
      .insert(payload)
      .select()
      .single()
    if (err) throw err
    setRequests((prev) => upsertById(prev, data))
    return data
  }

  async function approveRequest(id, { reviewedBy, linkedItemId }) {
    const { data, error: err } = await supabase
      .from('content_requests')
      .update({
        status: 'approved',
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        linked_item_id: linkedItemId || null,
      })
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setRequests((prev) => upsertById(prev, data))
    return data
  }

  async function ignoreRequest(id, { reviewedBy, reason }) {
    const { data, error: err } = await supabase
      .from('content_requests')
      .update({
        status: 'ignored',
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        ignored_reason: reason || null,
      })
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setRequests((prev) => upsertById(prev, data))
    return data
  }

  async function reopenRequest(id) {
    const { data, error: err } = await supabase
      .from('content_requests')
      .update({
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        ignored_reason: null,
        linked_item_id: null,
      })
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setRequests((prev) => upsertById(prev, data))
    return data
  }

  async function deleteRequest(id) {
    const { error: err } = await supabase.from('content_requests').delete().eq('id', id)
    if (err) throw err
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  return {
    requests,
    loading,
    error,
    tableMissing,
    submitRequest,
    approveRequest,
    ignoreRequest,
    reopenRequest,
    deleteRequest,
  }
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
  if (idx === -1) return [row, ...list]
  const next = list.slice()
  next[idx] = { ...next[idx], ...row }
  return next
}
