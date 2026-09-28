import { motion } from 'motion/react'

export default function SectionTitle({ kicker, title, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-8 ${className}`}
    >
      {kicker && <p className="text-sm font-bold tracking-widest text-pink uppercase">{kicker}</p>}
      <h2 className="mt-1 font-display text-4xl text-navy sm:text-5xl">
        <span className="brush-underline">{title}</span>
      </h2>
    </motion.div>
  )
}
