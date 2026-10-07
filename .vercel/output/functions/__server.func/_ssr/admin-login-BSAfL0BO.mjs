import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-B1UUYl23.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-login-BSAfL0BO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_EMAIL = "ahmadayaz0704@gmail.com";
function getSupabase() {
	if (!supabase) throw new Error("Supabase is not configured. Check your environment variables.");
	return supabase;
}
async function signIn(email, password) {
	const { data, error } = await getSupabase().auth.signInWithPassword({
		email,
		password
	});
	if (error) throw error;
	return data;
}
async function signOut() {
	await getSupabase().auth.signOut();
}
async function getProjects() {
	const { data, error } = await getSupabase().from("portfolio_projects").select("id, project_index, title, project_type, category, href, external, summary, pattern, published").order("project_index", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function insertProject(project) {
	const client = getSupabase();
	const row = {
		...project,
		id: crypto.randomUUID()
	};
	const { data, error } = await client.from("portfolio_projects").insert(row).select().single();
	if (error) throw error;
	return data;
}
async function editProject(id, project) {
	const { data, error } = await getSupabase().from("portfolio_projects").update(project).eq("id", id).select().single();
	if (error) throw error;
	return data;
}
async function removeProject(id) {
	const { error } = await getSupabase().from("portfolio_projects").delete().eq("id", id);
	if (error) throw error;
}
async function getSkills() {
	const { data, error } = await getSupabase().from("portfolio_skills").select("id, group_key, group_label, skill_name, level, sort_order, published").order("sort_order", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function insertSkill(skill) {
	const { data, error } = await getSupabase().from("portfolio_skills").insert(skill).select().single();
	if (error) throw error;
	return data;
}
async function editSkill(id, skill) {
	const { data, error } = await getSupabase().from("portfolio_skills").update(skill).eq("id", id).select().single();
	if (error) throw error;
	return data;
}
async function removeSkill(id) {
	const { error } = await getSupabase().from("portfolio_skills").delete().eq("id", id);
	if (error) throw error;
}
function resolvePhase(email, adminEmail) {
	const current = email?.trim();
	if (!current) return { status: "login" };
	if (current.toLowerCase() === adminEmail.trim().toLowerCase()) return {
		status: "ready",
		email: current
	};
	return {
		status: "denied",
		email: current
	};
}
function samePhase(a, b) {
	if (a.status !== b.status) return false;
	if ((a.status === "ready" || a.status === "denied") && (b.status === "ready" || b.status === "denied")) return a.email === b.email;
	if (a.status === "error" && b.status === "error") return a.message === b.message;
	return true;
}
/** Supabase errors are not always `Error` instances, so read `message` safely. */
function errorMessage(err, fallback) {
	if (typeof err === "string" && err) return err;
	if (typeof err === "object" && err !== null && "message" in err) {
		const message = String(err.message ?? "");
		if (/coerce the result to a single json object/i.test(message)) return "The database refused the change (no row was affected). Check that you are signed in as the admin and that the row level security policies allow it.";
		if (message) return message;
	}
	return fallback;
}
function AdminLogin({ onSuccess }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function submit(event) {
		event.preventDefault();
		if (loading) return;
		setLoading(true);
		setError("");
		try {
			await signIn(email.trim(), password);
			if (onSuccess) onSuccess();
			else window.location.replace("/admin");
		} catch (err) {
			setError(errorMessage(err, "Unable to sign in."));
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-page admin-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-login-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "admin-eyebrow",
					children: "PORTFOLIO CMS · SECURE ACCESS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "admin-login-title",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "admin-muted admin-login-description",
					children: "Sign in to manage your portfolio content."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "admin-form",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							placeholder: "admin@example.com",
							autoComplete: "username",
							autoFocus: true,
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							placeholder: "••••••••••••",
							autoComplete: "current-password",
							required: true
						})] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "admin-error",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: loading,
							className: "admin-primary-button",
							children: loading ? "AUTHENTICATING…" : "SIGN IN"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "admin-back",
					children: "← Return to portfolio"
				})
			]
		})
	});
}
//#endregion
export { errorMessage as a, insertProject as c, removeSkill as d, resolvePhase as f, editSkill as i, insertSkill as l, signOut as m, AdminLogin as n, getProjects as o, samePhase as p, editProject as r, getSkills as s, ADMIN_EMAIL as t, removeProject as u };
