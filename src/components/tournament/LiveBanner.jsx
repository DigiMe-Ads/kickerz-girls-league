import { motion } from 'motion/react'
import { LiveDot } from '../ui/StatusBadge'

// Shows what's on right now (or what's next) across both courts.
export default function LiveBanner({ matches, teamsById }) {
  const live = matches.filter((m) => m.status === 'live')
  const nextSlot = matches.find((m) => m.status === 'scheduled')?.slot
  const list = live.length ? live : matches.filter((m) => m.slot === nextSlot && m.status === 'scheduled')
  if (!list.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center ${
        live.length ? 'bg-pink text-white' : 'bg-sun text-navy'
      }`}
    >
      <span className="flex items-center gap-2 font-display text-xl whitespace-nowrap">
        {live.length ? <LiveDot /> : '⏭'} {live.length ? 'Live now' : 'Up next'}
      </span>
      <div className="flex flex-1 flex-wrap gap-2">
        {list.map((m) => (
          <span key={m.id} className="rounded-2xl bg-white/25 px-3 py-1.5 font-semibold">
            <span className="opacity-75">Court {m.court}:</span> {teamsById[m.home_team_id]?.name}{' '}
            {m.status === 'live' ? (
              <b>
                {m.home_score ?? 0} – {m.away_score ?? 0}
              </b>
            ) : (
              'vs'
            )}{' '}
            {teamsById[m.away_team_id]?.name}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
