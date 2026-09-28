import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'
import AdminTournamentRow from '../../components/admin/AdminTournamentRow'
import TournamentForm from '../../components/admin/TournamentForm'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import { useTournaments } from '../../hooks/useTournaments'
import { useAction } from '../../hooks/useToast'
import { deleteTournament, saveTournament, setTournamentStatus } from '../../lib/api'

export default function AdminDashboard() {
  const { tournaments, loading, refresh } = useTournaments()
  const run = useAction()
  const [editing, setEditing] = useState(null) // null | {} (new) | tournament

  const active = tournaments.filter((t) => t.status !== 'closed')
  const closed = tournaments.filter((t) => t.status === 'closed')

  async function handleSave(values) {
    const ok = await run(() => saveTournament(values), values.id ? 'Tournament updated' : 'Tournament created 🎉')
    if (ok) {
      setEditing(null)
      refresh()
    }
  }

  async function handleStatus(t, status) {
    if (status === 'closed' && !confirm(`Close "${t.name}"? It will move to Past tournaments with final results.`)) return
    await run(() => setTournamentStatus(t.id, status), `${t.name} is now ${status}`)
    refresh()
  }

  async function handleDelete(t) {
    if (!confirm(`Delete "${t.name}" with all its teams and matches? This cannot be undone.`)) return
    await run(() => deleteTournament(t.id), 'Tournament deleted')
    refresh()
  }

  const rowProps = { onStatus: handleStatus, onEdit: setEditing, onDelete: handleDelete }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold tracking-widest text-pink uppercase">Admin</p>
          <h1 className="font-display text-4xl sm:text-5xl">Tournaments</h1>
        </div>
        <Button icon={Plus} size="lg" onClick={() => setEditing({})}>
          New tournament
        </Button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Group title="Active" empty="No active tournaments. Create one to get started!">
            {active.map((t) => (
              <AdminTournamentRow key={t.id} tournament={t} {...rowProps} />
            ))}
          </Group>
          <Group title="Closed" empty="Closed tournaments will show up here.">
            {closed.map((t) => (
              <AdminTournamentRow key={t.id} tournament={t} {...rowProps} />
            ))}
          </Group>
        </>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit tournament' : 'New tournament'}
        wide
      >
        {editing !== null && (
          <TournamentForm initial={editing} onSubmit={handleSave} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </div>
  )
}

function Group({ title, empty, children }) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold text-navy/60">{title}</h2>
      {hasItems ? (
        <ul className="space-y-3">
          <AnimatePresence>{children}</AnimatePresence>
        </ul>
      ) : (
        <p className="card p-6 text-center text-navy/50">{empty}</p>
      )}
    </section>
  )
}
