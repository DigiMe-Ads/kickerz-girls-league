import { AnimatePresence } from 'motion/react'
import AddTeamsForm from './AddTeamsForm'
import TeamRow from './TeamRow'
import { useAction } from '../../hooks/useToast'
import { addTeams, deleteTeam, updateTeam } from '../../lib/api'

export default function TeamManager({ tournament, teams, matches, refresh }) {
  const run = useAction()
  const nextDrawNo = teams.length + 1

  async function handleAdd(rows) {
    const payload = rows.map((r, i) => ({ ...r, tournament_id: tournament.id, draw_no: nextDrawNo + i }))
    await run(() => addTeams(payload), rows.length > 1 ? `${rows.length} teams added` : `${rows[0].name} added`)
    refresh()
  }

  async function handleUpdate(id, values) {
    await run(() => updateTeam(id, values), 'Team saved')
    refresh()
  }

  async function handleMove(index, dir) {
    const a = teams[index]
    const b = teams[index + dir]
    if (!a || !b) return
    await run(() =>
      Promise.all([updateTeam(a.id, { draw_no: index + dir + 1 }), updateTeam(b.id, { draw_no: index + 1 })]),
    )
    refresh()
  }

  async function handleDelete(team) {
    const count = matches.filter((m) => m.home_team_id === team.id || m.away_team_id === team.id).length
    const extra = count ? ` Their ${count} match${count > 1 ? 'es' : ''} will be removed too.` : ''
    if (!confirm(`Remove ${team.name}?${extra}`)) return
    await run(() => deleteTeam(team.id), `${team.name} removed`)
    // Close the gap in draw numbers.
    await Promise.all(
      teams
        .filter((t) => t.id !== team.id)
        .map((t, i) => (t.draw_no !== i + 1 ? updateTeam(t.id, { draw_no: i + 1 }) : null)),
    )
    refresh()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-2xl">Draw order</h3>
          <span className="text-sm font-bold text-navy/50">
            {teams.length} team{teams.length === 1 ? '' : 's'} · {(teams.length * (teams.length - 1)) / 2} matches in a
            round-robin
          </span>
        </div>
        {teams.length === 0 ? (
          <p className="card p-10 text-center text-navy/50">No teams yet. Add them as they're drawn! 🎲</p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {teams.map((t, i) => (
                <TeamRow
                  key={`${t.id}-${t.name}`}
                  team={t}
                  index={i}
                  total={teams.length}
                  onUpdate={handleUpdate}
                  onMove={handleMove}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <AddTeamsForm key={nextDrawNo} nextDrawNo={nextDrawNo} onAdd={handleAdd} />
      </div>
    </div>
  )
}
