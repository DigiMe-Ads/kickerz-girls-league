import { supabase } from './supabase'
import { logoFileName, prepareLogo } from './logo'

function unwrap({ data, error }) {
  if (error) throw error
  return data
}

// ── Tournaments ────────────────────────────────────────────
export async function listTournaments() {
  return unwrap(
    await supabase.from('tournaments').select('*').order('event_date', { ascending: true, nullsFirst: false }),
  )
}

export async function getTournamentBySlug(slug) {
  return unwrap(await supabase.from('tournaments').select('*').eq('slug', slug).maybeSingle())
}

export async function saveTournament(values) {
  const { id, ...rest } = values
  const query = id
    ? supabase.from('tournaments').update(rest).eq('id', id)
    : supabase.from('tournaments').insert(rest)
  return unwrap(await query.select().single())
}

export async function setTournamentStatus(id, status) {
  return unwrap(await supabase.from('tournaments').update({ status }).eq('id', id))
}

export async function deleteTournament(id) {
  return unwrap(await supabase.from('tournaments').delete().eq('id', id))
}

// ── Teams ──────────────────────────────────────────────────
export async function listTeams(tournamentId) {
  return unwrap(
    await supabase
      .from('teams')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('draw_no', { ascending: true, nullsFirst: false })
      .order('created_at'),
  )
}

export async function addTeams(rows) {
  return unwrap(await supabase.from('teams').insert(rows).select())
}

export async function updateTeam(id, values) {
  return unwrap(await supabase.from('teams').update(values).eq('id', id))
}

export async function deleteTeam(id) {
  return unwrap(await supabase.from('teams').delete().eq('id', id))
}

// ── Team logos (Storage) ───────────────────────────────────
const LOGO_BUCKET = 'team-logos'

// Trims and shrinks an image, uploads it and returns its public URL.
export async function uploadTeamLogo(file) {
  const { blob, ext, light } = await prepareLogo(file)
  if (blob.size > 2 * 1024 * 1024) throw new Error('Logo must be under 2 MB')
  const path = logoFileName(crypto.randomUUID(), ext, light)
  unwrap(await supabase.storage.from(LOGO_BUCKET).upload(path, blob, { contentType: blob.type || file.type, cacheControl: '31536000' }))
  return supabase.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl
}

// Best-effort cleanup of a logo that's no longer used.
export async function removeTeamLogo(url) {
  const path = url?.split(`/${LOGO_BUCKET}/`)[1]
  if (path) await supabase.storage.from(LOGO_BUCKET).remove([path])
}

// ── Matches ────────────────────────────────────────────────
export async function listMatches(tournamentId) {
  return unwrap(
    await supabase
      .from('matches')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('slot')
      .order('court'),
  )
}

export async function addMatches(rows) {
  return unwrap(await supabase.from('matches').insert(rows).select())
}

export async function updateMatch(id, values) {
  return unwrap(await supabase.from('matches').update(values).eq('id', id))
}

export async function deleteMatch(id) {
  return unwrap(await supabase.from('matches').delete().eq('id', id))
}

export async function clearMatches(tournamentId) {
  return unwrap(await supabase.from('matches').delete().eq('tournament_id', tournamentId))
}

// ── Auth ───────────────────────────────────────────────────
export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return false
  return data === true
}
