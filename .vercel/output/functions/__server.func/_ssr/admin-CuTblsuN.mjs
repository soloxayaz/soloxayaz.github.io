import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B1UUYl23.mjs";
import { a as errorMessage, c as insertProject, d as removeSkill, f as resolvePhase, i as editSkill, l as insertSkill, m as signOut, n as AdminLogin, o as getProjects, p as samePhase, r as editProject, s as getSkills, t as ADMIN_EMAIL, u as removeProject } from "./admin-login-BSAfL0BO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CuTblsuN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_PROJECT = {
	project_index: "",
	title: "",
	project_type: "",
	category: "",
	href: "",
	external: true,
	summary: "",
	pattern: "grid",
	published: true
};
var EMPTY_SKILL = {
	group_key: "frontend",
	group_label: "Frontend",
	skill_name: "",
	level: "",
	sort_order: 0,
	published: true
};
var sortProjects = (rows) => [...rows].sort((a, b) => a.project_index.localeCompare(b.project_index, void 0, { numeric: true }));
var sortSkills = (rows) => [...rows].sort((a, b) => a.sort_order - b.sort_order || a.skill_name.localeCompare(b.skill_name));
function AdminPanel({ email }) {
	const [tab, setTab] = (0, import_react.useState)("projects");
	const [projects, setProjects] = (0, import_react.useState)(null);
	const [skills, setSkills] = (0, import_react.useState)(null);
	const [loadError, setLoadError] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)(null);
	const mounted = (0, import_react.useRef)(true);
	const load = (0, import_react.useCallback)(async () => {
		setLoadError("");
		try {
			const [projectRows, skillRows] = await Promise.all([getProjects(), getSkills()]);
			if (!mounted.current) return;
			setProjects(sortProjects(projectRows));
			setSkills(sortSkills(skillRows));
		} catch (err) {
			if (!mounted.current) return;
			setLoadError(errorMessage(err, "Unable to load portfolio data."));
		}
	}, []);
	(0, import_react.useEffect)(() => {
		mounted.current = true;
		load();
		return () => {
			mounted.current = false;
		};
	}, [load]);
	(0, import_react.useEffect)(() => {
		if (!notice) return;
		const timer = window.setTimeout(() => setNotice(null), 4e3);
		return () => window.clearTimeout(timer);
	}, [notice]);
	const notify = (0, import_react.useCallback)((kind, text) => {
		setNotice({
			kind,
			text
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "admin-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "admin-eyebrow",
				children: "PORTFOLIO CMS · CONTROL ROOM"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "admin-header-title",
				children: "Manage Portfolio"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "admin-header-actions",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "admin-user",
						children: email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "admin-secondary-button",
						children: "VIEW SITE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "admin-secondary-button",
						onClick: () => {
							signOut().catch((err) => notify("err", errorMessage(err, "Unable to sign out.")));
						},
						children: "SIGN OUT"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-container",
			children: [
				notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: notice.kind === "ok" ? "admin-success" : "admin-error admin-error-wide",
					children: notice.text
				}),
				loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-error admin-error-wide",
					children: [
						loadError,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "admin-secondary-button",
							onClick: () => void load(),
							children: "RETRY"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "admin-tabs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: tab === "projects" ? "admin-tab active" : "admin-tab",
						onClick: () => setTab("projects"),
						children: ["PROJECTS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: projects?.length ?? "…" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: tab === "skills" ? "admin-tab active" : "admin-tab",
						onClick: () => setTab("skills"),
						children: ["SKILLS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: skills?.length ?? "…" })]
					})]
				}),
				tab === "projects" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsTab, {
					rows: projects,
					setRows: (rows) => setProjects(sortProjects(rows)),
					notify
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillsTab, {
					rows: skills,
					setRows: (rows) => setSkills(sortSkills(rows)),
					notify
				})
			]
		})]
	});
}
function ProjectsTab({ rows, setRows, notify }) {
	const [form, setForm] = (0, import_react.useState)(EMPTY_PROJECT);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const list = rows ?? [];
	function set(key, value) {
		setForm((current) => ({
			...current,
			[key]: value
		}));
	}
	function reset() {
		setForm(EMPTY_PROJECT);
		setEditingId(null);
	}
	async function save(event) {
		event.preventDefault();
		if (saving) return;
		const payload = {
			...form,
			project_index: form.project_index.trim(),
			title: form.title.trim(),
			project_type: form.project_type.trim(),
			category: form.category.trim(),
			href: form.href.trim(),
			summary: form.summary.trim(),
			pattern: form.pattern.trim()
		};
		setSaving(true);
		try {
			if (editingId) {
				const saved = await editProject(editingId, payload);
				setRows(list.map((row) => row.id === saved.id ? saved : row));
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
	function startEdit(item) {
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
			published: item.published
		});
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	async function toggle(item) {
		if (busyId) return;
		setBusyId(item.id);
		try {
			const saved = await editProject(item.id, { published: !item.published });
			setRows(list.map((row) => row.id === saved.id ? saved : row));
			notify("ok", saved.published ? "Project published." : "Project hidden.");
		} catch (err) {
			notify("err", errorMessage(err, "Unable to change publish state."));
		} finally {
			setBusyId(null);
		}
	}
	async function remove(item) {
		if (busyId) return;
		if (!window.confirm(`Delete "${item.title}" permanently?`)) return;
		setBusyId(item.id);
		try {
			await removeProject(item.id);
			const fresh = await getProjects();
			if (fresh.some((row) => row.id === item.id)) {
				notify("err", "The database did not delete this project. Check the admin row level security policy.");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-layout",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-editor",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-eyebrow",
					children: editingId ? "EDIT PROJECT" : "NEW PROJECT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: editingId ? "Update work" : "Add work" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: save,
					className: "admin-form",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: form.title,
							onChange: (e) => set("title", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-two",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Index" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								placeholder: "01",
								value: form.project_index,
								onChange: (e) => set("project_index", e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type / Year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.project_type,
								onChange: (e) => set("project_type", e.target.value)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-two",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.category,
								onChange: (e) => set("category", e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pattern" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.pattern,
								onChange: (e) => set("pattern", e.target.value)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "url",
							value: form.href,
							onChange: (e) => set("href", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							rows: 5,
							value: form.summary,
							onChange: (e) => set("summary", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-check",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.external,
								onChange: (e) => set("external", e.target.checked)
							}), "External project"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-check",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.published,
								onChange: (e) => set("published", e.target.checked)
							}), "Published on public website"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: saving,
							className: "admin-primary-button",
							children: saving ? "SAVING…" : editingId ? "SAVE CHANGES" : "CREATE PROJECT"
						}),
						editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "admin-secondary-button full",
							onClick: reset,
							children: "CANCEL"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-list",
			children: [
				rows === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-empty",
					children: "Loading projects…"
				}),
				list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "admin-item",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "admin-item-main",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-index",
							children: item.project_index
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								item.project_type,
								" · ",
								item.category
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.summary })
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "admin-item-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: item.published ? "admin-status live" : "admin-status",
								children: item.published ? "LIVE" : "HIDDEN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busyId !== null,
								onClick: () => startEdit(item),
								children: "EDIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busyId !== null,
								onClick: () => void toggle(item),
								children: item.published ? "HIDE" : "PUBLISH"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "danger",
								disabled: busyId !== null,
								onClick: () => void remove(item),
								children: "DELETE"
							})
						]
					})]
				}, item.id)),
				rows !== null && !list.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-empty",
					children: "No projects found."
				})
			]
		})]
	});
}
function SkillsTab({ rows, setRows, notify }) {
	const [form, setForm] = (0, import_react.useState)(EMPTY_SKILL);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const list = rows ?? [];
	const groups = Array.from(new Map(list.map((row) => [row.group_key, row.group_label])).entries());
	function set(key, value) {
		setForm((current) => ({
			...current,
			[key]: value
		}));
	}
	function setGroupKey(value) {
		const known = groups.find(([key]) => key === value);
		setForm((current) => ({
			...current,
			group_key: value,
			group_label: known ? known[1] : current.group_label
		}));
	}
	function reset() {
		setForm(EMPTY_SKILL);
		setEditingId(null);
	}
	async function save(event) {
		event.preventDefault();
		if (saving) return;
		const sortOrder = Number(form.sort_order);
		const payload = {
			...form,
			group_key: form.group_key.trim(),
			group_label: form.group_label.trim(),
			skill_name: form.skill_name.trim(),
			level: form.level.trim(),
			sort_order: Number.isFinite(sortOrder) ? sortOrder : 0
		};
		setSaving(true);
		try {
			if (editingId !== null) {
				const saved = await editSkill(editingId, payload);
				setRows(list.map((row) => row.id === saved.id ? saved : row));
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
	function startEdit(item) {
		setEditingId(item.id);
		setForm({
			group_key: item.group_key,
			group_label: item.group_label,
			skill_name: item.skill_name,
			level: item.level,
			sort_order: item.sort_order,
			published: item.published
		});
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	async function toggle(item) {
		if (busyId !== null) return;
		setBusyId(item.id);
		try {
			const saved = await editSkill(item.id, { published: !item.published });
			setRows(list.map((row) => row.id === saved.id ? saved : row));
			notify("ok", saved.published ? "Skill published." : "Skill hidden.");
		} catch (err) {
			notify("err", errorMessage(err, "Unable to change publish state."));
		} finally {
			setBusyId(null);
		}
	}
	async function remove(item) {
		if (busyId !== null) return;
		if (!window.confirm(`Delete "${item.skill_name}" permanently?`)) return;
		setBusyId(item.id);
		try {
			await removeSkill(item.id);
			const fresh = await getSkills();
			if (fresh.some((row) => row.id === item.id)) {
				notify("err", "The database did not delete this skill. Check the admin row level security policy.");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "admin-layout",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-editor",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-eyebrow",
					children: editingId !== null ? "EDIT SKILL" : "NEW SKILL"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: editingId !== null ? "Update skill" : "Add skill" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: save,
					className: "admin-form",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-two",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Group key" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								list: "admin-skill-groups",
								value: form.group_key,
								onChange: (e) => setGroupKey(e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Group label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.group_label,
								onChange: (e) => set("group_label", e.target.value)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "admin-skill-groups",
							children: groups.map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: key,
								children: label
							}, key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Skill name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: form.skill_name,
							onChange: (e) => set("skill_name", e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "admin-two",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.level,
								onChange: (e) => set("level", e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sort order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								value: form.sort_order,
								onChange: (e) => set("sort_order", Number(e.target.value))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "admin-check",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.published,
								onChange: (e) => set("published", e.target.checked)
							}), "Published on public website"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: saving,
							className: "admin-primary-button",
							children: saving ? "SAVING…" : editingId !== null ? "SAVE CHANGES" : "CREATE SKILL"
						}),
						editingId !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "admin-secondary-button full",
							onClick: reset,
							children: "CANCEL"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-list",
			children: [
				rows === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-empty",
					children: "Loading skills…"
				}),
				list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "admin-item",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "admin-item-main",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-index",
							children: item.sort_order
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.skill_name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.group_label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.level })
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "admin-item-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: item.published ? "admin-status live" : "admin-status",
								children: item.published ? "LIVE" : "HIDDEN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busyId !== null,
								onClick: () => startEdit(item),
								children: "EDIT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busyId !== null,
								onClick: () => void toggle(item),
								children: item.published ? "HIDE" : "PUBLISH"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "danger",
								disabled: busyId !== null,
								onClick: () => void remove(item),
								children: "DELETE"
							})
						]
					})]
				}, item.id)),
				rows !== null && !list.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-empty",
					children: "No skills found."
				})
			]
		})]
	});
}
/**
* Supabase keeps its own session in localStorage under `sb-<ref>-auth-token`.
* Its presence is ONLY a hint for the first frame: a logged-out visitor has no
* key, so the login form renders immediately. Authorization is always decided
* by the real session below, never by this hint.
*/
function hasStoredSession() {
	if (typeof window === "undefined") return false;
	try {
		return Object.keys(window.localStorage).some((key) => /^sb-.+-auth-token$/.test(key));
	} catch {
		return false;
	}
}
function initialPhase() {
	if (!supabase) return {
		status: "error",
		message: "Supabase is not configured. Check your environment variables."
	};
	return hasStoredSession() ? { status: "verifying" } : { status: "login" };
}
function useAdminAuth() {
	const [phase, setPhase] = (0, import_react.useState)(initialPhase);
	(0, import_react.useEffect)(() => {
		const client = supabase;
		if (!client) return;
		let active = true;
		const apply = (email) => {
			if (!active) return;
			const next = resolvePhase(email, ADMIN_EMAIL);
			setPhase((current) => samePhase(current, next) ? current : next);
		};
		client.auth.getSession().then(({ data, error }) => {
			apply(error ? null : data.session?.user.email);
		}).catch(() => apply(null));
		const { data } = client.auth.onAuthStateChange((_event, session) => {
			apply(session?.user.email);
		});
		return () => {
			active = false;
			data.subscription.unsubscribe();
		};
	}, []);
	return phase;
}
function AdminVerifying() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-page admin-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-loading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "admin-dot" }), "Verifying session…"]
		})
	});
}
function AdminDenied({ title, message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-page admin-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-denied",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-eyebrow",
					children: "ACCESS DENIED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: message }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "admin-primary-button",
					onClick: () => {
						signOut().catch(() => void 0);
					},
					children: "SIGN OUT"
				})
			]
		})
	});
}
/**
* Auth gate for /admin.
*
* - No stored session: the login form is the very first frame.
* - Stored session: a short "Verifying session…" until Supabase answers.
* - Signed in as the admin: the panel, which loads its own data inline.
* - Signed in as anyone else: access denied.
*/
function AdminDashboard() {
	const phase = useAdminAuth();
	switch (phase.status) {
		case "login": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLogin, { onSuccess: () => void 0 });
		case "verifying": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminVerifying, {});
		case "denied": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDenied, {
			title: "Not authorized",
			message: `Signed in as ${phase.email}. This account is not authorized for the portfolio CMS.`
		});
		case "error": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDenied, {
			title: "Admin unavailable",
			message: phase.message
		});
		case "ready": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPanel, { email: phase.email });
	}
}
var SplitComponent = AdminDashboard;
//#endregion
export { SplitComponent as component };
