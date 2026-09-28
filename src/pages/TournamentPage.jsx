import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarRange, Settings2, Trophy, Users } from 'lucide-react'
import TournamentHeader from '../components/tournament/TournamentHeader'
import FixtureList from '../components/tournament/FixtureList'
import StandingsTable from '../components/tournament/StandingsTable'
import TeamsGrid from '../components/tournament/TeamsGrid'
import LiveBanner from '../components/tournament/LiveBanner'
import Tabs from '../components/ui/Tabs'
import Spinner from '../components/ui/Spinner'
import NotFound from './NotFound'
import { useTournamentData } from '../hooks/useTournamentData'
import { useAuth } from '../hooks/useAuth'
import { computeStandings } from '../lib/standings'

const TABS = [
  { id: 'fixtures', label: 'Fixtures', icon: CalendarRange },
  { id: 'table', label: 'League table', icon: Trophy },
  { id: 'teams', label: 'Teams', icon: Users },
]

export default function TournamentPage() {
  const { slug } = useParams()
  const { isAdmin } = useAuth()
  const { tournament, teams, teamsById, matches, loading, error } = useTournamentData(slug)
  const [tab, setTab] = useState('fixtures')
  const standings = useMemo(() => computeStandings(teams, matches), [teams, matches])

  if (loading) return <Spinner />
  if (error) return <p className="mx-auto max-w-xl p-10 text-center text-red-600">{error}</p>
  if (!tournament) return <NotFound />

  return (
    <>
      <TournamentHeader tournament={tournament} teamCount={teams.length} matchCount={matches.length} />

      <div className="mx-auto max-w-6xl px-4 pt-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
          {isAdmin && (
            <Link
              to={`/admin/t/${tournament.slug}`}
              className="flex items-center gap-2 rounded-2xl bg-navy px-4 py-2.5 font-bold text-white transition hover:bg-pink"
            >
              <Settings2 className="size-4" /> Manage
            </Link>
          )}
        </div>

        {tournament.status !== 'closed' && <LiveBanner matches={matches} teamsById={teamsById} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'fixtures' && <FixtureList matches={matches} teamsById={teamsById} />}
            {tab === 'table' && <StandingsTable standings={standings} closed={tournament.status === 'closed'} />}
            {tab === 'teams' && <TeamsGrid teams={teams} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
