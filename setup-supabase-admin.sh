#!/data/data/com.termux/files/usr/bin/bash
set -e

PROJECT_DIR="$HOME/downloads/soloxayaz/soloxayaz.github.io"
PROJECT_REF="vptnxkqyptsxurhaqqlp"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"

cd "$PROJECT_DIR"

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " UNYIELDED PORTFOLIO — SUPABASE ADMIN SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "Project : $PROJECT_REF"
echo "URL     : $SUPABASE_URL"
echo

# --------------------------------------------------
# 1. Find admin email
# --------------------------------------------------

ADMIN_EMAIL=""

if [ -f .env.local ]; then
  ADMIN_EMAIL="$(grep '^VITE_ADMIN_EMAIL=' .env.local 2>/dev/null | head -n1 | cut -d= -f2- | tr -d '\r' || true)"
fi

if [ -z "$ADMIN_EMAIL" ] && [ -f .env ]; then
  ADMIN_EMAIL="$(grep '^VITE_ADMIN_EMAIL=' .env 2>/dev/null | head -n1 | cut -d= -f2- | tr -d '\r' || true)"
fi

if [ -z "$ADMIN_EMAIL" ]; then
  echo "Enter the email address that will be allowed into /admin."
  printf "Admin email: "
  read -r ADMIN_EMAIL
fi

if [ -z "$ADMIN_EMAIL" ]; then
  echo "ERROR: Admin email cannot be empty."
  exit 1
fi

echo
echo "Admin email: $ADMIN_EMAIL"
echo

# --------------------------------------------------
# 2. Ensure .env.local contains Supabase config
# --------------------------------------------------

touch .env.local

set_env_value() {
  KEY="$1"
  VALUE="$2"

  if grep -q "^${KEY}=" .env.local 2>/dev/null; then
    sed -i "s#^${KEY}=.*#${KEY}=${VALUE}#" .env.local
  else
    printf '\n%s=%s\n' "$KEY" "$VALUE" >> .env.local
  fi
}

# Preserve existing publishable key if already configured.
set_env_value "VITE_SUPABASE_URL" "$SUPABASE_URL"
set_env_value "VITE_ADMIN_EMAIL" "$ADMIN_EMAIL"

if ! grep -q '^VITE_SUPABASE_PUBLISHABLE_KEY=' .env.local 2>/dev/null; then
  echo
  echo "VITE_SUPABASE_PUBLISHABLE_KEY is not present in .env.local."
  echo "If your existing project already has it in another env file,"
  echo "the installer will leave that file untouched."
  echo
fi

# --------------------------------------------------
# 3. Make sure migration directory exists
# --------------------------------------------------

mkdir -p supabase/migrations

MIGRATION="supabase/migrations/$(date +%Y%m%d%H%M%S)_admin_rls.sql"

# Escape single quotes for SQL.
SQL_ADMIN_EMAIL="${ADMIN_EMAIL//\'/\'\'}"

# --------------------------------------------------
# 4. Create correct RLS migration
# --------------------------------------------------

cat > "$MIGRATION" <<SQL
-- UNYIELDED portfolio admin access
-- Project: ${PROJECT_REF}

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
  or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('${SQL_ADMIN_EMAIL}')
);

create policy "portfolio_projects_admin_all"
on public.portfolio_projects
for all
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('${SQL_ADMIN_EMAIL}')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('${SQL_ADMIN_EMAIL}')
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
  or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('${SQL_ADMIN_EMAIL}')
);

create policy "portfolio_skills_admin_all"
on public.portfolio_skills
for all
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('${SQL_ADMIN_EMAIL}')
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('${SQL_ADMIN_EMAIL}')
);
SQL

echo "✓ Created migration:"
echo "  $MIGRATION"
echo

# --------------------------------------------------
# 5. Locate usable Supabase CLI
# --------------------------------------------------

SUPABASE_CMD=""

if command -v supabase >/dev/null 2>&1; then
  if supabase --version >/dev/null 2>&1; then
    SUPABASE_CMD="supabase"
  fi
fi

if [ -z "$SUPABASE_CMD" ]; then
  echo "Native Supabase CLI is missing/broken."
  echo "Trying npx Supabase CLI..."
  echo

  if npx --yes supabase --version >/dev/null 2>&1; then
    SUPABASE_CMD="npx --yes supabase"
  else
    echo
    echo "ERROR: Could not start the Supabase CLI through npx."
    echo
    echo "Your project files and migration were NOT deleted."
    echo "Migration:"
    echo "  $MIGRATION"
    echo
    echo "Try:"
    echo "  npx --yes supabase --version"
    exit 1
  fi
fi

echo "✓ Supabase CLI:"
$SUPABASE_CMD --version
echo

# --------------------------------------------------
# 6. Link the EXISTING Supabase project
# --------------------------------------------------

echo "Linking existing Supabase project..."
echo

$SUPABASE_CMD link --project-ref "$PROJECT_REF"

echo
echo "✓ Existing Supabase project linked."
echo

# --------------------------------------------------
# 7. Push migration to remote database
# --------------------------------------------------

echo "Pushing database migration..."
echo

$SUPABASE_CMD db push

echo
echo "✓ Database migration applied."
echo

# --------------------------------------------------
# 8. Final checks
# --------------------------------------------------

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " SUPABASE ADMIN SETUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "Supabase URL:"
echo "  $SUPABASE_URL"
echo
echo "Project ref:"
echo "  $PROJECT_REF"
echo
echo "Admin email:"
echo "  $ADMIN_EMAIL"
echo
echo "Migration:"
echo "  $MIGRATION"
echo
echo "Next:"
echo "  npm run typecheck"
echo "  npm run build"
echo
echo "Admin URL after deployment:"
echo "  /admin/login"
echo
