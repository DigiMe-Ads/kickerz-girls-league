import { motion } from 'motion/react'
import TeamBadge from '../ui/TeamBadge'

export default function TeamsGrid({ teams }) {
  if (!teams.length) {
    return <p className="card p-10 text-center font-semibold text-navy/60">Teams will be revealed at the draw! 🎉</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team, i) => (
        <motion.div
          key={team.id}
          initial={{ opacity: 0, scale: 0.8, rotate: i % 2 ? 4 : -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.06, type: 'spring', stiffness: 200, damping: 14 }}
          whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
          className="card relative flex items-center gap-4 overflow-hidden p-5"
        >
          <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: team.color }} />
          <TeamBadge team={team} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{team.name}</p>
            {team.draw_no != null && <p className="text-sm font-semibold text-navy/50">Draw #{team.draw_no}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
