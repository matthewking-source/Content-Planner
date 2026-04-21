import { useEffect, useRef, useState } from 'react'
import { supabase, hasSupabase } from '../supabase.js'
import { sortImportantDates } from '../utils/dates.js'

/**
 * Live subscription to important_dates.
 *
 * Returns { dates, loading, error, tableMissing, addDate, updateDate, deleteDate }.
 */
export function useImportantDates() {
  const [dates, setDates] = useState([])
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
          .from('important_dates')
          .select('*')
          .order('date', { ascending: true })

        if (fetchErr) throw fetchErr
        if (!mounted.current) return
        setDates(sortImportantDates(data ?? []))
        setLoading(false)
      } catch (e) {
        const msg = String(e?.message || e)
        if (/relation .* does not exist|schema cache/i.test(msg) || e?.code === '42P01' || e?.code === 'PGRST205') {
          if (mounted.current) {
            setTableMissing(true)
            setLoading(false)
          }
          return
        }
        console.error('[useImportantDates] fetch failed', e)
        if (mounted.current) {
          setError(e)
          setLoading(false)
        }
      }

      channel = supabase
        .channel('important_dates_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'important_dates' },
          (payload) => {
            if (!mounted.current) return
            setDates((prev) => sortImportantDates(applyChange(prev, payload)))
          },
        )
        .subscribe()
    })()

    return () => {
      mounted.current = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  async function addDate(row) {
    if (tableMissing) throw new Error('important_dates table not yet created — run the SQL migration first.')
    const { data, error: err } = await supabase
      .from('important_dates')
      .insert(row)
      .select()
      .single()
    if (err) throw err
    setDates((prev) => sortImportantDates(upsertById(prev, data)))
    return data
  }

  async function updateDate(id, patch) {
    const { data, error: err } = await supabase
      .from('important_dates')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    setDates((prev) => sortImportantDates(upsertById(prev, data)))
    return data
  }

  async function deleteDate(id) {
    const { error: err } = await supabase.from('important_dates').delete().eq('id', id)
    if (err) throw err
    setDates((prev) => prev.filter((x) => x.id !== id))
  }

  return { dates, loading, error, tableMissing, addDate, updateDate, deleteDate }
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
