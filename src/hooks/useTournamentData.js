import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getTournamentBySlug, listMatches, listTeams } from '../lib/api'

// Loads one tournament with its teams + matches and keeps them live via realtime.
export function useTournamentData(slug) {
  const [tournament, setTournament] = useState(null)
  const [teams, setTeams] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const idRef = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const t = await getTournamentBySlug(slug)
      setTournament(t)
      idRef.current = t?.id ?? null
      if (t) {
        const [tm, ms] = await Promise.all([listTeams(t.id), listMatches(t.id)])
        setTeams(tm)
        setMatches(ms)
      }
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    setLoading(true)
    refresh()
    let timer
    // Debounce bursts of changes (e.g. generating a whole fixture list).
    const onChange = (payload) => {
      const row = payload.new?.tournament_id ?? payload.old?.tournament_id ?? payload.new?.id
      if (row && idRef.current && row !== idRef.current && payload.table !== 'tournaments') return
      clearTimeout(timer)
      timer = setTimeout(refresh, 250)
    }
    const channel = supabase
      .channel(`tournament-${slug}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, onChange)
      .subscribe()
    return () => {
      clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [slug, refresh])

  const teamsById = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams])

  return { tournament, teams, teamsById, matches, loading, error, refresh, setMatches, setTeams }
}
