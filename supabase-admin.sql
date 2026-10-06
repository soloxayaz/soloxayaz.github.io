-- ============================================================
-- PORTFOLIO CMS V2
-- ADMIN-ONLY SUPABASE POLICIES
-- ============================================================
--
-- IMPORTANT:
-- Replace YOUR_ADMIN_EMAIL_HERE with the exact email address
-- that you will use for the portfolio administrator.
--
-- Example:
--   'ahmadayaz0704@gmail.com'
--
-- Run this entire file in:
-- Supabase Dashboard → SQL Editor → New query
--
-- The public website can continue SELECTing published rows.
-- Only the configured admin email can INSERT/UPDATE/DELETE.
-- ============================================================


-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------

alter table public.portfolio_projects enable row level security;

drop policy if exists "portfolio_projects_public_read"
on public.portfolio_projects;

drop policy if exists "portfolio_projects_admin_insert"
on public.portfolio_projects;

drop policy if exists "portfolio_projects_admin_update"
on public.portfolio_projects;

drop policy if exists "portfolio_projects_admin_delete"
on public.portfolio_projects;


create policy "portfolio_projects_public_read"
on public.portfolio_projects
for select
to anon, authenticated
using (
  published = true
);


create policy "portfolio_projects_admin_insert"
on public.portfolio_projects
for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
);


create policy "portfolio_projects_admin_update"
on public.portfolio_projects
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
);


create policy "portfolio_projects_admin_delete"
on public.portfolio_projects
for delete
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
);


-- ------------------------------------------------------------
-- SKILLS
-- ------------------------------------------------------------

alter table public.portfolio_skills enable row level security;

drop policy if exists "portfolio_skills_public_read"
on public.portfolio_skills;

drop policy if exists "portfolio_skills_admin_insert"
on public.portfolio_skills;

drop policy if exists "portfolio_skills_admin_update"
on public.portfolio_skills;

drop policy if exists "portfolio_skills_admin_delete"
on public.portfolio_skills;


create policy "portfolio_skills_public_read"
on public.portfolio_skills
for select
to anon, authenticated
using (
  published = true
);


create policy "portfolio_skills_admin_insert"
on public.portfolio_skills
for insert
to authenticated
with check (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
);


create policy "portfolio_skills_admin_update"
on public.portfolio_skills
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
);


create policy "portfolio_skills_admin_delete"
on public.portfolio_skills
for delete
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', ''))
  = lower('YOUR_ADMIN_EMAIL_HERE')
);
