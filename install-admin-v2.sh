#!/usr/bin/env bash
set -e

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   PORTFOLIO ADMIN CMS v2                   ║"
echo "║   Clean replacement installer              ║"
echo "╚════════════════════════════════════════════╝"
echo ""

ROOT="$(pwd)"

# ------------------------------------------------------------
# Remove previous broken admin implementation
# ------------------------------------------------------------

echo "==> Removing previous admin implementation..."

rm -rf src/components/admin
rm -f src/routes/admin.tsx
rm -f src/routes/admin.login.tsx

# Remove previous admin CSS block if present.
python3 - <<'PY'
from pathlib import Path

p = Path("src/styles.css")
s = p.read_text()

marker = "/* ADMIN CMS V2 */"

if marker in s:
    s = s.split(marker)[0].rstrip() + "\n"

p.write_text(s)
PY

mkdir -p src/components/admin

# ------------------------------------------------------------
# Supabase admin configuration
# ------------------------------------------------------------

cat > src/lib/admin.ts <<'ADMIN'
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

export function getConfiguredAdminEmail() {
  return configuredAdminEmail;
}

export async function getCurrentUser() {
  const client = getSupabase();

  const { data, error } = await client.auth.getUser();

  if (error) {
    return null;
  }

  return data.user ?? null;
}

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user) return false;

  if (!configuredAdminEmail) {
    return false;
  }

  return user.email?.trim().toLowerCase() === configuredAdminEmail;
}

export async function signIn(email: string, password: string) {
  const client = getSupabase();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

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
ADMIN

# ------------------------------------------------------------
# Login
# ------------------------------------------------------------

cat > src/components/admin/admin-login.tsx <<'LOGIN'
import { useEffect, useState } from "react";
import { signIn, getCurrentUser } from "@/lib/admin";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function check() {
      try {
        /*
         * IMPORTANT:
         * Do NOT redirect automatically from /admin/login.
         *
         * This guarantees that visiting /admin/login actually
         * displays the login interface.
         */
        await getCurrentUser();
      } finally {
        if (alive) setChecking(false);
      }
    }

    check();

    return () => {
      alive = false;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);

      /*
       * Hard navigation avoids TanStack Router's generated
       * route-type/cache problems from the previous version.
       */
      window.location.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="admin-page admin-center">
        <div className="admin-loading">
          <span className="admin-dot" />
          Checking authentication…
        </div>
      </main>
    );
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
LOGIN

# ------------------------------------------------------------
# Dashboard
# ------------------------------------------------------------

cat > src/components/admin/admin-dashboard.tsx <<'DASH'
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  isAdmin,
  signOut,
  getProjects,
  insertProject,
  editProject,
  removeProject,
  getSkills,
  insertSkill,
  editSkill,
  removeSkill,
  type AdminProject,
  type AdminSkill,
} from "@/lib/admin";

const EMPTY_PROJECT = {
  project_index: "",
  title: "",
  project_type: "",
  category: "",
  href: "",
  external: true,
  summary: "",
  pattern: "grid",
  published: true,
};

const EMPTY_SKILL = {
  group_key: "frontend",
  group_label: "Frontend",
  skill_name: "",
  level: "",
  sort_order: 0,
  published: true,
};

export function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const [userEmail, setUserEmail] = useState("");

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [skills, setSkills] = useState<AdminSkill[]>([]);

  const [tab, setTab] = useState<"projects" | "skills">("projects");

  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [skillForm, setSkillForm] = useState(EMPTY_SKILL);

  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const [editingSkillId, setEditingSkillId] =
    useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function boot() {
    try {
      const user = await getCurrentUser();

      if (!user) {
        window.location.replace("/admin/login");
        return;
      }

      setUserEmail(user.email ?? "");

      const allowed = await isAdmin();

      if (!allowed) {
        setError(
          "This account is authenticated but is not authorized as an admin."
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

  useEffect(() => {
    boot();
  }, []);

  function notify(text: string) {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  async function saveProject(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (editingProjectId) {
        await editProject(editingProjectId, projectForm);
        notify("Project updated successfully.");
      } else {
        await insertProject(projectForm);
        notify("Project created successfully.");
      }

      setProjectForm(EMPTY_PROJECT);
      setEditingProjectId(null);

      const rows = await getProjects();
      setProjects(rows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  }

  function startProjectEdit(item: AdminProject) {
    setEditingProjectId(item.id);

    setProjectForm({
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteProject(id: string) {
    if (!window.confirm("Delete this project permanently?")) {
      return;
    }

    try {
      await removeProject(id);
      notify("Project deleted.");

      setProjects(await getProjects());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete project."
      );
    }
  }

  async function toggleProject(item: AdminProject) {
    try {
      await editProject(item.id, {
        published: !item.published,
      });

      notify(
        item.published
          ? "Project hidden from public site."
          : "Project published."
      );

      setProjects(await getProjects());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change publish state."
      );
    }
  }

  async function saveSkill(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (editingSkillId !== null) {
        await editSkill(editingSkillId, skillForm);
        notify("Skill updated successfully.");
      } else {
        await insertSkill(skillForm);
        notify("Skill created successfully.");
      }

      setSkillForm(EMPTY_SKILL);
      setEditingSkillId(null);

      setSkills(await getSkills());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save skill."
      );
    } finally {
      setSaving(false);
    }
  }

  function startSkillEdit(item: AdminSkill) {
    setEditingSkillId(item.id);

    setSkillForm({
      group_key: item.group_key,
      group_label: item.group_label,
      skill_name: item.skill_name,
      level: item.level,
      sort_order: item.sort_order,
      published: item.published,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteSkill(id: number) {
    if (!window.confirm("Delete this skill permanently?")) {
      return;
    }

    try {
      await removeSkill(id);
      notify("Skill deleted.");

      setSkills(await getSkills());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete skill."
      );
    }
  }

  async function logout() {
    await signOut();
    window.location.replace("/admin/login");
  }

  if (checking) {
    return (
      <main className="admin-page admin-center">
        <div className="admin-loading">
          <span className="admin-dot" />
          Loading control room…
        </div>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="admin-page admin-center">
        <section className="admin-denied">
          <div className="admin-eyebrow">
            ACCESS DENIED
          </div>

          <h1>Not authorized</h1>

          <p>
            {error ||
              "Your account does not have administrator access."}
          </p>

          <button
            onClick={logout}
            className="admin-primary-button"
          >
            SIGN OUT
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <div className="admin-eyebrow">
            PORTFOLIO CMS · CONTROL ROOM
          </div>

          <h1 className="admin-header-title">
            Manage Portfolio
          </h1>
        </div>

        <div className="admin-header-actions">
          <span className="admin-user">
            {userEmail}
          </span>

          <a href="/" className="admin-secondary-button">
            VIEW SITE
          </a>

          <button
            onClick={logout}
            className="admin-secondary-button"
          >
            SIGN OUT
          </button>
        </div>
      </header>

      <div className="admin-container">
        {message && (
          <div className="admin-success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-error admin-error-wide">
            {error}
          </div>
        )}

        <nav className="admin-tabs">
          <button
            className={
              tab === "projects"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => setTab("projects")}
          >
            PROJECTS
            <span>{projects.length}</span>
          </button>

          <button
            className={
              tab === "skills"
                ? "admin-tab active"
                : "admin-tab"
            }
            onClick={() => setTab("skills")}
          >
            SKILLS
            <span>{skills.length}</span>
          </button>
        </nav>

        {tab === "projects" && (
          <div className="admin-layout">
            <section className="admin-editor">
              <div className="admin-eyebrow">
                {editingProjectId
                  ? "EDIT PROJECT"
                  : "NEW PROJECT"}
              </div>

              <h2>
                {editingProjectId
                  ? "Update work"
                  : "Add work"}
              </h2>

              <form
                onSubmit={saveProject}
                className="admin-form"
              >
                <label>
                  <span>Title</span>
                  <input
                    required
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        title: e.target.value,
                      })
                    }
                  />
                </label>

                <div className="admin-two">
                  <label>
                    <span>Index</span>
                    <input
                      required
                      placeholder="01"
                      value={projectForm.project_index}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          project_index: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>Type / Year</span>
                    <input
                      required
                      value={projectForm.project_type}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          project_type: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <div className="admin-two">
                  <label>
                    <span>Category</span>
                    <input
                      required
                      value={projectForm.category}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          category: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    <span>Pattern</span>
                    <input
                      required
                      value={projectForm.pattern}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          pattern: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  <span>URL</span>
                  <input
                    required
                    type="url"
                    value={projectForm.href}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        href: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  <span>Summary</span>
                  <textarea
                    required
                    rows={5}
                    value={projectForm.summary}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        summary: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={projectForm.external}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        external: e.target.checked,
                      })
                    }
                  />
                  External project
                </label>

                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={projectForm.published}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        published: e.target.checked,
                      })
                    }
                  />
                  Published on public website
                </label>

                <button
                  disabled={saving}
                  className="admin-primary-button"
                >
                  {saving
                    ? "SAVING…"
                    : editingProjectId
                      ? "SAVE CHANGES"
                      : "CREATE PROJECT"}
                </button>

                {editingProjectId && (
                  <button
                    type="button"
                    className="admin-secondary-button full"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjectForm(EMPTY_PROJECT);
                    }}
                  >
                    CANCEL
                  </button>
                )}
              </form>
            </section>

            <section className="admin-list">
              {projects.map((item) => (
                <article
                  key={item.id}
                  className="admin-item"
                >
                  <div className="admin-item-main">
                    <div className="admin-index">
                      {item.project_index}
                    </div>

                    <div>
                      <h3>{item.title}</h3>

                      <p>
                        {item.project_type} ·{" "}
                        {item.category}
                      </p>

                      <small>{item.summary}</small>
                    </div>
                  </div>

                  <div className="admin-item-actions">
                    <span
                      className={
                        item.published
                          ? "admin-status live"
                          : "admin-status"
                      }
                    >
                      {item.published
                        ? "LIVE"
                        : "HIDDEN"}
                    </span>

                    <button
                      onClick={() =>
                        startProjectEdit(item)
                      }
                    >
                      EDIT
                    </button>

                    <button
                      onClick={() =>
                        toggleProject(item)
                      }
                    >
                      {item.published
                        ? "HIDE"
                        : "PUBLISH"}
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        deleteProject(item.id)
                      }
                    >
                      DELETE
                    </button>
                  </div>
                </article>
              ))}

              {!projects.length && (
                <div className="admin-empty">
                  No projects found.
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "skills" && (
          <div className="admin-layout">
            <section className="admin-editor">
              <div className="admin-eyebrow">
                {editingSkillId !== null
                  ? "EDIT SKILL"
                  : "NEW SKILL"}
              </div>

              <h2>
                {editingSkillId !== null
                  ? "Update skill"
                  : "Add skill"}
              </h2>

              <form
                onSubmit={saveSkill}
                className="admin-form"
              >
                <label>
                  <span>Group key</span>
                  <input
                    required
                    placeholder="frontend"
                    value={skillForm.group_key}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        group_key: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  <span>Group label</span>
                  <input
                    required
                    placeholder="Frontend"
                    value={skillForm.group_label}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        group_label: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  <span>Skill</span>
                  <input
                    required
                    placeholder="React"
                    value={skillForm.skill_name}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        skill_name: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  <span>Level / Hint</span>
                  <input
                    placeholder="Advanced"
                    value={skillForm.level}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        level: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  <span>Sort order</span>
                  <input
                    type="number"
                    value={skillForm.sort_order}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        sort_order: Number(
                          e.target.value
                        ),
                      })
                    }
                  />
                </label>

                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={skillForm.published}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        published: e.target.checked,
                      })
                    }
                  />
                  Published
                </label>

                <button
                  disabled={saving}
                  className="admin-primary-button"
                >
                  {saving
                    ? "SAVING…"
                    : editingSkillId !== null
                      ? "SAVE CHANGES"
                      : "CREATE SKILL"}
                </button>

                {editingSkillId !== null && (
                  <button
                    type="button"
                    className="admin-secondary-button full"
                    onClick={() => {
                      setEditingSkillId(null);
                      setSkillForm(EMPTY_SKILL);
                    }}
                  >
                    CANCEL
                  </button>
                )}
              </form>
            </section>

            <section className="admin-list">
              {skills.map((item) => (
                <article
                  key={item.id}
                  className="admin-item"
                >
                  <div className="admin-item-main">
                    <div className="admin-index">
                      {String(item.sort_order).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div>
                      <h3>{item.skill_name}</h3>

                      <p>{item.group_label}</p>

                      <small>{item.level}</small>
                    </div>
                  </div>

                  <div className="admin-item-actions">
                    <button
                      onClick={() =>
                        startSkillEdit(item)
                      }
                    >
                      EDIT
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        deleteSkill(item.id)
                      }
                    >
                      DELETE
                    </button>
                  </div>
                </article>
              ))}

              {!skills.length && (
                <div className="admin-empty">
                  No skills found.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
DASH

# ------------------------------------------------------------
# Routes
# ------------------------------------------------------------

cat > src/routes/admin.tsx <<'ROUTE'
import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});
ROUTE

cat > src/routes/admin.login.tsx <<'ROUTE_LOGIN'
import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/components/admin/admin-login";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});
ROUTE_LOGIN

# ------------------------------------------------------------
# CSS
# ------------------------------------------------------------

cat >> src/styles.css <<'CSS'

/* ADMIN CMS V2 */

.admin-page {
  min-height: 100vh;
  background: var(--color-ink);
  color: var(--color-paper);
  font-family: var(--font-sans);
}

.admin-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.admin-login-card {
  width: min(100%, 430px);
  padding: 42px;
  border: 1px solid color-mix(in srgb, var(--color-paper) 10%, transparent);
  border-radius: 24px;
  background: color-mix(in srgb, var(--color-paper) 3%, transparent);
  box-shadow:
    0 30px 100px rgba(0, 0, 0, .28),
    inset 0 1px 0 rgba(255, 255, 255, .03);
}

.admin-eyebrow {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .22em;
  line-height: 1.5;
  text-transform: uppercase;
}

.admin-login-title {
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 5rem);
  line-height: .9;
  font-weight: 400;
}

.admin-login-description {
  margin-top: 18px;
}

.admin-muted {
  color: var(--color-dim);
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
}

.admin-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-form label > span {
  color: var(--color-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.admin-form input,
.admin-form textarea {
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--color-paper) 10%, transparent);
  border-radius: 11px;
  background: rgba(255,255,255,.025);
  color: var(--color-paper);
  padding: 13px 14px;
  outline: none;
  transition: border-color .18s ease, background .18s ease;
  font: inherit;
}

.admin-form textarea {
  resize: vertical;
}

.admin-form input:focus,
.admin-form textarea:focus {
  border-color: var(--color-accent);
  background: rgba(255,255,255,.045);
}

.admin-form input::placeholder,
.admin-form textarea::placeholder {
  color: var(--color-dim);
}

.admin-primary-button,
.admin-secondary-button {
  min-height: 42px;
  border-radius: 10px;
  padding: 11px 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .13em;
  cursor: pointer;
  transition: opacity .18s ease, transform .18s ease, background .18s ease;
}

.admin-primary-button {
  border: 1px solid var(--color-paper);
  background: var(--color-paper);
  color: var(--color-ink);
}

.admin-primary-button:hover {
  transform: translateY(-1px);
}

.admin-primary-button:disabled {
  opacity: .5;
  cursor: wait;
}

.admin-secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--color-paper) 12%, transparent);
  background: transparent;
  color: var(--color-paper);
  text-decoration: none;
}

.admin-secondary-button:hover {
  background: rgba(255,255,255,.05);
}

.admin-secondary-button.full {
  width: 100%;
}

.admin-error {
  border: 1px solid rgba(248,113,113,.2);
  border-radius: 10px;
  background: rgba(248,113,113,.07);
  color: #fecaca;
  padding: 12px 14px;
  font-size: 13px;
}

.admin-error-wide,
.admin-success {
  margin-bottom: 20px;
}

.admin-success {
  border: 1px solid rgba(52,211,153,.2);
  border-radius: 10px;
  background: rgba(52,211,153,.07);
  color: #a7f3d0;
  padding: 12px 14px;
  font-size: 13px;
}

.admin-back {
  display: block;
  margin-top: 26px;
  color: var(--color-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .14em;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
}

.admin-back:hover {
  color: var(--color-paper);
}

.admin-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-dim);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.admin-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: admin-pulse 1s ease-in-out infinite alternate;
}

@keyframes admin-pulse {
  from { opacity: .3; transform: scale(.7); }
  to { opacity: 1; transform: scale(1); }
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px clamp(20px, 4vw, 56px);
  border-bottom: 1px solid color-mix(in srgb, var(--color-paper) 9%, transparent);
  background: color-mix(in srgb, var(--color-ink) 94%, transparent);
  backdrop-filter: blur(18px);
}

.admin-header-title {
  margin-top: 5px;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 400;
  line-height: 1;
}

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.admin-user {
  max-width: 220px;
  overflow: hidden;
  color: var(--color-dim);
  font-family: var(--font-mono);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-container {
  width: min(1500px, calc(100% - 40px));
  margin: 0 auto;
  padding: 35px 0 80px;
}

.admin-tabs {
  display: flex;
  gap: 3px;
  margin-bottom: 28px;
  border-bottom: 1px solid color-mix(in srgb, var(--color-paper) 8%, transparent);
}

.admin-tab {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 0;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: var(--color-dim);
  padding: 13px 14px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .14em;
  cursor: pointer;
}

.admin-tab span {
  opacity: .55;
}

.admin-tab.active {
  border-bottom-color: var(--color-accent);
  color: var(--color-paper);
}

.admin-layout {
  display: grid;
  grid-template-columns: minmax(280px, 420px) minmax(0, 1fr);
  gap: 30px;
  align-items: start;
}

.admin-editor {
  position: sticky;
  top: 115px;
  border: 1px solid color-mix(in srgb, var(--color-paper) 9%, transparent);
  border-radius: 20px;
  background: rgba(255,255,255,.018);
  padding: 24px;
}

.admin-editor h2 {
  margin-top: 8px;
  margin-bottom: 5px;
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
}

.admin-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.admin-check {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  gap: 9px !important;
  color: var(--color-dim);
  font-size: 13px;
}

.admin-check input {
  width: auto;
}

.admin-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid color-mix(in srgb, var(--color-paper) 8%, transparent);
  border-radius: 16px;
  background: rgba(255,255,255,.018);
  padding: 19px;
}

.admin-item-main {
  display: flex;
  gap: 15px;
  min-width: 0;
}

.admin-index {
  flex: 0 0 auto;
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 10px;
  padding-top: 5px;
}

.admin-item h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1;
}

.admin-item p {
  margin-top: 5px;
  color: var(--color-dim);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.admin-item small {
  display: block;
  max-width: 650px;
  margin-top: 10px;
  color: var(--color-dim);
  font-size: 12px;
  line-height: 1.5;
}

.admin-item-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;
}

.admin-item-actions button {
  border: 1px solid color-mix(in srgb, var(--color-paper) 10%, transparent);
  border-radius: 8px;
  background: transparent;
  color: var(--color-paper);
  padding: 8px 10px;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: .1em;
  cursor: pointer;
}

.admin-item-actions button:hover {
  background: rgba(255,255,255,.05);
}

.admin-item-actions .danger {
  border-color: rgba(248,113,113,.18);
  color: #fca5a5;
}

.admin-status {
  display: inline-flex;
  align-items: center;
  height: 28px;
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  color: var(--color-dim);
  padding: 0 9px;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: .1em;
}

.admin-status.live {
  background: rgba(52,211,153,.08);
  color: #86efac;
}

.admin-empty,
.admin-denied {
  border: 1px dashed color-mix(in srgb, var(--color-paper) 12%, transparent);
  border-radius: 18px;
  color: var(--color-dim);
  padding: 40px;
  text-align: center;
}

.admin-denied {
  width: min(100%, 480px);
}

.admin-denied h1 {
  margin: 10px 0;
  color: var(--color-paper);
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 400;
}

.admin-denied p {
  margin-bottom: 20px;
  font-size: 13px;
}

@media (max-width: 900px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-editor {
    position: static;
  }

  .admin-item {
    flex-direction: column;
  }

  .admin-item-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .admin-login-card {
    padding: 28px 20px;
  }

  .admin-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-header-actions {
    justify-content: flex-start;
  }

  .admin-container {
    width: min(100% - 24px, 1500px);
  }

  .admin-two {
    grid-template-columns: 1fr;
  }

  .admin-item-main {
    width: 100%;
  }
}
CSS

# ------------------------------------------------------------
# Admin SQL / RLS
# ------------------------------------------------------------

cat > supabase-admin.sql <<'SQL'
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
SQL

# ------------------------------------------------------------
# Local env helper
# ------------------------------------------------------------

if [ -f ".env.local" ]; then
  if ! grep -q '^VITE_ADMIN_EMAIL=' .env.local; then
    printf '\nVITE_ADMIN_EMAIL=\n' >> .env.local
  fi
else
  touch .env.local
  printf 'VITE_ADMIN_EMAIL=\n' >> .env.local
fi

# ------------------------------------------------------------
# Regenerate route tree
# ------------------------------------------------------------

echo ""
echo "==> Generating TanStack route tree..."

if [ -x "./node_modules/.bin/tsr" ]; then
  ./node_modules/.bin/tsr generate
elif [ -x "./node_modules/.bin/tanstack-router" ]; then
  ./node_modules/.bin/tanstack-router generate
else
  npx --yes @tanstack/router-cli generate
fi

# ------------------------------------------------------------
# Typecheck
# ------------------------------------------------------------

echo ""
echo "==> Running typecheck..."

if ! npm run typecheck; then
  echo ""
  echo "Typecheck failed."
  echo "The admin files were installed, but TypeScript needs attention."
  exit 1
fi

# ------------------------------------------------------------
# Build
# ------------------------------------------------------------

echo ""
echo "==> Running production build..."

if ! npm run build; then
  echo ""
  echo "Build failed."
  echo "The implementation was installed, but the project build needs attention."
  exit 1
fi

# ------------------------------------------------------------
# Done
# ------------------------------------------------------------

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║       ADMIN CMS V2 INSTALLED ✓             ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "LOCAL LOGIN:"
echo "  http://localhost:8080/admin/login"
echo ""
echo "DASHBOARD:"
echo "  http://localhost:8080/admin"
echo ""
echo "FILES:"
echo "  src/components/admin/"
echo "  src/lib/admin.ts"
echo "  src/routes/admin.tsx"
echo "  src/routes/admin.login.tsx"
echo "  supabase-admin.sql"
echo ""
echo "NEXT:"
echo "  1. Create your admin user in Supabase Auth."
echo "  2. Put that exact email in .env.local:"
echo ""
echo "       VITE_ADMIN_EMAIL=your-email@example.com"
echo ""
echo "  3. Replace YOUR_ADMIN_EMAIL_HERE in"
echo "     supabase-admin.sql with the same email."
echo ""
echo "  4. Run supabase-admin.sql in Supabase SQL Editor."
echo ""
echo "  5. Restart:"
echo ""
echo "       npm run dev"
echo ""
