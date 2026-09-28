import { Phone } from 'lucide-react'
import { CONTACTS, ORGANISER } from '../../data/info'

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy text-white">
      <div className="court-stripes absolute inset-0" />
      <div className="absolute -top-2 left-0 h-3 w-full -skew-y-1 bg-pink" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="w-fit rounded-3xl bg-white p-2 shadow-xl">
          <img src="/logo-crop.webp" alt="Kickerz Girls League" className="h-24 w-auto object-contain" />
        </div>
        <div>
          <p className="font-display text-3xl">
            Play hard. <span className="text-pink">Have fun.</span>
          </p>
          <p className="mt-2 max-w-md text-white/70">
            Organised by {ORGANISER}. Giving girls game time, enjoyment and friendships on the court.
          </p>
        </div>
        <ul className="space-y-3">
          {CONTACTS.map((c) => (
            <li key={c.phone}>
              <a href={`tel:${c.phone}`} className="group flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-pink transition group-hover:scale-110">
                  <Phone className="size-4" />
                </span>
                <span>
                  <span className="block font-semibold">{c.name}</span>
                  <span className="text-sm text-white/60">{c.display}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="relative border-t border-white/10 py-5 text-center text-sm text-white/50">
        © {new Date().getFullYear()} {ORGANISER} (Pvt) Ltd.
      </p>
    </footer>
  )
}
