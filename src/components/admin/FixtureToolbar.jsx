import { useState } from 'react'
import { Clock, Eraser, Wand2 } from 'lucide-react'
import Button from '../ui/Button'

export default function FixtureToolbar({ canGenerate, hasMatches, breakMinutes, onBreakChange, onGenerate, onTimes, onClear }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Button icon={Wand2} variant="sun" onClick={onGenerate} disabled={!canGenerate}>
          Auto-build from draw order
        </Button>
        <Button icon={Clock} variant="ghost" onClick={() => setOpen(!open)} disabled={!hasMatches}>
          Kick-off times
        </Button>
        <Button icon={Eraser} variant="danger" onClick={onClear} disabled={!hasMatches}>
          Clear all
        </Button>
      </div>
      {open && (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-sun/15 p-4">
          <label>
            <span className="label">Break between games (min)</span>
            <input
              type="number"
              min="0"
              className="input w-32!"
              value={breakMinutes}
              onChange={(e) => onBreakChange(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>
          <Button
            onClick={() => {
              onTimes()
              setOpen(false)
            }}
          >
            Fill all kick-off times
          </Button>
          <p className="w-full text-xs text-navy/60">
            Times start at the tournament start and step by match length + break. You can still edit each game's time.
          </p>
        </div>
      )}
    </div>
  )
}
