import { useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/admin-login";
import {
  getSession,
  isAdminEmail,
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

/*
 * Supabase persists its own session under `sb-<ref>-auth-token`.
 * Its presence is only a render hint: a logged-out visitor has no key,
 * so the login form renders immediately with no loading gate. Real
 * authorization still happens in boot() via getSession() + email check.
 */
function hasPersistedSession() {
  if (typeof window === "undefined") return false;

  try {
    return Object.keys(window.localStorage).some((key) =>
      /^sb-.+-auth-token$/.test(key)
    );
  } catch {
    return false;
  }
}

export function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(hasPersistedSession);

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
      const session = await getSession();

      if (!session) {
        setChecking(false);
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
        setError("");
        setChecking(false);
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

  if (checking) { return (<main className="admin-page admin-center"><div className="admin-loading"><span className="admin-dot" />Loading control room…</div></main>); }

  if (!authorized) {
    if (!userEmail && !error) {
      return <AdminLogin />;
    }

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
