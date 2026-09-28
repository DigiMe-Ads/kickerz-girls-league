import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { listTournaments } from '../lib/api'

export function useTournaments() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    try {
      setTournaments(await listTournaments())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel('tournaments-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, refresh)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])

  return { tournaments, loading, error, refresh }
}
