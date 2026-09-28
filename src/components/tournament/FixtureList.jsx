import { motion } from 'motion/react'
import { Clock } from 'lucide-react'
import MatchCard from './MatchCard'
import { formatTime } from '../../lib/format'

export function groupBySlot(matches) {
  const map = new Map()
  for (const m of matches) {
    if (!map.has(m.slot)) map.set(m.slot, [])
    map.get(m.slot).push(m)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([slot, list]) => ({ slot, matches: list.sort((a, b) => a.court - b.court) }))
}

export default function FixtureList({ matches, teamsById }) {
  if (!matches.length) {
    return (
      <div className="card p-10 text-center">
        <p className="text-5xl">🎲</p>
        <p className="mt-3 font-display text-2xl">The draw is coming soon!</p>
        <p className="mt-1 text-navy/60">Fixtures appear here as soon as the organisers set them.</p>
      </div>
    )
  }

  return (
    <ol className="relative space-y-6 before:absolute before:top-4 before:bottom-4 before:left-5 before:w-1 before:rounded-full before:bg-pink/15">
      {groupBySlot(matches).map(({ slot, matches: list }, i) => {
        const live = list.some((m) => m.status === 'live')
        const done = list.every((m) => m.status === 'finished')
        const kickoff = list.find((m) => m.kickoff)?.kickoff
        return (
          <motion.li
            key={slot}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
            className="relative pl-14"
          >
            <span
              className={`absolute top-1 left-0 grid size-11 place-items-center rounded-full font-bold ring-4 ring-[#fff7fb] ${
                live ? 'bg-pink text-white' : done ? 'bg-mint text-navy' : 'bg-navy text-white'
              }`}
            >
              {slot}
            </span>
            <div className="mb-2 flex items-center gap-3 pt-2">
              <span className="font-display text-xl">Game {slot}</span>
              {kickoff && (
                <span className="flex items-center gap-1 rounded-full bg-sun/30 px-2.5 py-0.5 text-sm font-bold">
                  <Clock className="size-3.5" /> {formatTime(kickoff)}
                </span>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {list.map((m) => (
                <MatchCard key={m.id} match={m} teamsById={teamsById} />
              ))}
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
