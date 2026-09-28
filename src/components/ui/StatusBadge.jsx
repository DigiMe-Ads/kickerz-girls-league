import { STATUS_LABEL } from '../../lib/format'

const STYLES = {
  upcoming: 'bg-sky/15 text-sky-700',
  live: 'bg-pink text-white',
  closed: 'bg-navy/10 text-navy/70',
  scheduled: 'bg-navy/5 text-navy/60',
  finished: 'bg-mint/20 text-emerald-700',
}

const MATCH_LABEL = { scheduled: 'Upcoming', live: 'Live', finished: 'Full time' }

export default function StatusBadge({ status, match = false, className = '' }) {
  const label = match ? MATCH_LABEL[status] : STATUS_LABEL[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${STYLES[status] ?? STYLES.scheduled} ${className}`}
    >
      {status === 'live' && <LiveDot />}
      {label ?? status}
    </span>
  )
}

export function LiveDot({ className = 'bg-white' }) {
  return (
    <span className="relative flex size-2">
      <span className={`absolute inline-flex size-full animate-pulse-dot rounded-full ${className}`} />
      <span className={`relative inline-flex size-2 rounded-full ${className}`} />
    </span>
  )
}
