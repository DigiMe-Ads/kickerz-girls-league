import { motion } from 'motion/react'
import TeamBadge from '../ui/TeamBadge'

const FORM_COLOR = { W: 'bg-mint', D: 'bg-sun', L: 'bg-pink-light' }
const PLACE_STYLE = ['bg-sun text-navy', 'bg-navy/15 text-navy', 'bg-navy/5 text-navy/70']

export default function StandingsTable({ standings, closed }) {
  if (!standings.length) {
    return <p className="card p-10 text-center font-semibold text-navy/60">Teams will appear after the draw.</p>
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead className="bg-navy text-xs font-bold tracking-wider text-white uppercase">
            <tr>
              <th className="py-3 pl-4">#</th>
              <th className="py-3">Team</th>
              {['P', 'W', 'D', 'L', 'GF', 'GA', 'GD'].map((h) => (
                <th key={h} className="px-2 py-3 text-center">
                  {h}
                </th>
              ))}
              <th className="px-2 py-3 text-center text-sun">Pts</th>
              <th className="hidden py-3 pr-4 sm:table-cell">Form</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => (
              <motion.tr
                layout
                key={row.team.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
                className={`border-b border-navy/5 last:border-0 ${i === 0 && row.played ? 'bg-sun/15' : ''}`}
              >
                <td className="py-3 pl-4">
                  <span
                    className={`grid size-7 place-items-center rounded-full text-sm font-bold ${PLACE_STYLE[i] ?? 'text-navy/50'}`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <TeamBadge team={row.team} size="sm" />
                    <span className="font-bold">{row.team.name}</span>
                    {closed && i === 0 && row.played > 0 && <span title="Champions">🏆</span>}
                    {closed && i === 1 && row.played > 0 && <span title="Runners-up">🥈</span>}
                  </div>
                </td>
                {[row.played, row.won, row.drawn, row.lost, row.gf, row.ga].map((v, k) => (
                  <td key={k} className="px-2 py-3 text-center font-medium tabular-nums text-navy/70">
                    {v}
                  </td>
                ))}
                <td className="px-2 py-3 text-center font-medium tabular-nums text-navy/70">
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="px-2 py-3 text-center">
                  <span className="inline-block min-w-9 rounded-xl bg-pink px-2 py-1 font-bold text-white tabular-nums">
                    {row.points}
                  </span>
                </td>
                <td className="hidden py-3 pr-4 sm:table-cell">
                  <div className="flex gap-1">
                    {row.form.slice(-5).map((f, k) => (
                      <span key={k} className={`grid size-6 place-items-center rounded-md text-[11px] font-bold text-navy ${FORM_COLOR[f]}`}>
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-navy/5 px-4 py-3 text-xs text-navy/50">
        Win 3 · Draw 1 · Loss 0. Ties split by goal difference, goals scored, then head-to-head.
      </p>
    </div>
  )
}
