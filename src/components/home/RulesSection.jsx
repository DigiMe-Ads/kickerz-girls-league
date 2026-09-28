import { motion } from 'motion/react'
import { Landmark, MessageCircle, Users, Wallet } from 'lucide-react'
import { REGISTRATION, RULES } from '../../data/info'
import SectionTitle from './SectionTitle'

const DOT_COLORS = ['bg-pink', 'bg-sky', 'bg-sun', 'bg-mint', 'bg-grape']

export default function RulesSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 pt-20 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <SectionTitle kicker="Play fair" title="Rules of the game" />
        <ul className="space-y-3">
          {RULES.map((rule, i) => (
            <motion.li
              key={rule}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card flex items-start gap-4 p-4"
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${DOT_COLORS[i % DOT_COLORS.length]}`}
              >
                {i + 1}
              </span>
              <span className="pt-1 font-medium text-navy/80">{rule}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div>
        <SectionTitle kicker="Join in" title="Registration" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-pink p-7 text-white shadow-[0_10px_0_0_#b8004f]"
        >
          <div className="court-stripes absolute inset-0" />
          <ul className="relative space-y-5">
            <Row icon={Wallet} title="Entry fee" text={REGISTRATION.fee} />
            <Row icon={Users} title="Squad" text={REGISTRATION.squad} />
            <Row
              icon={Landmark}
              title={REGISTRATION.accountName}
              text={`A/C ${REGISTRATION.account} · ${REGISTRATION.bank}`}
            />
            <Row icon={MessageCircle} title="Send payment confirmation on WhatsApp" text={REGISTRATION.whatsapp} />
          </ul>
          <a
            href={`https://wa.me/${REGISTRATION.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="relative mt-7 flex items-center justify-center gap-2 rounded-2xl bg-white py-3 font-bold text-pink transition hover:scale-[1.02]"
          >
            <MessageCircle className="size-5" /> Message us on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Row({ icon: Icon, title, text }) {
  return (
    <li className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/20">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white/75">{title}</span>
        <span className="block text-lg font-bold">{text}</span>
      </span>
    </li>
  )
}
