import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Eye, Pencil, Settings2, Trash2 } from 'lucide-react'
import StatusSwitch from './StatusSwitch'
import { formatDate, timeRange } from '../../lib/format'

export default function AdminTournamentRow({ tournament: t, onStatus, onEdit, onDelete }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-center"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-wider text-pink uppercase">{t.season}</p>
        <h3 className="truncate font-display text-2xl">{t.name}</h3>
        <p className="text-sm font-medium text-navy/60">
          {t.age_group && `${t.age_group} · `}
          {formatDate(t.event_date)} · {timeRange(t.start_time, t.end_time)}
        </p>
      </div>

      <StatusSwitch value={t.status} onChange={(s) => onStatus(t, s)} layoutId={`status-${t.id}`} />

      <div className="flex flex-wrap gap-2">
        <Link
          to={`/admin/t/${t.slug}`}
          className="flex items-center gap-1.5 rounded-xl bg-pink px-3 py-2 text-sm font-bold text-white shadow-[0_3px_0_0_#b8004f] transition hover:-translate-y-0.5"
        >
          <Settings2 className="size-4" /> Manage
        </Link>
        <IconLink to={`/t/${t.slug}`} icon={Eye} label="View public page" />
        <IconButton onClick={() => onEdit(t)} icon={Pencil} label="Edit details" />
        <IconButton onClick={() => onDelete(t)} icon={Trash2} label="Delete" danger />
      </div>
    </motion.li>
  )
}

const iconClass =
  'grid size-9 cursor-pointer place-items-center rounded-xl border-2 border-navy/10 bg-white transition hover:border-pink hover:text-pink'

function IconLink({ to, icon: Icon, label }) {
  return (
    <Link to={to} className={iconClass} title={label} aria-label={label}>
      <Icon className="size-4" />
    </Link>
  )
}

function IconButton({ onClick, icon: Icon, label, danger }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`${iconClass} ${danger ? 'hover:border-red-400! hover:text-red-600!' : ''}`}
    >
      <Icon className="size-4" />
    </button>
  )
}
