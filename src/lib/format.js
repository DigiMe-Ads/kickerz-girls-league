export function formatDate(date, opts = {}) {
  if (!date) return 'Date TBA'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

export function formatTime(time) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

export function timeRange(start, end) {
  if (!start) return 'Time TBA'
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start)
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Readable text colour on top of a team colour.
export function contrastText(hex = '#ff0a78') {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0b1622' : '#ffffff'
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export const TEAM_COLORS = [
  '#ff0a78', '#3ec5ff', '#ffd23f', '#2ee6a6', '#8b5cf6',
  '#ff7a1a', '#0b1622', '#e11d48', '#14b8a6', '#6366f1',
]

export const STATUS_LABEL = { upcoming: 'Upcoming', live: 'Live now', closed: 'Completed' }
