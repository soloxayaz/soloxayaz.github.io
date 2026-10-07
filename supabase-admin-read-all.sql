-- OPTIONAL. Run in Supabase Dashboard -> SQL Editor only if hiding a project
-- or skill fails, or hidden items vanish from the admin panel.
--
-- Why: the public read policies only allow `published = true`. Without an
-- admin SELECT policy, the admin cannot read unpublished rows, and an UPDATE
-- that sets published = false is rejected because its returned row is no
-- longer visible.

drop policy if exists "portfolio_projects_admin_select" on public.portfolio_projects;
create policy "portfolio_projects_admin_select"
on public.portfolio_projects
for select
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
);

drop policy if exists "portfolio_skills_admin_select" on public.portfolio_skills;
create policy "portfolio_skills_admin_select"
on public.portfolio_skills
for select
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('ahmadayaz0704@gmail.com')
);
