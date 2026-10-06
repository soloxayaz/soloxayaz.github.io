import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as signIn, r as getCurrentUser } from "./admin-EBhcWc5j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-DuHj-N6M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogin() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let alive = true;
		async function check() {
			try {
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
	async function submit(event) {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			await signIn(email.trim(), password);
			window.location.replace("/admin");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to sign in.");
		} finally {
			setLoading(false);
		}
	}
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-page admin-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "admin-loading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "admin-dot" }), "Checking authentication…"]
		})
	});
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
							required: true,
							autoFocus: true
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
var SplitComponent = AdminLogin;
//#endregion
export { SplitComponent as component };
