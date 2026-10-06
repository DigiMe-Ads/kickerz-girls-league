import { contrastText, initials } from '../../lib/format'
import { isLightLogo } from '../../lib/logo'

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-xl',
}

const LOGO_BORDER = { sm: 3, md: 4, lg: 5 }

// Round "crest" in the team's colour with its initials, or the team logo framed
// in the team colour (so e.g. a club's A and B teams still look different).
export default function TeamBadge({ team, size = 'md', className = '' }) {
  const color = team?.color || '#ff0a78'
  const base = `grid shrink-0 place-items-center rounded-full font-bold ring-4 ring-white shadow-md ${SIZES[size]} ${className}`

  if (team?.logo_url) {
    return (
      <span
        className={`${base} overflow-hidden ${isLightLogo(team.logo_url) ? 'bg-navy' : 'bg-white'}`}
        style={{ border: `${LOGO_BORDER[size]}px solid ${color}` }}
        title={team.name}
      >
        <img src={team.logo_url} alt={team.name} className="size-full object-contain p-[8%]" loading="lazy" />
      </span>
    )
  }

  return (
    <span className={base} style={{ backgroundColor: color, color: contrastText(color) }} title={team?.name}>
      {team ? initials(team.name) : '?'}
    </span>
  )
}
