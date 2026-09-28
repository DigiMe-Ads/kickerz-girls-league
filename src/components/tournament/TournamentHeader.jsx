import { motion } from 'motion/react'
import { CalendarDays, Clock, MapPin, Timer } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'
import Countdown from '../home/Countdown'
import { formatDate, timeRange } from '../../lib/format'

export default function TournamentHeader({ tournament: t, teamCount, matchCount }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="court-stripes absolute inset-0" />
      <div className="absolute -right-20 -top-20 size-80 rounded-full bg-pink/40 blur-3xl" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center">
        <motion.img
          src="/logo-crop.webp"
          alt=""
          initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
          animate={{ rotate: -4, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 12 }}
          className="w-52 shrink-0 rounded-[2rem] bg-white object-contain p-3 shadow-2xl md:w-64"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={t.status} />
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wide uppercase">
              {t.season}
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-display text-4xl leading-tight sm:text-5xl"
          >
            {t.name}
            {t.age_group && <span className="block text-2xl text-pink-light sm:text-3xl">{t.age_group}</span>}
          </motion.h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-white/85">
            <Meta icon={CalendarDays}>{formatDate(t.event_date, { weekday: 'long' })}</Meta>
            <Meta icon={Clock}>{timeRange(t.start_time, t.end_time)}</Meta>
            {t.venue && <Meta icon={MapPin}>{t.venue}</Meta>}
            <Meta icon={Timer}>{t.match_minutes} min matches</Meta>
          </div>
          {t.description && <p className="mt-4 max-w-2xl text-white/70">{t.description}</p>}
        </div>
        <div className="flex flex-col gap-4">
          {t.status === 'upcoming' && <Countdown date={t.event_date} time={t.start_time} dark />}
          <div className="flex gap-3">
            <Stat value={teamCount} label="Teams" color="bg-pink" />
            <Stat value={matchCount} label="Matches" color="bg-sky" />
            <Stat value={2} label="Courts" color="bg-sun text-navy" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Meta({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-2 font-medium">
      <Icon className="size-4 text-pink-light" /> {children}
    </span>
  )
}

function Stat({ value, label, color }) {
  return (
    <div className={`min-w-20 rounded-2xl px-4 py-3 text-center ${color}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs font-bold tracking-wider uppercase opacity-80">{label}</div>
    </div>
  )
}
