import { useState } from 'react'
import Button from '../ui/Button'
import { slugify } from '../../lib/format'

const EMPTY = {
  name: '',
  slug: '',
  season: 'Kickerz Girls League 2026',
  age_group: '',
  event_date: '',
  start_time: '16:00',
  end_time: '18:00',
  venue: 'Uni Sports, Kirulapona',
  match_minutes: 10,
  status: 'upcoming',
  description: '',
}

export default function TournamentForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => ({ ...EMPTY, ...clean(initial) }))
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.id))
  const [busy, setBusy] = useState(false)

  function set(key, value) {
    setValues((v) => {
      const next = { ...v, [key]: value }
      if (key === 'name' && !slugTouched) next.slug = slugify(`${value} ${v.event_date?.slice(0, 4) || ''}`)
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    const payload = {
      ...values,
      slug: slugify(values.slug || values.name),
      match_minutes: Number(values.match_minutes) || 10,
      event_date: values.event_date || null,
      start_time: values.start_time || null,
      end_time: values.end_time || null,
    }
    await onSubmit(payload)
    setBusy(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Tournament name" className="sm:col-span-2">
        <input className="input" required value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="U15 Girls League" />
      </Field>
      <Field label="Age group">
        <input className="input" value={values.age_group ?? ''} onChange={(e) => set('age_group', e.target.value)} placeholder="U15 (2011 & 2012)" />
      </Field>
      <Field label="Season / event">
        <input className="input" value={values.season} onChange={(e) => set('season', e.target.value)} />
      </Field>
      <Field label="Date">
        <input type="date" className="input" value={values.event_date ?? ''} onChange={(e) => set('event_date', e.target.value)} />
      </Field>
      <Field label="Match length (minutes)">
        <input type="number" min="1" className="input" value={values.match_minutes} onChange={(e) => set('match_minutes', e.target.value)} />
      </Field>
      <Field label="Start time">
        <input type="time" className="input" value={values.start_time ?? ''} onChange={(e) => set('start_time', e.target.value)} />
      </Field>
      <Field label="End time">
        <input type="time" className="input" value={values.end_time ?? ''} onChange={(e) => set('end_time', e.target.value)} />
      </Field>
      <Field label="Venue" className="sm:col-span-2">
        <input className="input" value={values.venue ?? ''} onChange={(e) => set('venue', e.target.value)} />
      </Field>
      <Field label="Web address" className="sm:col-span-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-navy/50">/t/</span>
          <input
            className="input"
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true)
              set('slug', e.target.value)
            }}
          />
        </div>
      </Field>
      <Field label="Short description" className="sm:col-span-2">
        <textarea rows={2} className="input" value={values.description ?? ''} onChange={(e) => set('description', e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : initial?.id ? 'Save changes' : 'Create tournament'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
    </label>
  )
}

// Postgres returns "16:00:00"; <input type="time"> wants "16:00".
function clean(t) {
  if (!t) return {}
  const { created_at: _c, ...rest } = t
  return {
    ...rest,
    start_time: t.start_time?.slice(0, 5) ?? '',
    end_time: t.end_time?.slice(0, 5) ?? '',
  }
}
