# Kickerz Girls League

Tournament site for the Kickerz Girls League (Colombo Kickerz Football Academy).
React + Vite + Tailwind v4 + Motion, with Supabase for data, auth and live updates.

- **Public:** `/` shows the match days, awards, rules and registration. `/t/<slug>` shows fixtures by game (Court 1 and Court 2 side by side), a live league table and the teams. Scores update live, with no page refresh.
- **Admin:** use **Login** at the top. `/admin` is where you create, edit, close, reopen or delete tournaments. `/admin/t/<slug>` has three steps: **Teams & draw**, then **Fixtures**, then **Live scores**.

## Run locally

```bash
npm install
npm run dev
```

`.env` needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).

## Database

`supabase/schema.sql` creates the tables (`tournaments`, `teams`, `matches`, `admins`), the security rules and live updates.
`supabase/seed.sql` adds the two 2026 match days: U15 on 7 Oct and U13 on 14 Oct.
Both are already applied to the project. You can safely run them again in the Supabase SQL editor.

Security: anyone can **read**. Only emails listed in `public.admins` can **write**.

### Adding an admin

1. Supabase dashboard → Authentication → Users → **Add user**. Enter an email and password and tick "Auto confirm".
2. SQL editor:
   ```sql
   insert into public.admins (email) values ('organiser@example.com');
   ```
3. Recommended: Authentication → Sign In / Providers → turn off **Allow new users to sign up**.

## Match-day workflow

1. **Teams & draw:** add each team as it comes out of the physical draw. The draw number is set automatically, and you can reorder with the arrows. "Paste many" adds a whole list at once.
2. **Fixtures:** you have two options.
   - Click the pairings in the order you want. Each one goes to the next free court: Court 1 and Court 2 of a game kick off together.
   - Or click **Auto-build from draw order**. This makes a full round-robin with no team on both courts at once and as few back-to-back games as possible.
   After either option you can still edit the game number, court, teams or kick-off time of any match. **Kick-off times** fills in all times from the start time, match length and an optional break.
3. **Live scores:** tap +/− for goals. The first goal switches a match to **Live**. Set **Full time** when it ends. A walkover records a 3–0.
4. At the end of the day, set the tournament to **Closed**. It moves to "Past tournaments" on the home page, with 🏆 and 🥈 in the final table.

## Deploy

Run `npm run build` and upload `dist/`. SPA routing is handled by `public/_redirects` (Netlify) and `vercel.json` (Vercel).
Other hosts need a rewrite of all paths to `/index.html`. Remember to set the two `VITE_` env vars on the host.
