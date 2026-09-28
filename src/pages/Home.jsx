import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import TournamentCard from '../components/home/TournamentCard'
import SectionTitle from '../components/home/SectionTitle'
import InfoSection from '../components/home/InfoSection'
import RulesSection from '../components/home/RulesSection'
import Spinner from '../components/ui/Spinner'
import { useTournaments } from '../hooks/useTournaments'
import { formatDate } from '../lib/format'

export default function Home() {
  const { tournaments, loading, error } = useTournaments()
  const active = tournaments.filter((t) => t.status !== 'closed')
  const past = tournaments.filter((t) => t.status === 'closed').reverse()

  return (
    <>
      <Hero tournaments={active} />

      <section id="leagues" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-16">
        <SectionTitle kicker="Pick your league" title="Match days" />
        {loading && <Spinner label="Warming up…" />}
        {error && <p className="card p-6 text-red-600">Couldn't load tournaments: {error}</p>}
        {!loading && !error && active.length === 0 && (
          <p className="card p-8 text-center text-lg font-semibold text-navy/60">
            No leagues scheduled right now. Check back soon! ⚽
          </p>
        )}
        <div className="grid gap-8 md:grid-cols-2">
          {active.map((t, i) => (
            <TournamentCard key={t.id} tournament={t} index={i} />
          ))}
        </div>
      </section>

      <InfoSection />
      <RulesSection />

      {past.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-20">
          <SectionTitle kicker="Hall of fame" title="Past tournaments" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((t) => (
              <Link
                key={t.id}
                to={`/t/${t.slug}`}
                className="card flex items-center justify-between p-5 transition hover:-translate-y-1 hover:border-pink"
              >
                <span>
                  <span className="block font-bold">{t.name}</span>
                  <span className="text-sm text-navy/60">
                    {t.season} · {formatDate(t.event_date)}
                  </span>
                </span>
                <span className="text-2xl">🏆</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
