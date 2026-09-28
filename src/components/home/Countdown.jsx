import { useEffect, useState } from 'react'

function remaining(target) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  }
}

export default function Countdown({ date, time = '16:00', dark = false }) {
  const target = new Date(`${date}T${time || '00:00'}`).getTime()
  const [left, setLeft] = useState(() => remaining(target))

  useEffect(() => {
    const id = setInterval(() => setLeft(remaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!date || left.done) return null

  const units = [
    ['days', left.days],
    ['hrs', left.hours],
    ['min', left.mins],
    ['sec', left.secs],
  ]

  return (
    <div className="flex gap-2">
      {units.map(([label, value]) => (
        <div
          key={label}
          className={`min-w-14 rounded-2xl px-2 py-1.5 text-center ${dark ? 'bg-white/10 text-white' : 'bg-navy text-white'}`}
        >
          <div className="text-xl font-bold tabular-nums">{String(value).padStart(2, '0')}</div>
          <div className="text-[10px] font-semibold tracking-wider text-white/60 uppercase">{label}</div>
        </div>
      ))}
    </div>
  )
}
