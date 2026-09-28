import { useState } from 'react'
import { ListPlus, Plus } from 'lucide-react'
import Button from '../ui/Button'
import { TEAM_COLORS } from '../../lib/format'

// Add one team at a time as they come out of the draw, or paste a whole list.
export default function AddTeamsForm({ nextDrawNo, onAdd }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(TEAM_COLORS[(nextDrawNo - 1) % TEAM_COLORS.length])
  const [bulk, setBulk] = useState(false)
  const [list, setList] = useState('')

  async function addOne(e) {
    e.preventDefault()
    if (!name.trim()) return
    await onAdd([{ name: name.trim(), color }])
    setName('')
    setColor(TEAM_COLORS[nextDrawNo % TEAM_COLORS.length])
  }

  async function addMany(e) {
    e.preventDefault()
    const names = list.split('\n').map((s) => s.trim()).filter(Boolean)
    if (!names.length) return
    await onAdd(names.map((n, i) => ({ name: n, color: TEAM_COLORS[(nextDrawNo - 1 + i) % TEAM_COLORS.length] })))
    setList('')
    setBulk(false)
  }

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl">
          {bulk ? 'Paste team list' : <>Add team <span className="text-pink">#{nextDrawNo}</span></>}
        </h3>
        <button onClick={() => setBulk(!bulk)} className="cursor-pointer text-sm font-bold text-pink hover:underline">
          {bulk ? 'One at a time' : 'Paste many'}
        </button>
      </div>

      {bulk ? (
        <form onSubmit={addMany} className="space-y-3">
          <textarea
            rows={6}
            className="input"
            placeholder={'One team per line, in draw order:\nKickerz A\nMoir\nSuccess FA'}
            value={list}
            onChange={(e) => setList(e.target.value)}
          />
          <Button type="submit" icon={ListPlus} className="w-full">
            Add all
          </Button>
        </form>
      ) : (
        <form onSubmit={addOne} className="space-y-3">
          <input
            className="input"
            placeholder="Team name, e.g. Kickerz A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <ColorPicker value={color} onChange={setColor} />
          <Button type="submit" icon={Plus} className="w-full" disabled={!name.trim()}>
            Add to draw
          </Button>
        </form>
      )}
      <p className="mt-3 text-xs text-navy/50">
        Tip: add teams in the order they're drawn. The draw order is used when generating fixtures.
      </p>
    </div>
  )
}

export function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TEAM_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-label={`Colour ${c}`}
          className={`size-7 cursor-pointer rounded-full ring-offset-2 transition hover:scale-110 ${value === c ? 'ring-2 ring-navy' : ''}`}
          style={{ backgroundColor: c }}
        />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
        aria-label="Custom colour"
      />
    </div>
  )
}
