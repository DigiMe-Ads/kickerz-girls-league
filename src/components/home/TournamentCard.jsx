import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import Countdown from './Countdown'
import { formatDate, timeRange } from '../../lib/format'

const THEMES = [
  { bg: 'bg-pink', shadow: 'shadow-[0_10px_0_0_#b8004f]', accent: 'text-sun' },
  { bg: 'bg-navy', shadow: 'shadow-[0_10px_0_0_#ff0a78]', accent: 'text-pink-light' },
  { bg: 'bg-grape', shadow: 'shadow-[0_10px_0_0_#5b30c9]', accent: 'text-sun' },
  { bg: 'bg-sky', shadow: 'shadow-[0_10px_0_0_#0b8fc4]', accent: 'text-navy' },
]

export default function TournamentCard({ tournament: t, index = 0 }) {
  const theme = THEMES[index % THEMES.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay: index * 0.1 }}
      whileHover={{ y: -6, rotate: index % 2 ? 0.8 : -0.8 }}
    >
      <Link
        to={`/t/${t.slug}`}
        className={`group relative block overflow-hidden rounded-[2rem] p-7 text-white ${theme.bg} ${theme.shadow}`}
      >
        <div className="court-stripes absolute inset-0" />
        <div className="absolute -right-10 -bottom-10 size-44 rounded-full border-[10px] border-white/15" />
        <div className="absolute -right-2 -bottom-2 size-20 rounded-full border-[6px] border-white/15" />

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{t.age_group || t.season}</span>
            <StatusBadge status={t.status} className={t.status === 'live' ? 'bg-white! text-pink!' : 'bg-white/90!'} />
          </div>

          <h3 className="mt-5 font-display text-4xl leading-tight">{t.name}</h3>

          <ul className="mt-4 space-y-1.5 font-medium text-white/90">
            <li className="flex items-center gap-2">
              <CalendarDays className="size-4" /> {formatDate(t.event_date, { weekday: 'long' })}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4" /> {timeRange(t.start_time, t.end_time)}
            </li>
            {t.venue && (
              <li className="flex items-center gap-2">
                <MapPin className="size-4" /> {t.venue}
              </li>
            )}
          </ul>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            {t.status === 'upcoming' ? <Countdown date={t.event_date} time={t.start_time} dark /> : <span />}
            <span className={`inline-flex items-center gap-2 font-bold ${theme.accent}`}>
              {t.status === 'closed' ? 'Results' : 'Fixtures & table'}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
