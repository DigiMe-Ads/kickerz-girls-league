import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, ArrowUp, Check, ImagePlus, Palette, Trash2 } from 'lucide-react'
import TeamBadge from '../ui/TeamBadge'
import { ColorPicker } from './AddTeamsForm'
import LogoPicker from './LogoPicker'

export default function TeamRow({ team, index, total, onUpdate, onMove, onDelete }) {
  const [name, setName] = useState(team.name)
  const [panel, setPanel] = useState(null) // 'color' | 'logo' | null
  const dirty = name.trim() && name.trim() !== team.name

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      className="card p-3"
    >
      <div className="flex items-center gap-3">
        <span className="w-7 text-center font-display text-lg text-pink">{index + 1}</span>
        <TeamBadge team={team} size="sm" />
        <form
          className="flex min-w-0 flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (dirty) onUpdate(team.id, { name: name.trim() })
          }}
        >
          <input
            className="w-full min-w-0 rounded-xl border-2 border-transparent bg-transparent px-2 py-1 font-bold outline-none hover:border-navy/10 focus:border-pink"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => dirty && onUpdate(team.id, { name: name.trim() })}
          />
          {dirty && (
            <button type="submit" className="grid size-8 place-items-center rounded-lg bg-mint" aria-label="Save name">
              <Check className="size-4" />
            </button>
          )}
        </form>
        <div className="flex items-center gap-1">
          <Icon onClick={() => setPanel(panel === 'color' ? null : 'color')} label="Change colour" icon={Palette} />
          <Icon onClick={() => setPanel(panel === 'logo' ? null : 'logo')} label="Team logo" icon={ImagePlus} />
          <Icon onClick={() => onMove(index, -1)} label="Move up" icon={ArrowUp} disabled={index === 0} />
          <Icon onClick={() => onMove(index, 1)} label="Move down" icon={ArrowDown} disabled={index === total - 1} />
          <Icon onClick={() => onDelete(team)} label="Remove team" icon={Trash2} danger />
        </div>
      </div>
      {panel === 'color' && (
        <div className="mt-3 border-t border-navy/5 pt-3 pl-10">
          <ColorPicker
            value={team.color}
            onChange={(color) => {
              onUpdate(team.id, { color })
              setPanel(null)
            }}
          />
        </div>
      )}
      {panel === 'logo' && (
        <div className="mt-3 border-t border-navy/5 pt-3 pl-10">
          <LogoPicker
            value={team.logo_url}
            onChange={(logo_url) => {
              onUpdate(team.id, { logo_url })
              setPanel(null)
            }}
          />
          <p className="mt-2 text-xs text-navy/50">The team colour stays as a ring around the logo.</p>
        </div>
      )}
    </motion.li>
  )
}

function Icon({ onClick, label, icon: IconCmp, disabled, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid size-8 cursor-pointer place-items-center rounded-lg text-navy/50 transition disabled:cursor-default disabled:opacity-25 ${
        danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-pink-soft hover:text-pink'
      }`}
    >
      <IconCmp className="size-4" />
    </button>
  )
}
