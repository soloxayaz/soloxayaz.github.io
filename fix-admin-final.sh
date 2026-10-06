#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "Installing final admin authentication fix..."

# ============================================================
# ADMIN AUTH
# ============================================================

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
      "Supabase is not configured. Check your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return supabase;
}

export async function getCurrentUser() {
  const client = getSupabase();

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user ?? null;
}

export function userIsAdmin(user: { email?: string | null } | null) {
  if (!user?.email) {
    return false;
  }

  return user.email.trim().toLowerCase() === ADMIN_EMAIL;
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


# ============================================================
# DASHBOARD AUTH BOOT
# ============================================================

python3 - <<'PY'
from pathlib import Path

p = Path("src/components/admin/admin-dashboard.tsx")
s = p.read_text()

s = s.replace(
'''  getCurrentUser,
  isAdmin,
  signOut,''',
'''  getCurrentUser,
  userIsAdmin,
  signOut,''')

start = s.index("  async function boot() {")

end = s.index("\n  useEffect(() => {", start)

new_boot = '''  async function boot() {
    try {
      const user = await getCurrentUser();

      if (!user) {
        window.location.replace("/admin/login");
        return;
      }

      const email = user.email?.trim().toLowerCase() ?? "";

      setUserEmail(user.email ?? "");

      if (!userIsAdmin(user)) {
        setError(
          `Signed in as ${email || "unknown account"}. This account is not authorized for the portfolio CMS.`
        );
        return;
      }

      const [projectRows, skillRows] = await Promise.all([
        getProjects(),
        getSkills(),
      ]);

      setProjects(projectRows);
      setSkills(skillRows);
      setAuthorized(true);
    } catch (err) {
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

s = s[:start] + new_boot + s[end:]

p.write_text(s)
PY


# ============================================================
# LOGIN — NO AUTH CHECK / NO FLASH
# ============================================================

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

    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);

      window.location.href = "/admin";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
      setLoading(false);
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

        <form onSubmit={submit} className="admin-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              required
              autoFocus
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
            {loading ? "AUTHENTICATING…" : "SIGN IN"}
          </button>
        </form>

        <a href="/" className="admin-back">
          ← Return to portfolio
        </a>
      </section>
    </main>
  );
}
EOF


# ============================================================
# TYPECHECK
# ============================================================

echo
echo "Running TypeScript check..."
npm run typecheck

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " FINAL ADMIN AUTH PATCH INSTALLED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "IMPORTANT: restart the Vite server completely."
echo
echo "  Ctrl+C"
echo "  npm run dev"
echo
