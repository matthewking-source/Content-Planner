import { useEffect, useRef, useState } from 'react'
import { supabase, hasSupabase } from '../supabase.js'

/**
 * Subscribe to comments for a specific target (item UUID or campaign name).
 *
 * Pass targetType='item'|'campaign' and targetId; pass null to disable.
 */
export function useComments(targetType, targetId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    if (!hasSupabase || !targetType || !targetId) {
      setComments([])
      setLoading(false)
      return
    }

    setLoading(true)
    let channel = null

    ;(async () => {
      const { data, error: err } = await supabase
        .from('comments')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', String(targetId))
        .order('created_at', { ascending: true })

      if (!mounted.current) return
      if (err) {
        console.error('[useComments] fetch failed', err)
        setError(err)
      } else {
        setComments(data ?? [])
      }
      setLoading(false)

      channel = supabase
        .channel(`comments_${targetType}_${targetId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'comments',
            filter: `target_id=eq.${String(targetId)}`,
          },
          (payload) => {
            if (!mounted.current) return
            if (payload.new && payload.new.target_type !== targetType) return
            if (payload.old && payload.eventType === 'DELETE' && payload.old.target_type !== targetType) return

            setComments((prev) => {
              if (payload.eventType === 'INSERT') {
                if (prev.some((c) => c.id === payload.new.id)) return prev
                return [...prev, payload.new]
              }
              if (payload.eventType === 'UPDATE') {
                return prev.map((c) => (c.id === payload.new.id ? payload.new : c))
              }
              if (payload.eventType === 'DELETE') {
                return prev.filter((c) => c.id !== payload.old.id)
              }
              return prev
            })
          },
        )
        .subscribe()
    })()

    return () => {
      mounted.current = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [targetType, targetId])

  async function addComment({ author, body }) {
    if (!targetType || !targetId) return null
    const { data, error: err } = await supabase
      .from('comments')
      .insert({
        target_type: targetType,
        target_id: String(targetId),
        author: (author || 'Matt').trim(),
        body: body.trim(),
      })
      .select()
      .single()
    if (err) throw err
    setComments((prev) => (prev.some((c) => c.id === data.id) ? prev : [...prev, data]))
    return data
  }

  async function deleteComment(id) {
    const { error: err } = await supabase.from('comments').delete().eq('id', id)
    if (err) throw err
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return { comments, loading, error, addComment, deleteComment }
}
