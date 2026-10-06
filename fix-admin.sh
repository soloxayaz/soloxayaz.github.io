#!/usr/bin/env bash
set -e

echo "==> Fixing admin routes + portfolio type error..."

# 1. Fix the skill-group TypeScript cast in the existing data layer.
python3 - <<'PY'
from pathlib import Path

p = Path("src/lib/portfolio-data.ts")
s = p.read_text()

old = '''    return {
      id: groupKey,
      label: groupRows[0]?.group_label ?? fallback?.label ?? groupKey,
      items:
        groupRows.length > 0
          ? groupRows.map((row) => ({
              name: row.skill_name,
              hint: row.level,
            }))
          : (fallback?.items ?? []),
    };
  }) as typeof fallbackSkillGroups;'''

new = '''    return {
      id: groupKey,
      label: groupRows[0]?.group_label ?? fallback?.label ?? groupKey,
      items:
        groupRows.length > 0
          ? groupRows.map((row) => ({
              name: row.skill_name,
              hint: row.level,
            }))
          : (fallback?.items ?? []),
    };
  }) as unknown as typeof fallbackSkillGroups;'''

if old in s:
    p.write_text(s.replace(old, new))
    print("✓ Fixed portfolio-data.ts")
else:
    print("! portfolio-data.ts pattern already fixed or changed")
PY

# 2. Generate TanStack's route tree using the project's installed CLI.
echo "==> Generating route tree..."

if [ -x "./node_modules/.bin/tsr" ]; then
  ./node_modules/.bin/tsr generate
elif [ -x "./node_modules/.bin/tanstack-router" ]; then
  ./node_modules/.bin/tanstack-router generate
else
  echo "Trying npm package script..."
  npx --yes @tanstack/router-cli generate
fi

# 3. Verify the generated route tree contains admin routes.
if grep -q 'admin' src/routeTree.gen.ts; then
  echo "✓ Admin routes registered"
else
  echo "ERROR: Admin routes were not generated."
  exit 1
fi

# 4. Typecheck.
echo "==> Running TypeScript check..."
npm run typecheck

echo ""
echo "======================================"
echo " ADMIN CMS FIXED"
echo "======================================"
echo ""
echo "Start:"
echo "  npm run dev"
echo ""
echo "Open:"
echo "  http://localhost:8080/admin/login"
echo ""
