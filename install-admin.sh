#!/usr/bin/env bash
set -e

echo "==> Installing UNYIELDED Portfolio Admin CMS..."

ROOT="$(pwd)"

mkdir -p src/components/admin
mkdir -p src/routes

cat > src/lib/admin.ts <<'ADMIN_LIB'
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

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return supabase;
}

export async function getAdminSession() {
  const client = requireSupabase();

  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) throw error;

  return session;
}

export async function signInAdmin(email: string, password: string) {
  const client = requireSupabase();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOutAdmin() {
  const client = requireSupabase();
  await client.auth.signOut();
}

export async function listAdminProjects() {
  const client = requireSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .select(
      "id, project_index, title, project_type, category, href, external, summary, pattern, published"
    )
    .order("project_index", { ascending: true });

  if (error) throw error;

  return (data ?? []) as AdminProject[];
}

export async function createProject(
  project: Omit<AdminProject, "id">
) {
  const client = requireSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;

  return data as AdminProject;
}

export async function updateProject(
  id: string,
  project: Partial<Omit<AdminProject, "id">>
) {
  const client = requireSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as AdminProject;
}

export async function deleteProject(id: string) {
  const client = requireSupabase();

  const { error } = await client
    .from("portfolio_projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function listAdminSkills() {
  const client = requireSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .select(
      "id, group_key, group_label, skill_name, level, sort_order, published"
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []) as AdminSkill[];
}

export async function createSkill(
  skill: Omit<AdminSkill, "id">
) {
  const client = requireSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .insert(skill)
    .select()
    .single();

  if (error) throw error;

  return data as AdminSkill;
}

export async function updateSkill(
  id: number,
  skill: Partial<Omit<AdminSkill, "id">>
) {
  const client = requireSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .update(skill)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as AdminSkill;
}

export async function deleteSkill(id: number) {
  const client = requireSupabase();

  const { error } = await client
    .from("portfolio_skills")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
ADMIN_LIB

cat > src/components/admin/admin-login.tsx <<'LOGIN'
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { signInAdmin } from "@/lib/admin";

export function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    setBusy(true);
    setError("");

    try {
      await signInAdmin(email.trim(), password);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.28em] uppercase text-[var(--color-accent)]">
            Portfolio CMS
          </p>

          <h1 className="mt-4 font-display text-5xl leading-none">
            Admin
          </h1>

          <p className="mt-4 text-sm text-[var(--color-dim)]">
            Sign in to manage the portfolio content.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 outline-none transition focus:border-[var(--color-accent)]"
          />

          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 outline-none transition focus:border-[var(--color-accent)]"
          />

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[var(--color-paper)] px-4 py-4 font-medium text-[var(--color-ink)] transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Enter dashboard"}
          </button>
        </form>

        <a
          href="/"
          className="mt-8 block text-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-dim)] hover:text-[var(--color-paper)]"
        >
          ← Back to portfolio
        </a>
      </div>
    </main>
  );
}
LOGIN

cat > src/components/admin/admin-dashboard.tsx <<'DASHBOARD'
import { useEffect, useState } from "react";
import {
  createProject,
  createSkill,
  deleteProject,
  deleteSkill,
  getAdminSession,
  listAdminProjects,
  listAdminSkills,
  signOutAdmin,
  updateProject,
  updateSkill,
  type AdminProject,
  type AdminSkill,
} from "@/lib/admin";
import { useNavigate } from "@tanstack/react-router";

const emptyProject: Omit<AdminProject, "id"> = {
  project_index: "01",
  title: "",
  project_type: "",
  category: "web",
  href: "",
  external: true,
  summary: "",
  pattern: "grid",
  published: true,
};

const emptySkill: Omit<AdminSkill, "id"> = {
  group_key: "frontend",
  group_label: "Frontend",
  skill_name: "",
  level: "",
  sort_order: 0,
  published: true,
};

export function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [project, setProject] =
    useState<Omit<AdminProject, "id">>(emptyProject);
  const [skill, setSkill] =
    useState<Omit<AdminSkill, "id">>(emptySkill);

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<number | null>(null);

  const [tab, setTab] = useState<"projects" | "skills">("projects");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const session = await getAdminSession();

      if (!session) {
        navigate({ to: "/admin/login" });
        return;
      }

      const [nextProjects, nextSkills] = await Promise.all([
        listAdminProjects(),
        listAdminSkills(),
      ]);

      setProjects(nextProjects);
      setSkills(nextSkills);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load CMS."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function flash(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  }

  async function saveProject(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingProject) {
        await updateProject(editingProject, project);
        flash("Project updated.");
      } else {
        await createProject(project);
        flash("Project created.");
      }

      setProject(emptyProject);
      setEditingProject(null);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save project."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeProject(id: string) {
    if (!confirm("Delete this project permanently?")) return;

    try {
      await deleteProject(id);
      flash("Project deleted.");
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete project."
      );
    }
  }

  function editProject(item: AdminProject) {
    setEditingProject(item.id);
    setProject({
      project_index: item.project_index,
      title: item.title,
      project_type: item.project_type,
      category: item.category,
      href: item.href,
      external: item.external,
      summary: item.summary,
      pattern: item.pattern,
      published: item.published,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggleProject(item: AdminProject) {
    try {
      await updateProject(item.id, {
        published: !item.published,
      });

      flash(item.published ? "Project hidden." : "Project published.");
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update project."
      );
    }
  }

  async function saveSkill(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingSkill !== null) {
        await updateSkill(editingSkill, skill);
        flash("Skill updated.");
      } else {
        await createSkill(skill);
        flash("Skill created.");
      }

      setSkill(emptySkill);
      setEditingSkill(null);
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save skill."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeSkill(id: number) {
    if (!confirm("Delete this skill permanently?")) return;

    try {
      await deleteSkill(id);
      flash("Skill deleted.");
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete skill."
      );
    }
  }

  function editSkill(item: AdminSkill) {
    setEditingSkill(item.id);
    setSkill({
      group_key: item.group_key,
      group_label: item.group_label,
      skill_name: item.skill_name,
      level: item.level,
      sort_order: item.sort_order,
      published: item.published,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function logout() {
    await signOutAdmin();
    navigate({ to: "/admin/login" });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)] flex items-center justify-center">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[var(--color-dim)]">
          Loading CMS…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-ink)] text-[var(--color-paper)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-ink)]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-accent)]">
              Portfolio CMS
            </p>
            <h1 className="mt-1 font-display text-2xl">
              Control Room
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-lg border border-white/10 px-4 py-2 text-xs hover:bg-white/5"
            >
              View site
            </a>

            <button
              onClick={logout}
              className="rounded-lg border border-white/10 px-4 py-2 text-xs hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {message && (
          <div className="mb-6 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-8 flex gap-2 border-b border-white/10">
          <button
            onClick={() => setTab("projects")}
            className={`px-4 py-3 text-sm ${
              tab === "projects"
                ? "border-b border-[var(--color-accent)] text-[var(--color-paper)]"
                : "text-[var(--color-dim)]"
            }`}
          >
            Projects · {projects.length}
          </button>

          <button
            onClick={() => setTab("skills")}
            className={`px-4 py-3 text-sm ${
              tab === "skills"
                ? "border-b border-[var(--color-accent)] text-[var(--color-paper)]"
                : "text-[var(--color-dim)]"
            }`}
          >
            Skills · {skills.length}
          </button>
        </div>

        {tab === "projects" && (
          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <section>
              <div className="mb-5">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-accent)]">
                  {editingProject ? "Edit project" : "New project"}
                </p>
                <h2 className="mt-2 font-display text-3xl">
                  {editingProject ? "Update work" : "Add work"}
                </h2>
              </div>

              <form onSubmit={saveProject} className="space-y-3">
                <input
                  required
                  placeholder="Project title"
                  value={project.title}
                  onChange={(e) =>
                    setProject({ ...project, title: e.target.value })
                  }
                  className="admin-input"
                />

                <input
                  required
                  placeholder="Project index e.g. 01"
                  value={project.project_index}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      project_index: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  required
                  placeholder="Project type / year"
                  value={project.project_type}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      project_type: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  required
                  placeholder="Category"
                  value={project.category}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      category: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  required
                  placeholder="Project URL"
                  value={project.href}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      href: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  required
                  placeholder="Pattern e.g. grid"
                  value={project.pattern}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      pattern: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <textarea
                  required
                  placeholder="Project summary"
                  rows={5}
                  value={project.summary}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      summary: e.target.value,
                    })
                  }
                  className="admin-input resize-y"
                />

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={project.external}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        external: e.target.checked,
                      })
                    }
                  />
                  External link
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={project.published}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        published: e.target.checked,
                      })
                    }
                  />
                  Published on public site
                </label>

                <button
                  disabled={saving}
                  className="w-full rounded-xl bg-[var(--color-paper)] px-4 py-4 font-medium text-[var(--color-ink)] disabled:opacity-50"
                >
                  {saving
                    ? "Saving…"
                    : editingProject
                      ? "Save changes"
                      : "Create project"}
                </button>

                {editingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setProject(emptyProject);
                    }}
                    className="w-full rounded-xl border border-white/10 px-4 py-4 text-sm"
                  >
                    Cancel editing
                  </button>
                )}
              </form>
            </section>

            <section className="space-y-3">
              {projects.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] text-[var(--color-accent)]">
                        {item.project_index} · {item.project_type}
                      </p>

                      <h3 className="mt-2 font-display text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm text-[var(--color-dim)]">
                        {item.summary}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                        item.published
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-white/10 text-[var(--color-dim)]"
                      }`}
                    >
                      {item.published ? "Live" : "Hidden"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => editProject(item)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleProject(item)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs"
                    >
                      {item.published ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={() => removeProject(item.id)}
                      className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}

              {!projects.length && (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-[var(--color-dim)]">
                  No projects found in portfolio_projects.
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "skills" && (
          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <section>
              <div className="mb-5">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--color-accent)]">
                  {editingSkill !== null ? "Edit skill" : "New skill"}
                </p>

                <h2 className="mt-2 font-display text-3xl">
                  {editingSkill !== null ? "Update skill" : "Add skill"}
                </h2>
              </div>

              <form onSubmit={saveSkill} className="space-y-3">
                <input
                  required
                  placeholder="Group key e.g. frontend"
                  value={skill.group_key}
                  onChange={(e) =>
                    setSkill({
                      ...skill,
                      group_key: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  required
                  placeholder="Group label e.g. Frontend"
                  value={skill.group_label}
                  onChange={(e) =>
                    setSkill({
                      ...skill,
                      group_label: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  required
                  placeholder="Skill name"
                  value={skill.skill_name}
                  onChange={(e) =>
                    setSkill({
                      ...skill,
                      skill_name: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  placeholder="Level / hint"
                  value={skill.level}
                  onChange={(e) =>
                    setSkill({
                      ...skill,
                      level: e.target.value,
                    })
                  }
                  className="admin-input"
                />

                <input
                  type="number"
                  placeholder="Sort order"
                  value={skill.sort_order}
                  onChange={(e) =>
                    setSkill({
                      ...skill,
                      sort_order: Number(e.target.value),
                    })
                  }
                  className="admin-input"
                />

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={skill.published}
                    onChange={(e) =>
                      setSkill({
                        ...skill,
                        published: e.target.checked,
                      })
                    }
                  />
                  Published on public site
                </label>

                <button
                  disabled={saving}
                  className="w-full rounded-xl bg-[var(--color-paper)] px-4 py-4 font-medium text-[var(--color-ink)] disabled:opacity-50"
                >
                  {saving
                    ? "Saving…"
                    : editingSkill !== null
                      ? "Save changes"
                      : "Create skill"}
                </button>

                {editingSkill !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSkill(null);
                      setSkill(emptySkill);
                    }}
                    className="w-full rounded-xl border border-white/10 px-4 py-4 text-sm"
                  >
                    Cancel editing
                  </button>
                )}
              </form>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              {skills.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
                        {item.group_label}
                      </p>

                      <h3 className="mt-2 text-lg font-medium">
                        {item.skill_name}
                      </h3>

                      <p className="mt-1 text-sm text-[var(--color-dim)]">
                        {item.level}
                      </p>
                    </div>

                    <span className="font-mono text-xs text-[var(--color-dim)]">
                      #{item.sort_order}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => editSkill(item)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => removeSkill(item.id)}
                      className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
DASHBOARD

cat > src/routes/admin.tsx <<'ADMIN_ROUTE'
import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});
ADMIN_ROUTE

cat > src/routes/admin.login.tsx <<'LOGIN_ROUTE'
import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/components/admin/admin-login";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});
LOGIN_ROUTE

cat >> src/styles.css <<'ADMIN_CSS'

.admin-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--color-paper) 10%, transparent);
  background: color-mix(in srgb, var(--color-paper) 3%, transparent);
  padding: 0.9rem 1rem;
  color: var(--color-paper);
  outline: none;
  transition:
    border-color 180ms ease,
    background 180ms ease;
}

.admin-input::placeholder {
  color: var(--color-dim);
}

.admin-input:focus {
  border-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-paper) 5%, transparent);
}
ADMIN_CSS

echo ""
echo "==> Regenerating TanStack route tree..."
npm run typecheck || true

echo ""
echo "=========================================="
echo " ADMIN CMS INSTALLED"
echo "=========================================="
echo ""
echo "Admin URL:"
echo "  http://localhost:8080/admin"
echo ""
echo "Login URL:"
echo "  http://localhost:8080/admin/login"
echo ""
echo "IMPORTANT:"
echo "The admin uses Supabase Auth + your existing"
echo "portfolio_projects / portfolio_skills tables."
echo ""
echo "If Supabase RLS blocks INSERT/UPDATE/DELETE,"
echo "apply the SQL policies for your admin user."
echo ""
echo "Run:"
echo "  npm run dev"
echo ""
