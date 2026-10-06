#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " REPAIRING ADMIN LOGIN FLOW"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# --------------------------------------------------
# ADMIN AUTH
# --------------------------------------------------

cat > src/lib/admin.ts <<'EOF'
import { supabase } from "@/lib/supabase";

export const ADMIN_EMAIL = "ahmadayaz0704@gmail.com";

export type AdminProject = {
  id: string;
  project_index: string;
  title: string;
  project_type: string;
  category: string;
  href: string;
  external: boolean;
  summary: string;
  pattern: string;
  published: boolean;
};

export type AdminSkill = {
  id: number;
  group_key: string;
  group_label: string;
  skill_name: string;
  level: string;
  sort_order: number;
  published: boolean;
};

export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Check your environment variables."
    );
  }

  return supabase;
}

export async function getSession() {
  const client = getSupabase();

  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session ?? null;
}

export async function signIn(email: string, password: string) {
  const client = getSupabase();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const client = getSupabase();
  await client.auth.signOut();
}

export function isAdminEmail(email: string | null | undefined) {
  return (
    !!email &&
    email.trim().toLowerCase() === ADMIN_EMAIL
  );
}

export async function getProjects() {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .select(
      "id, project_index, title, project_type, category, href, external, summary, pattern, published"
    )
    .order("project_index", { ascending: true });

  if (error) throw error;

  return (data ?? []) as AdminProject[];
}

export async function insertProject(
  project: Omit<AdminProject, "id">
) {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;

  return data as AdminProject;
}

export async function editProject(
  id: string,
  project: Partial<Omit<AdminProject, "id">>
) {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as AdminProject;
}

export async function removeProject(id: string) {
  const client = getSupabase();

  const { error } = await client
    .from("portfolio_projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getSkills() {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .select(
      "id, group_key, group_label, skill_name, level, sort_order, published"
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []) as AdminSkill[];
}

export async function insertSkill(
  skill: Omit<AdminSkill, "id">
) {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .insert(skill)
    .select()
    .single();

  if (error) throw error;

  return data as AdminSkill;
}

export async function editSkill(
  id: number,
  skill: Partial<Omit<AdminSkill, "id">>
) {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .update(skill)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as AdminSkill;
}

export async function removeSkill(id: number) {
  const client = getSupabase();

  const { error } = await client
    .from("portfolio_skills")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
EOF


# --------------------------------------------------
# LOGIN PAGE
# --------------------------------------------------

cat > src/components/admin/admin-login.tsx <<'EOF'
import { useState } from "react";
import { signIn } from "@/lib/admin";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await signIn(email.trim(), password);

      window.location.replace("/admin");
    } catch (err) {
      setLoading(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    }
  }

  return (
    <main className="admin-page admin-center">
      <section className="admin-login-card">
        <div className="admin-eyebrow">
          PORTFOLIO CMS · SECURE ACCESS
        </div>

        <h1 className="admin-login-title">
          Admin
        </h1>

        <p className="admin-muted admin-login-description">
          Sign in to manage your portfolio content.
        </p>

        <form
          onSubmit={submit}
          className="admin-form"
        >
          <label>
            <span>Email</span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@example.com"
              autoComplete="username"
              autoFocus
              required
            />
          </label>

          <label>
            <span>Password</span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="admin-primary-button"
          >
            {loading
              ? "AUTHENTICATING…"
              : "SIGN IN"}
          </button>
        </form>

        <a
          href="/"
          className="admin-back"
        >
          ← Return to portfolio
        </a>
      </section>
    </main>
  );
}
EOF


# --------------------------------------------------
# DASHBOARD
# --------------------------------------------------

python3 - <<'PY'
from pathlib import Path

p = Path("src/components/admin/admin-dashboard.tsx")
s = p.read_text()

s = s.replace(
    '  getCurrentUser,\n  userIsAdmin,\n  signOut,',
    '  getSession,\n  isAdminEmail,\n  signOut,'
)

start = s.index("  async function boot() {")
end = s.index("\n  useEffect(() => {", start)

boot = '''  async function boot() {
    try {
      const session = await getSession();

      if (!session) {
        window.location.replace("/admin/login");
        return;
      }

      const email = session.user.email ?? "";

      setUserEmail(email);

      if (!isAdminEmail(email)) {
        setError(
          `Signed in as ${email}. This account is not authorized for the portfolio CMS.`
        );
        return;
      }

      const [projectRows, skillRows] =
        await Promise.all([
          getProjects(),
          getSkills(),
        ]);

      setProjects(projectRows);
      setSkills(skillRows);
      setAuthorized(true);
    } catch (err) {
      /*
       * A missing/expired session is NOT an access-denied
       * condition. Send the visitor back to the login page.
       */
      if (
        err instanceof Error &&
        /auth session missing|session/i.test(err.message)
      ) {
        window.location.replace("/admin/login");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to initialize admin."
      );
    } finally {
      setChecking(false);
    }
  }
'''

s = s[:start] + boot + s[end:]

p.write_text(s)
PY


# --------------------------------------------------
# REMOVE ANY STALE ROUTE CACHE
# --------------------------------------------------

rm -f src/routeTree.gen.ts
rm -rf node_modules/.vite .tanstack 2>/dev/null || true


# --------------------------------------------------
# REGENERATE ROUTES
# --------------------------------------------------

echo
echo "Regenerating TanStack routes..."

npx tsr generate


# --------------------------------------------------
# TYPECHECK
# --------------------------------------------------

echo
echo "Running typecheck..."

npm run typecheck

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ADMIN FLOW REPAIRED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "Now STOP your current dev server with Ctrl+C."
echo
echo "Then run:"
echo
echo "  npm run dev"
echo
echo "Open:"
echo
echo "  http://localhost:8080/admin/login"
echo
