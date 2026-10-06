#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "Fixing UNYIELDED admin authentication..."

cat > src/lib/admin.ts <<'EOF'
import { supabase } from "@/lib/supabase";

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

const configuredAdminEmail =
  import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() || "";

export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return supabase;
}

export async function getCurrentUser() {
  const client = getSupabase();

  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const userEmail = user.email?.trim().toLowerCase();

  return Boolean(
    configuredAdminEmail &&
    userEmail &&
    userEmail === configuredAdminEmail
  );
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

    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);

      window.location.assign("/admin");
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

        <h1 className="admin-login-title">Admin</h1>

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

echo "Running typecheck..."
npm run typecheck

echo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ADMIN AUTH PATCH COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo
echo "Now restart the dev server:"
echo
echo "  npm run dev"
echo
echo "Then open:"
echo
echo "  http://localhost:8080/admin/login"
echo
