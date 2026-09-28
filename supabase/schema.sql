-- Kickerz Girls League – database schema
-- Run once in the Supabase SQL editor (safe to re-run).

create extension if not exists pgcrypto;

-- ── Admin allow-list ──────────────────────────────────────────────
-- Only emails listed here can edit data. Anyone else who signs in is read-only.
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- ── Tables ────────────────────────────────────────────────────────
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  season text not null default 'Kickerz Girls League 2026',
  age_group text,
  event_date date,
  start_time time,
  end_time time,
  venue text,
  match_minutes int not null default 10,
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'closed')),
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  name text not null,
  color text not null default '#ff0a78',
  draw_no int,
  created_at timestamptz not null default now()
);
create index if not exists teams_tournament_idx on public.teams (tournament_id);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  slot int not null default 1,
  court int not null default 1 check (court in (1, 2)),
  kickoff time,
  home_team_id uuid not null references public.teams (id) on delete cascade,
  away_team_id uuid not null references public.teams (id) on delete cascade,
  home_score int,
  away_score int,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'finished')),
  note text,
  created_at timestamptz not null default now(),
  check (home_team_id <> away_team_id)
);
create index if not exists matches_tournament_idx on public.matches (tournament_id, slot, court);

-- ── Row level security: public read, admin write ─────────────────
do $$
declare t text;
begin
  foreach t in array array['tournaments', 'teams', 'matches'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
grant select on public.admins to authenticated;

-- ── Realtime (live scores for viewers) ───────────────────────────
do $$
declare t text;
begin
  foreach t in array array['tournaments', 'teams', 'matches'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
