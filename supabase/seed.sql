-- Seed the two 2026 league days from the cover letter (safe to re-run).
insert into public.tournaments
  (name, slug, age_group, event_date, start_time, end_time, venue, match_minutes, status, description)
values
  ('U15 Girls League', 'u15-2026', 'U15 (2011 & 2012)', '2026-10-07', '16:00', '18:00',
   'Uni Sports, Kirulapona', 15, 'upcoming',
   'Round-robin league. 5v5 futsal rules, 15-minute matches with no half time.'),
  ('U13 Girls League', 'u13-2026', 'U13 (2013 & 2014)', '2026-10-14', '16:00', '18:00',
   'Uni Sports, Kirulapona', 8, 'upcoming',
   'Round-robin league. 5v5 futsal rules, 8-minute matches with no half time.')
on conflict (slug) do nothing;
