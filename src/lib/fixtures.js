// Helpers for building a single round-robin across two courts.

export const pairKey = (a, b) => [a, b].sort().join(':')

// Every pairing that still needs a match (everyone plays each other once).
export function remainingPairings(teams, matches) {
  const played = new Set(matches.map((m) => pairKey(m.home_team_id, m.away_team_id)))
  const pairs = []
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      if (!played.has(pairKey(teams[i].id, teams[j].id))) pairs.push([teams[i], teams[j]])
    }
  }
  return pairs
}

// Circle method: returns rounds of [homeId, awayId] pairs, in draw order.
export function roundRobinRounds(teamIds) {
  const ids = [...teamIds]
  if (ids.length % 2) ids.push(null) // bye
  const n = ids.length
  const rounds = []
  for (let r = 0; r < n - 1; r++) {
    const round = []
    for (let i = 0; i < n / 2; i++) {
      const a = ids[i]
      const b = ids[n - 1 - i]
      if (a && b) round.push(r % 2 ? [b, a] : [a, b])
    }
    rounds.push(round)
    ids.splice(1, 0, ids.pop()) // rotate all but the first
  }
  return rounds
}

// Pack matches into slots of 2 courts. A team never plays both courts in one slot,
// and we prefer giving teams a rest instead of back-to-back games.
export function packIntoSlots(pairs, courts = 2) {
  const queue = [...pairs]
  const slots = []
  let lastPlayed = new Set()
  while (queue.length) {
    const slot = []
    const busy = new Set()
    for (const preferRest of [true, false]) {
      for (let i = 0; i < queue.length && slot.length < courts; i++) {
        const [a, b] = queue[i]
        if (busy.has(a) || busy.has(b)) continue
        if (preferRest && (lastPlayed.has(a) || lastPlayed.has(b))) continue
        slot.push(queue.splice(i, 1)[0])
        busy.add(a).add(b)
        i--
      }
    }
    slots.push(slot)
    lastPlayed = busy
  }
  return slots
}

export function generateSchedule(tournamentId, teams) {
  const rounds = roundRobinRounds(teams.map((t) => t.id))
  const slots = packIntoSlots(rounds.flat())
  return slots.flatMap((slot, i) =>
    slot.map(([home, away], c) => ({
      tournament_id: tournamentId,
      slot: i + 1,
      court: c + 1,
      home_team_id: home,
      away_team_id: away,
    })),
  )
}

// First free slot/court (fills Court 1 & 2 of a slot before moving on).
export function nextFreeSpot(matches, pair) {
  const bySlot = new Map()
  for (const m of matches) {
    if (!bySlot.has(m.slot)) bySlot.set(m.slot, [])
    bySlot.get(m.slot).push(m)
  }
  const maxSlot = Math.max(0, ...bySlot.keys())
  for (let s = 1; s <= maxSlot; s++) {
    const inSlot = bySlot.get(s) || []
    const clash = pair && inSlot.some((m) => pair.includes(m.home_team_id) || pair.includes(m.away_team_id))
    if (inSlot.length < 2 && !clash) {
      const court = inSlot.some((m) => m.court === 1) ? 2 : 1
      return { slot: s, court }
    }
  }
  return { slot: maxSlot + 1, court: 1 }
}

// Time for a slot based on tournament start + match length + changeover.
export function slotKickoff(startTime, slot, matchMinutes, breakMinutes = 0) {
  if (!startTime) return null
  const [h, m] = startTime.split(':').map(Number)
  const total = h * 60 + m + (slot - 1) * (matchMinutes + breakMinutes)
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

// Teams appearing twice in the same slot (for admin warnings).
export function slotClashes(matches) {
  const clashes = new Set()
  const seen = new Map()
  for (const m of matches) {
    for (const t of [m.home_team_id, m.away_team_id]) {
      const key = `${m.slot}:${t}`
      if (seen.has(key)) {
        clashes.add(m.id)
        clashes.add(seen.get(key))
      } else seen.set(key, m.id)
    }
  }
  return clashes
}
