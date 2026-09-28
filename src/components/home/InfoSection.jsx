import { motion } from 'motion/react'
import { AWARDS, POINTS } from '../../data/info'
import SectionTitle from './SectionTitle'

export default function InfoSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20">
      <SectionTitle kicker="What's up for grabs" title="Awards & points" />
      <div className="grid gap-5 md:grid-cols-3">
        {AWARDS.map((a, i) => (
          <motion.div
            key={a.place}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 150 }}
            whileHover={{ rotate: i % 2 ? 2 : -2, scale: 1.03 }}
            className="card p-6 text-center"
          >
            <div className="text-5xl">{a.emoji}</div>
            <h3 className="mt-3 font-display text-2xl text-pink">{a.place}</h3>
            <p className="mt-1 font-semibold text-navy/70">{a.prize}</p>
          </motion.div>
        ))}
      </div>

      <div className="card mt-6 flex flex-col items-center justify-between gap-5 p-6 sm:flex-row">
        <p className="font-display text-2xl text-navy">League points</p>
        <div className="flex gap-3">
          {POINTS.map((p) => (
            <div key={p.label} className={`rounded-2xl px-5 py-3 text-center ${p.color}`}>
              <div className="text-2xl font-bold text-navy">{p.points}</div>
              <div className="text-xs font-bold tracking-wider text-navy/70 uppercase">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
