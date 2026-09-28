import { motion } from 'motion/react'
import { CalendarDays, MapPin } from 'lucide-react'
import Ball from '../ui/Ball'
import { formatDate } from '../../lib/format'

const FLOATERS = [
  { className: 'left-[6%] top-[18%] size-10', delay: 0 },
  { className: 'right-[8%] top-[12%] size-14', delay: 1.2 },
  { className: 'left-[14%] bottom-[14%] size-8', delay: 2.1 },
  { className: 'right-[18%] bottom-[10%] size-12', delay: 0.6 },
]

export default function Hero({ tournaments = [] }) {
  const dates = [...new Set(tournaments.map((t) => t.event_date).filter(Boolean))]
  const venue = tournaments.find((t) => t.venue)?.venue
  const dateText = dates.map((d) => formatDate(d, { weekday: undefined, year: undefined })).join(' & ')

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="court-stripes absolute inset-0" />
      <div className="absolute -left-24 -top-24 size-80 rounded-full bg-pink/30 blur-3xl" />
      <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-sky/20 blur-3xl" />

      {FLOATERS.map((f, i) => (
        <div key={i} className={`absolute hidden animate-float opacity-70 md:block ${f.className}`} style={{ animationDelay: `${f.delay}s` }}>
          <Ball className="size-full" />
        </div>
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="inline-block -rotate-2 rounded-full bg-sun px-4 py-1 text-sm font-bold text-navy">
            ⚽ 5-a-side futsal · U13 & U15
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Kickerz <span className="text-pink">Girls</span>
            <br />
            League <span className="text-sun">2026</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/80">
            Follow every kick, goal and cheer. Live fixtures, scores and league tables for our superstar girls!
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            {dateText && <Chip icon={CalendarDays}>{dateText}</Chip>}
            {venue && <Chip icon={MapPin}>{venue}</Chip>}
          </div>
          <motion.a
            href="#leagues"
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-pink px-7 py-4 text-lg font-bold shadow-[0_5px_0_0_#b8004f]"
          >
            See the leagues →
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute inset-4 translate-x-4 translate-y-4 rotate-6 rounded-[2.5rem] bg-pink" />
          <div className="absolute inset-4 -translate-x-3 translate-y-2 -rotate-3 rounded-[2.5rem] bg-sun" />
          <motion.img
            src="/logo-crop.webp"
            alt="Kickerz Girls League 2026 logo"
            className="relative rounded-[2.5rem] bg-white p-6 shadow-2xl"
            whileHover={{ rotate: 2, scale: 1.02 }}
          />
        </motion.div>
      </div>
    </section>
  )
}

function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur">
      <Icon className="size-4 text-pink-light" /> {children}
    </span>
  )
}
