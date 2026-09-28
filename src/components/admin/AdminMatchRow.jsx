import { motion } from 'motion/react'
import { AlertTriangle, ArrowLeftRight, Trash2 } from 'lucide-react'
import TeamBadge from '../ui/TeamBadge'

export default function AdminMatchRow({ match, teams, teamsById, clash, onUpdate, onDelete }) {
  const home = teamsById[match.home_team_id]
  const away = teamsById[match.away_team_id]

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className={`rounded-2xl border-2 bg-white p-3 ${clash ? 'border-red-300 bg-red-50/50' : 'border-navy/5'}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl bg-navy/5 p-0.5">
          {[1, 2].map((c) => (
            <button
              key={c}
              onClick={() => c !== match.court && onUpdate(match.id, { court: c })}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                match.court === c ? (c === 1 ? 'bg-pink text-white' : 'bg-sky text-navy') : 'text-navy/50'
              }`}
            >
              Court {c}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <TeamBadge team={home} size="sm" className="ring-2!" />
          <TeamSelect value={match.home_team_id} teams={teams} onChange={(v) => onUpdate(match.id, { home_team_id: v })} />
          <button
            onClick={() => onUpdate(match.id, { home_team_id: match.away_team_id, away_team_id: match.home_team_id })}
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-navy/40 transition hover:bg-pink-soft hover:text-pink"
            title="Swap home / away"
            aria-label="Swap home and away"
          >
            <ArrowLeftRight className="size-4" />
          </button>
          <TeamSelect value={match.away_team_id} teams={teams} onChange={(v) => onUpdate(match.id, { away_team_id: v })} />
          <TeamBadge team={away} size="sm" className="ring-2!" />
        </div>

        <label className="flex items-center gap-1 text-xs font-bold text-navy/50">
          Game
          <input
            type="number"
            min="1"
            defaultValue={match.slot}
            key={match.slot}
            onBlur={(e) => {
              const v = Number(e.target.value)
              if (v >= 1 && v !== match.slot) onUpdate(match.id, { slot: v })
            }}
            className="w-14 rounded-lg border-2 border-navy/10 px-2 py-1 text-center text-navy outline-none focus:border-pink"
          />
        </label>

        <button
          onClick={() => onDelete(match)}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-navy/40 transition hover:bg-red-50 hover:text-red-600"
          title="Delete match"
          aria-label="Delete match"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {clash && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-red-600">
          <AlertTriangle className="size-3.5" /> A team is playing twice in this game. Move one match to another game.
        </p>
      )}
      {home && away && home.id === away.id && (
        <p className="mt-2 text-xs font-bold text-red-600">A team can't play itself.</p>
      )}
    </motion.li>
  )
}

function TeamSelect({ value, teams, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-0 flex-1 cursor-pointer truncate rounded-xl border-2 border-navy/10 bg-white px-2 py-1.5 text-sm font-bold outline-none focus:border-pink"
    >
      {teams.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  )
}
