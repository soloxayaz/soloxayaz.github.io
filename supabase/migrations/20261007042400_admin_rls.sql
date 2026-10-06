-- UNYIELDED portfolio admin access
-- Project: vptnxkqyptsxurhaqqlp

-- Enable RLS.
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_skills enable row level security;

-- Remove previous policies with the common names used by earlier setup attempts.
drop policy if exists "Public can read published projects" on public.portfolio_projects;
drop policy if exists "Admin can manage projects" on public.portfolio_projects;
drop policy if exists "Public can read published skills" on public.portfolio_skills;
drop policy if exists "Admin can manage skills" on public.portfolio_skills;

drop policy if exists "portfolio_projects_public_read" on public.portfolio_projects;
drop policy if exists "portfolio_projects_admin_all" on public.portfolio_projects;
drop policy if exists "portfolio_skills_public_read" on public.portfolio_skills;
drop policy if exists "portfolio_skills_admin_all" on public.portfolio_skills;

-- --------------------------------------------------
-- PROJECTS
-- --------------------------------------------------

create policy "portfolio_projects_public_read"
on public.portfolio_projects
for select
to anon, authenticated
using (
  published = true
  or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
);

create policy "portfolio_projects_admin_all"
on public.portfolio_projects
for all
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
);

-- --------------------------------------------------
-- SKILLS
-- --------------------------------------------------

create policy "portfolio_skills_public_read"
on public.portfolio_skills
for select
to anon, authenticated
using (
  published = true
  or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
);

create policy "portfolio_skills_admin_all"
on public.portfolio_skills
for all
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
);
