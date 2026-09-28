import ScoreRow from './ScoreRow'
import { groupBySlot } from '../tournament/FixtureList'
import { useAction } from '../../hooks/useToast'
import { updateMatch } from '../../lib/api'
import { formatTime } from '../../lib/format'

export default function ScoreBoard({ teamsById, matches, setMatches, refresh }) {
  const run = useAction()

  async function handleUpdate(id, values) {
    // Optimistic: show the new score immediately, then sync.
    setMatches((list) => list.map((m) => (m.id === id ? { ...m, ...values } : m)))
    const ok = await run(() => updateMatch(id, values).then(() => true))
    if (!ok) refresh()
  }

  if (!matches.length) {
    return <p className="card p-10 text-center text-navy/50">Build the fixtures first, then enter scores here.</p>
  }

  return (
    <div className="space-y-6">
      {groupBySlot(matches).map(({ slot, matches: list }) => (
        <section key={slot}>
          <div className="mb-2 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-navy font-bold text-white">{slot}</span>
            <h4 className="font-display text-xl">Game {slot}</h4>
            {list[0]?.kickoff && <span className="text-sm font-bold text-navy/50">{formatTime(list[0].kickoff)}</span>}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {list.map((m) => (
              <ScoreRow key={m.id} match={m} teamsById={teamsById} onUpdate={handleUpdate} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
