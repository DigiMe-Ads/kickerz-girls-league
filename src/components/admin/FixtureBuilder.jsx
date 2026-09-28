import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import AdminMatchRow from './AdminMatchRow'
import FixtureToolbar from './FixtureToolbar'
import PairingChips from './PairingChips'
import { groupBySlot } from '../tournament/FixtureList'
import { useAction } from '../../hooks/useToast'
import { addMatches, clearMatches, deleteMatch, updateMatch } from '../../lib/api'
import { generateSchedule, nextFreeSpot, remainingPairings, slotClashes, slotKickoff } from '../../lib/fixtures'

export default function FixtureBuilder({ tournament, teams, teamsById, matches, refresh }) {
  const run = useAction()
  const [breakMinutes, setBreakMinutes] = useState(0)
  const pairs = useMemo(() => remainingPairings(teams, matches), [teams, matches])
  const clashes = useMemo(() => slotClashes(matches), [matches])
  const total = (teams.length * (teams.length - 1)) / 2
  const kickoffFor = (slot) => slotKickoff(tournament.start_time?.slice(0, 5), slot, tournament.match_minutes, breakMinutes)

  async function handlePick(a, b) {
    const { slot, court } = nextFreeSpot(matches, [a.id, b.id])
    const row = { tournament_id: tournament.id, slot, court, home_team_id: a.id, away_team_id: b.id, kickoff: kickoffFor(slot) }
    await run(() => addMatches([row]), `${a.name} vs ${b.name} → Game ${slot}, Court ${court}`)
    refresh()
  }

  async function handleGenerate() {
    if (matches.length && !confirm('Replace the current fixture list with an auto-built one?')) return
    const rows = generateSchedule(tournament.id, teams).map((r) => ({ ...r, kickoff: kickoffFor(r.slot) }))
    await run(async () => {
      if (matches.length) await clearMatches(tournament.id)
      await addMatches(rows)
    }, `${rows.length} matches created`)
    refresh()
  }

  async function handleTimes() {
    await run(
      () => Promise.all(matches.map((m) => updateMatch(m.id, { kickoff: kickoffFor(m.slot) }))),
      'Kick-off times updated',
    )
    refresh()
  }

  async function handleSlotTime(list, kickoff) {
    await run(() => Promise.all(list.map((m) => updateMatch(m.id, { kickoff: kickoff || null }))), 'Time saved')
    refresh()
  }

  async function handleClear() {
    if (!confirm('Delete every match in this tournament, including scores?')) return
    await run(() => clearMatches(tournament.id), 'Fixtures cleared')
    refresh()
  }

  async function handleUpdate(id, values) {
    await run(() => updateMatch(id, values))
    refresh()
  }

  async function handleDelete(m) {
    if (!confirm(`Delete ${teamsById[m.home_team_id]?.name} vs ${teamsById[m.away_team_id]?.name}?`)) return
    await run(() => deleteMatch(m.id), 'Match deleted')
    refresh()
  }

  if (teams.length < 2) {
    return <p className="card p-10 text-center text-navy/50">Add at least two teams before building fixtures.</p>
  }

  return (
    <div className="space-y-6">
      <FixtureToolbar
        canGenerate={teams.length >= 2}
        hasMatches={matches.length > 0}
        breakMinutes={breakMinutes}
        onBreakChange={setBreakMinutes}
        onGenerate={handleGenerate}
        onTimes={handleTimes}
        onClear={handleClear}
      />
      <PairingChips pairs={pairs} total={total} onPick={handlePick} />

      <div className="space-y-5">
        {groupBySlot(matches).map(({ slot, matches: list }) => (
          <section key={slot}>
            <div className="mb-2 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-navy font-bold text-white">{slot}</span>
              <h4 className="font-display text-xl">Game {slot}</h4>
              <input
                type="time"
                key={list[0]?.kickoff ?? 'none'}
                defaultValue={list[0]?.kickoff?.slice(0, 5) ?? ''}
                onBlur={(e) => e.target.value !== (list[0]?.kickoff?.slice(0, 5) ?? '') && handleSlotTime(list, e.target.value)}
                className="rounded-xl border-2 border-navy/10 bg-white px-2 py-1 text-sm font-bold outline-none focus:border-pink"
                aria-label={`Kick-off time for game ${slot}`}
              />
              {list.length < 2 && <span className="text-xs font-bold text-navy/40">1 court free</span>}
            </div>
            <ul className="space-y-2">
              <AnimatePresence initial={false}>
                {list.map((m) => (
                  <AdminMatchRow
                    key={m.id}
                    match={m}
                    teams={teams}
                    teamsById={teamsById}
                    clash={clashes.has(m.id)}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
