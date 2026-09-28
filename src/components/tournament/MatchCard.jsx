import { AnimatePresence, motion } from 'motion/react'
import TeamBadge from '../ui/TeamBadge'
import StatusBadge from '../ui/StatusBadge'

export default function MatchCard({ match, teamsById }) {
  const home = teamsById[match.home_team_id]
  const away = teamsById[match.away_team_id]
  const hasScore = match.home_score != null && match.away_score != null && match.status !== 'scheduled'
  const winner =
    match.status === 'finished' && hasScore
      ? match.home_score > match.away_score
        ? 'home'
        : match.away_score > match.home_score
          ? 'away'
          : 'draw'
      : null
  const live = match.status === 'live'

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-3xl border-2 bg-white p-4 transition ${
        live ? 'border-pink shadow-[0_0_0_6px_rgb(255_10_120/0.12)]' : 'border-navy/5'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${match.court === 1 ? 'bg-pink-soft text-pink' : 'bg-sky/15 text-sky-700'}`}
        >
          Court {match.court}
        </span>
        <StatusBadge status={match.status} match />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Side team={home} dim={winner === 'away'} />
        <div className="min-w-20 text-center">
          {hasScore ? (
            <div className="flex items-center justify-center gap-1.5 font-display text-3xl">
              <Score value={match.home_score} highlight={winner === 'home'} />
              <span className="text-navy/30">:</span>
              <Score value={match.away_score} highlight={winner === 'away'} />
            </div>
          ) : (
            <span className="font-display text-2xl text-pink">vs</span>
          )}
        </div>
        <Side team={away} dim={winner === 'home'} right />
      </div>
      {match.note && <p className="mt-3 text-center text-xs font-semibold text-navy/50">{match.note}</p>}
    </motion.div>
  )
}

function Side({ team, dim, right }) {
  return (
    <div className={`flex min-w-0 flex-col items-center gap-1.5 text-center transition ${dim ? 'opacity-50' : ''}`}>
      <TeamBadge team={team} />
      <span className={`w-full truncate text-sm font-bold sm:text-base ${right ? '' : ''}`}>
        {team?.name ?? 'TBA'}
      </span>
    </div>
  )
}

function Score({ value, highlight }) {
  return (
    <span className="relative inline-block min-w-6">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -24, opacity: 0, scale: 1.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className={`inline-block ${highlight ? 'text-pink' : 'text-navy'}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
