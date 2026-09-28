import { AnimatePresence, motion } from 'motion/react'
import { PartyPopper, Plus } from 'lucide-react'
import TeamBadge from '../ui/TeamBadge'

// Every "still to play" pairing. One click drops it into the next free court.
export default function PairingChips({ pairs, total, onPick }) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl">Pairings to schedule</h3>
        <span className="text-sm font-bold text-navy/50">
          {total - pairs.length} / {total} scheduled
        </span>
      </div>
      <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-navy/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink to-sun"
          animate={{ width: `${total ? ((total - pairs.length) / total) * 100 : 0}%` }}
        />
      </div>

      {pairs.length === 0 ? (
        <p className="flex items-center gap-2 font-semibold text-emerald-700">
          <PartyPopper className="size-5" /> Everyone plays everyone. The fixture list is complete!
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {pairs.map(([a, b]) => (
              <motion.button
                layout
                key={`${a.id}${b.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                whileHover={{ y: -2 }}
                onClick={() => onPick(a, b)}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-navy/10 bg-white py-1.5 pr-3 pl-1.5 text-sm font-bold transition hover:border-pink"
              >
                <TeamBadge team={a} size="sm" className="ring-2!" />
                <span className="max-w-28 truncate">{a.name}</span>
                <span className="text-pink">vs</span>
                <span className="max-w-28 truncate">{b.name}</span>
                <TeamBadge team={b} size="sm" className="ring-2!" />
                <Plus className="size-4 text-pink" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}
      <p className="mt-3 text-xs text-navy/50">
        Click a pairing to add it to the next free court. Court 1 & 2 of the same game are played at the same time.
      </p>
    </div>
  )
}
