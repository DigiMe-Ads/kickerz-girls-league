import { contrastText, initials } from '../../lib/format'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-xl',
}

// Round "crest" in the team's colour with its initials.
export default function TeamBadge({ team, size = 'md', className = '' }) {
  const color = team?.color || '#ff0a78'
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold ring-4 ring-white shadow-md ${SIZES[size]} ${className}`}
      style={{ backgroundColor: color, color: contrastText(color) }}
      title={team?.name}
    >
      {team ? initials(team.name) : '?'}
    </span>
  )
}
