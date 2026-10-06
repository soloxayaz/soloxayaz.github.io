import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getSkills, c as isAdmin, f as signOut, i as getProjects, l as removeProject, n as editSkill, o as insertProject, r as getCurrentUser, s as insertSkill, t as editProject, u as removeSkill } from "./admin-EBhcWc5j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bo_7KNMF.js
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
function AdminDashboard() {
	const [authorized, setAuthorized] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [userEmail, setUserEmail] = (0, import_react.useState)("");
	const [projects, setProjects] = (0, import_react.useState)([]);
	const [skills, setSkills] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("projects");
	const [projectForm, setProjectForm] = (0, import_react.useState)(EMPTY_PROJECT);
	const [skillForm, setSkillForm] = (0, import_react.useState)(EMPTY_SKILL);
	const [editingProjectId, setEditingProjectId] = (0, import_react.useState)(null);
	const [editingSkillId, setEditingSkillId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	async function boot() {
		try {
			const user = await getCurrentUser();
			if (!user) {
				window.location.replace("/admin/login");
				return;
			}
			setUserEmail(user.email ?? "");
			if (!await isAdmin()) {
				setError("This account is authenticated but is not authorized as an admin.");
				return;
			}
			const [projectRows, skillRows] = await Promise.all([getProjects(), getSkills()]);
			setProjects(projectRows);
			setSkills(skillRows);
			setAuthorized(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to initialize admin.");
		} finally {
			setChecking(false);
		}
	}
	(0, import_react.useEffect)(() => {
		boot();
	}, []);
	function notify(text) {
		setMessage(text);
		window.setTimeout(() => {
			setMessage("");
		}, 3e3);
	}
	async function saveProject(event) {
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
			setError(err instanceof Error ? err.message : "Unable to save project.");
		} finally {
			setSaving(false);
		}
	}
	function startProjectEdit(item) {
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
			published: item.published
		});
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
	async function deleteProject(id) {
		if (!window.confirm("Delete this project permanently?")) return;
		try {
			await removeProject(id);
			notify("Project deleted.");
			setProjects(await getProjects());
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to delete project.");
		}
	}
	async function toggleProject(item) {
		try {
			await editProject(item.id, { published: !item.published });
			notify(item.published ? "Project hidden from public site." : "Project published.");
			setProjects(await getProjects());
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to change publish state.");
		}
	}
	async function saveSkill(event) {
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
			setError(err instanceof Error ? err.message : "Unable to save skill.");
		} finally {
			setSaving(false);
		}
	}
	function startSkillEdit(item) {
		setEditingSkillId(item.id);
		setSkillForm({
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
	async function deleteSkill(id) {
		if (!window.confirm("Delete this skill permanently?")) return;
		try {
			await removeSkill(id);
			notify("Skill deleted.");
			setSkills(await getSkills());
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to delete skill.");
		}
	}
	async function logout() {
		await signOut();
		window.location.replace("/admin/login");
	}
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-page admin-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-loading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "admin-dot" }), "Loading control room…"]
		})
	});
	if (!authorized) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-page admin-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-denied",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-eyebrow",
					children: "ACCESS DENIED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Not authorized" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error || "Your account does not have administrator access." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: logout,
					className: "admin-primary-button",
					children: "SIGN OUT"
				})
			]
		})
	});
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
						children: userEmail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "admin-secondary-button",
						children: "VIEW SITE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: logout,
						className: "admin-secondary-button",
						children: "SIGN OUT"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-container",
			children: [
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-success",
					children: message
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-error admin-error-wide",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "admin-tabs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: tab === "projects" ? "admin-tab active" : "admin-tab",
						onClick: () => setTab("projects"),
						children: ["PROJECTS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: projects.length })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: tab === "skills" ? "admin-tab active" : "admin-tab",
						onClick: () => setTab("skills"),
						children: ["SKILLS", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: skills.length })]
					})]
				}),
				tab === "projects" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-layout",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "admin-editor",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "admin-eyebrow",
								children: editingProjectId ? "EDIT PROJECT" : "NEW PROJECT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: editingProjectId ? "Update work" : "Add work" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: saveProject,
								className: "admin-form",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										value: projectForm.title,
										onChange: (e) => setProjectForm({
											...projectForm,
											title: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "admin-two",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Index" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											placeholder: "01",
											value: projectForm.project_index,
											onChange: (e) => setProjectForm({
												...projectForm,
												project_index: e.target.value
											})
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type / Year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: projectForm.project_type,
											onChange: (e) => setProjectForm({
												...projectForm,
												project_type: e.target.value
											})
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "admin-two",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: projectForm.category,
											onChange: (e) => setProjectForm({
												...projectForm,
												category: e.target.value
											})
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pattern" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: projectForm.pattern,
											onChange: (e) => setProjectForm({
												...projectForm,
												pattern: e.target.value
											})
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										type: "url",
										value: projectForm.href,
										onChange: (e) => setProjectForm({
											...projectForm,
											href: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										rows: 5,
										value: projectForm.summary,
										onChange: (e) => setProjectForm({
											...projectForm,
											summary: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "admin-check",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: projectForm.external,
											onChange: (e) => setProjectForm({
												...projectForm,
												external: e.target.checked
											})
										}), "External project"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "admin-check",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: projectForm.published,
											onChange: (e) => setProjectForm({
												...projectForm,
												published: e.target.checked
											})
										}), "Published on public website"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										disabled: saving,
										className: "admin-primary-button",
										children: saving ? "SAVING…" : editingProjectId ? "SAVE CHANGES" : "CREATE PROJECT"
									}),
									editingProjectId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "admin-secondary-button full",
										onClick: () => {
											setEditingProjectId(null);
											setProjectForm(EMPTY_PROJECT);
										},
										children: "CANCEL"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "admin-list",
						children: [projects.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
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
										" ·",
										" ",
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
										onClick: () => startProjectEdit(item),
										children: "EDIT"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleProject(item),
										children: item.published ? "HIDE" : "PUBLISH"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "danger",
										onClick: () => deleteProject(item.id),
										children: "DELETE"
									})
								]
							})]
						}, item.id)), !projects.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-empty",
							children: "No projects found."
						})]
					})]
				}),
				tab === "skills" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "admin-layout",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "admin-editor",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "admin-eyebrow",
								children: editingSkillId !== null ? "EDIT SKILL" : "NEW SKILL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: editingSkillId !== null ? "Update skill" : "Add skill" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: saveSkill,
								className: "admin-form",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Group key" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										placeholder: "frontend",
										value: skillForm.group_key,
										onChange: (e) => setSkillForm({
											...skillForm,
											group_key: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Group label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										placeholder: "Frontend",
										value: skillForm.group_label,
										onChange: (e) => setSkillForm({
											...skillForm,
											group_label: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Skill" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: true,
										placeholder: "React",
										value: skillForm.skill_name,
										onChange: (e) => setSkillForm({
											...skillForm,
											skill_name: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Level / Hint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: "Advanced",
										value: skillForm.level,
										onChange: (e) => setSkillForm({
											...skillForm,
											level: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sort order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: skillForm.sort_order,
										onChange: (e) => setSkillForm({
											...skillForm,
											sort_order: Number(e.target.value)
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "admin-check",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: skillForm.published,
											onChange: (e) => setSkillForm({
												...skillForm,
												published: e.target.checked
											})
										}), "Published"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										disabled: saving,
										className: "admin-primary-button",
										children: saving ? "SAVING…" : editingSkillId !== null ? "SAVE CHANGES" : "CREATE SKILL"
									}),
									editingSkillId !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "admin-secondary-button full",
										onClick: () => {
											setEditingSkillId(null);
											setSkillForm(EMPTY_SKILL);
										},
										children: "CANCEL"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "admin-list",
						children: [skills.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "admin-item",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "admin-item-main",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "admin-index",
									children: String(item.sort_order).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.skill_name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.group_label }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.level })
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "admin-item-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => startSkillEdit(item),
									children: "EDIT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "danger",
									onClick: () => deleteSkill(item.id),
									children: "DELETE"
								})]
							})]
						}, item.id)), !skills.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-empty",
							children: "No skills found."
						})]
					})]
				})
			]
		})]
	});
}
var SplitComponent = AdminDashboard;
//#endregion
export { SplitComponent as component };
