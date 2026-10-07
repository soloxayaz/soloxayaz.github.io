import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  editProject,
  editSkill,
  getProjects,
  getSkills,
  insertProject,
  insertSkill,
  removeProject,
  removeSkill,
  signOut,
  type AdminProject,
  type AdminSkill,
} from "@/lib/admin";
import { errorMessage } from "@/lib/admin-auth";

type ProjectForm = Omit<AdminProject, "id">;
type SkillForm = Omit<AdminSkill, "id">;
type Notice = { kind: "ok" | "err"; text: string };
type Notify = (kind: Notice["kind"], text: string) => void;

const EMPTY_PROJECT: ProjectForm = {
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

const EMPTY_SKILL: SkillForm = {
  group_key: "frontend",
  group_label: "Frontend",
  skill_name: "",
  level: "",
  sort_order: 0,
  published: true,
};

const sortProjects = (rows: AdminProject[]) =>
  [...rows].sort((a, b) =>
    a.project_index.localeCompare(b.project_index, undefined, { numeric: true }),
  );

const sortSkills = (rows: AdminSkill[]) =>
  [...rows].sort(
    (a, b) => a.sort_order - b.sort_order || a.skill_name.localeCompare(b.skill_name),
  );

export function AdminPanel({ email }: { email: string }) {
  const [tab, setTab] = useState<"projects" | "skills">("projects");
  const [projects, setProjects] = useState<AdminProject[] | null>(null);
  const [skills, setSkills] = useState<AdminSkill[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    setLoadError("");

    try {
      const [projectRows, skillRows] = await Promise.all([
        getProjects(),
        getSkills(),
      ]);

      if (!mounted.current) return;

      setProjects(sortProjects(projectRows));
      setSkills(sortSkills(skillRows));
    } catch (err) {
      if (!mounted.current) return;

      setLoadError(errorMessage(err, "Unable to load portfolio data."));
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void load();

    return () => {
      mounted.current = false;
    };
  }, [load]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(null), 4000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const notify: Notify = useCallback((kind, text) => {
    setNotice({ kind, text });
  }, []);

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <div className="admin-eyebrow">PORTFOLIO CMS · CONTROL ROOM</div>

          <h1 className="admin-header-title">Manage Portfolio</h1>
        </div>

        <div className="admin-header-actions">
          <span className="admin-user">{email}</span>

          <a href="/" className="admin-secondary-button">
            VIEW SITE
          </a>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => {
              void signOut().catch((err) =>
                notify("err", errorMessage(err, "Unable to sign out.")),
              );
            }}
          >
            SIGN OUT
          </button>
        </div>
      </header>

      <div className="admin-container">
        {notice && (
          <div
            className={
              notice.kind === "ok"
                ? "admin-success"
                : "admin-error admin-error-wide"
            }
          >
            {notice.text}
          </div>
        )}

        {loadError && (
          <div className="admin-error admin-error-wide">
            {loadError}{" "}
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => void load()}
            >
              RETRY
            </button>
          </div>
        )}

        <nav className="admin-tabs">
          <button
            type="button"
            className={tab === "projects" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("projects")}
          >
            PROJECTS
            <span>{projects?.length ?? "…"}</span>
          </button>

          <button
            type="button"
            className={tab === "skills" ? "admin-tab active" : "admin-tab"}
            onClick={() => setTab("skills")}
          >
            SKILLS
            <span>{skills?.length ?? "…"}</span>
          </button>
        </nav>

        {tab === "projects" ? (
          <ProjectsTab
            rows={projects}
            setRows={(rows) => setProjects(sortProjects(rows))}
            notify={notify}
          />
        ) : (
          <SkillsTab
            rows={skills}
            setRows={(rows) => setSkills(sortSkills(rows))}
            notify={notify}
          />
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

type ProjectsTabProps = {
  rows: AdminProject[] | null;
  setRows: (rows: AdminProject[]) => void;
  notify: Notify;
};

function ProjectsTab({ rows, setRows, notify }: ProjectsTabProps) {
  const [form, setForm] = useState<ProjectForm>(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = rows ?? [];

  function set<K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function reset() {
    setForm(EMPTY_PROJECT);
    setEditingId(null);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const payload: ProjectForm = {
      ...form,
      project_index: form.project_index.trim(),
      title: form.title.trim(),
      project_type: form.project_type.trim(),
      category: form.category.trim(),
      href: form.href.trim(),
      summary: form.summary.trim(),
      pattern: form.pattern.trim(),
    };

    setSaving(true);

    try {
      if (editingId) {
        const saved = await editProject(editingId, payload);
        setRows(list.map((row) => (row.id === saved.id ? saved : row)));
        notify("ok", "Project updated.");
      } else {
        const saved = await insertProject(payload);
        setRows([...list, saved]);
        notify("ok", "Project created.");
      }

      reset();
    } catch (err) {
      notify("err", errorMessage(err, "Unable to save project."));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: AdminProject) {
    setEditingId(item.id);
    setForm({
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

  async function toggle(item: AdminProject) {
    if (busyId) return;

    setBusyId(item.id);

    try {
      const saved = await editProject(item.id, { published: !item.published });
      setRows(list.map((row) => (row.id === saved.id ? saved : row)));
      notify("ok", saved.published ? "Project published." : "Project hidden.");
    } catch (err) {
      notify("err", errorMessage(err, "Unable to change publish state."));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: AdminProject) {
    if (busyId) return;

    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;

    setBusyId(item.id);

    try {
      await removeProject(item.id);

      // A blocked delete returns no error, so confirm against the database.
      const fresh = await getProjects();

      if (fresh.some((row) => row.id === item.id)) {
        notify(
          "err",
          "The database did not delete this project. Check the admin row level security policy.",
        );
        setRows(fresh);
        return;
      }

      setRows(fresh);

      if (editingId === item.id) reset();

      notify("ok", "Project deleted.");
    } catch (err) {
      notify("err", errorMessage(err, "Unable to delete project."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-layout">
      <section className="admin-editor">
        <div className="admin-eyebrow">
          {editingId ? "EDIT PROJECT" : "NEW PROJECT"}
        </div>

        <h2>{editingId ? "Update work" : "Add work"}</h2>

        <form onSubmit={save} className="admin-form">
          <label>
            <span>Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>

          <div className="admin-two">
            <label>
              <span>Index</span>
              <input
                required
                placeholder="01"
                value={form.project_index}
                onChange={(e) => set("project_index", e.target.value)}
              />
            </label>

            <label>
              <span>Type / Year</span>
              <input
                required
                value={form.project_type}
                onChange={(e) => set("project_type", e.target.value)}
              />
            </label>
          </div>

          <div className="admin-two">
            <label>
              <span>Category</span>
              <input
                required
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              />
            </label>

            <label>
              <span>Pattern</span>
              <input
                required
                value={form.pattern}
                onChange={(e) => set("pattern", e.target.value)}
              />
            </label>
          </div>

          <label>
            <span>URL</span>
            <input
              required
              type="url"
              value={form.href}
              onChange={(e) => set("href", e.target.value)}
            />
          </label>

          <label>
            <span>Summary</span>
            <textarea
              required
              rows={5}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </label>

          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.external}
              onChange={(e) => set("external", e.target.checked)}
            />
            External project
          </label>

          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published on public website
          </label>

          <button
            type="submit"
            disabled={saving}
            className="admin-primary-button"
          >
            {saving
              ? "SAVING…"
              : editingId
                ? "SAVE CHANGES"
                : "CREATE PROJECT"}
          </button>

          {editingId && (
            <button
              type="button"
              className="admin-secondary-button full"
              onClick={reset}
            >
              CANCEL
            </button>
          )}
        </form>
      </section>

      <section className="admin-list">
        {rows === null && <div className="admin-empty">Loading projects…</div>}

        {list.map((item) => (
          <article key={item.id} className="admin-item">
            <div className="admin-item-main">
              <div className="admin-index">{item.project_index}</div>

              <div>
                <h3>{item.title}</h3>

                <p>
                  {item.project_type} · {item.category}
                </p>

                <small>{item.summary}</small>
              </div>
            </div>

            <div className="admin-item-actions">
              <span
                className={item.published ? "admin-status live" : "admin-status"}
              >
                {item.published ? "LIVE" : "HIDDEN"}
              </span>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => startEdit(item)}
              >
                EDIT
              </button>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => void toggle(item)}
              >
                {item.published ? "HIDE" : "PUBLISH"}
              </button>

              <button
                type="button"
                className="danger"
                disabled={busyId !== null}
                onClick={() => void remove(item)}
              >
                DELETE
              </button>
            </div>
          </article>
        ))}

        {rows !== null && !list.length && (
          <div className="admin-empty">No projects found.</div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

type SkillsTabProps = {
  rows: AdminSkill[] | null;
  setRows: (rows: AdminSkill[]) => void;
  notify: Notify;
};

function SkillsTab({ rows, setRows, notify }: SkillsTabProps) {
  const [form, setForm] = useState<SkillForm>(EMPTY_SKILL);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const list = rows ?? [];

  const groups = Array.from(
    new Map(list.map((row) => [row.group_key, row.group_label])).entries(),
  );

  function set<K extends keyof SkillForm>(key: K, value: SkillForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setGroupKey(value: string) {
    const known = groups.find(([key]) => key === value);

    setForm((current) => ({
      ...current,
      group_key: value,
      group_label: known ? known[1] : current.group_label,
    }));
  }

  function reset() {
    setForm(EMPTY_SKILL);
    setEditingId(null);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const sortOrder = Number(form.sort_order);

    const payload: SkillForm = {
      ...form,
      group_key: form.group_key.trim(),
      group_label: form.group_label.trim(),
      skill_name: form.skill_name.trim(),
      level: form.level.trim(),
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        const saved = await editSkill(editingId, payload);
        setRows(list.map((row) => (row.id === saved.id ? saved : row)));
        notify("ok", "Skill updated.");
      } else {
        const saved = await insertSkill(payload);
        setRows([...list, saved]);
        notify("ok", "Skill created.");
      }

      reset();
    } catch (err) {
      notify("err", errorMessage(err, "Unable to save skill."));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: AdminSkill) {
    setEditingId(item.id);
    setForm({
      group_key: item.group_key,
      group_label: item.group_label,
      skill_name: item.skill_name,
      level: item.level,
      sort_order: item.sort_order,
      published: item.published,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggle(item: AdminSkill) {
    if (busyId !== null) return;

    setBusyId(item.id);

    try {
      const saved = await editSkill(item.id, { published: !item.published });
      setRows(list.map((row) => (row.id === saved.id ? saved : row)));
      notify("ok", saved.published ? "Skill published." : "Skill hidden.");
    } catch (err) {
      notify("err", errorMessage(err, "Unable to change publish state."));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: AdminSkill) {
    if (busyId !== null) return;

    if (!window.confirm(`Delete "${item.skill_name}" permanently?`)) return;

    setBusyId(item.id);

    try {
      await removeSkill(item.id);

      // A blocked delete returns no error, so confirm against the database.
      const fresh = await getSkills();

      if (fresh.some((row) => row.id === item.id)) {
        notify(
          "err",
          "The database did not delete this skill. Check the admin row level security policy.",
        );
        setRows(fresh);
        return;
      }

      setRows(fresh);

      if (editingId === item.id) reset();

      notify("ok", "Skill deleted.");
    } catch (err) {
      notify("err", errorMessage(err, "Unable to delete skill."));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-layout">
      <section className="admin-editor">
        <div className="admin-eyebrow">
          {editingId !== null ? "EDIT SKILL" : "NEW SKILL"}
        </div>

        <h2>{editingId !== null ? "Update skill" : "Add skill"}</h2>

        <form onSubmit={save} className="admin-form">
          <div className="admin-two">
            <label>
              <span>Group key</span>
              <input
                required
                list="admin-skill-groups"
                value={form.group_key}
                onChange={(e) => setGroupKey(e.target.value)}
              />
            </label>

            <label>
              <span>Group label</span>
              <input
                required
                value={form.group_label}
                onChange={(e) => set("group_label", e.target.value)}
              />
            </label>
          </div>

          <datalist id="admin-skill-groups">
            {groups.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </datalist>

          <label>
            <span>Skill name</span>
            <input
              required
              value={form.skill_name}
              onChange={(e) => set("skill_name", e.target.value)}
            />
          </label>

          <div className="admin-two">
            <label>
              <span>Level</span>
              <input
                required
                value={form.level}
                onChange={(e) => set("level", e.target.value)}
              />
            </label>

            <label>
              <span>Sort order</span>
              <input
                required
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value))}
              />
            </label>
          </div>

          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published on public website
          </label>

          <button
            type="submit"
            disabled={saving}
            className="admin-primary-button"
          >
            {saving
              ? "SAVING…"
              : editingId !== null
                ? "SAVE CHANGES"
                : "CREATE SKILL"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="admin-secondary-button full"
              onClick={reset}
            >
              CANCEL
            </button>
          )}
        </form>
      </section>

      <section className="admin-list">
        {rows === null && <div className="admin-empty">Loading skills…</div>}

        {list.map((item) => (
          <article key={item.id} className="admin-item">
            <div className="admin-item-main">
              <div className="admin-index">{item.sort_order}</div>

              <div>
                <h3>{item.skill_name}</h3>

                <p>{item.group_label}</p>

                <small>{item.level}</small>
              </div>
            </div>

            <div className="admin-item-actions">
              <span
                className={item.published ? "admin-status live" : "admin-status"}
              >
                {item.published ? "LIVE" : "HIDDEN"}
              </span>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => startEdit(item)}
              >
                EDIT
              </button>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => void toggle(item)}
              >
                {item.published ? "HIDE" : "PUBLISH"}
              </button>

              <button
                type="button"
                className="danger"
                disabled={busyId !== null}
                onClick={() => void remove(item)}
              >
                DELETE
              </button>
            </div>
          </article>
        ))}

        {rows !== null && !list.length && (
          <div className="admin-empty">No skills found.</div>
        )}
      </section>
    </div>
  );
}
