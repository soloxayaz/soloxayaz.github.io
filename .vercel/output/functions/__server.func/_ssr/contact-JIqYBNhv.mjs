import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as site, n as cn } from "./router-CK2uAlZd.mjs";
import { n as SectionLabel, t as Reveal } from "./reveal-B7b66KeA.mjs";
import { t as Button } from "./button-ByTqYyR0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-JIqYBNhv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full border-0 border-b border-line bg-transparent px-0 py-2 font-sans text-base text-paper placeholder:text-dim/70", "transition-[border-color] duration-200 ease-out", "focus:border-accent focus:outline-none", "aria-[invalid=true]:border-dusk", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-2 block font-mono text-xs uppercase tracking-[0.16em] text-dim", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-32 w-full resize-y border-0 border-b border-line bg-transparent px-0 py-2 font-sans text-base text-paper placeholder:text-dim/70", "transition-[border-color] duration-200 ease-out", "focus:border-accent focus:outline-none", "aria-[invalid=true]:border-dusk", className),
		...props
	});
}
function ContactForm() {
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [errors, setErrors] = (0, import_react.useState)({});
	async function onSubmit(e) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		if (data.get("_gotcha")) return;
		const next = {};
		const name = String(data.get("name") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const message = String(data.get("message") ?? "").trim();
		if (!name) next.name = "Enter your name or nickname.";
		if (!email) next.email = "Enter your email address.";
		else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
		if (!message) next.message = "Write a message.";
		setErrors(next);
		if (Object.keys(next).length) return;
		setStatus("sending");
		try {
			const res = await fetch(site.formspree, {
				method: "POST",
				body: data,
				headers: { Accept: "application/json" }
			});
			if (!res.ok) throw new Error(String(res.status));
			form.reset();
			setStatus("ok");
		} catch {
			setStatus("fail");
		}
	}
	if (status === "ok") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		role: "status",
		className: "font-display text-2xl text-paper italic",
		children: [
			"Message sent. Thanks for reaching out.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "link-draw ml-2 font-mono text-xs tracking-[0.16em] text-accent not-italic uppercase",
				onClick: () => setStatus("idle"),
				children: "send another"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		noValidate: true,
		className: "space-y-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "name",
					children: "name / nickname"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "name",
					name: "name",
					autoComplete: "name",
					"aria-invalid": !!errors.name,
					"aria-describedby": errors.name ? "name-e" : void 0
				}),
				errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "name-e",
					role: "alert",
					className: "mt-2 text-sm text-dusk",
					children: errors.name
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "email",
					children: "email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "email",
					name: "email",
					type: "email",
					autoComplete: "email",
					"aria-invalid": !!errors.email,
					"aria-describedby": errors.email ? "email-e" : void 0
				}),
				errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "email-e",
					role: "alert",
					className: "mt-2 text-sm text-dusk",
					children: errors.email
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "github",
				children: "github username (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "github",
				name: "github",
				autoComplete: "off"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "message",
					children: "message"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "message",
					name: "message",
					rows: 5,
					"aria-invalid": !!errors.message,
					"aria-describedby": errors.message ? "message-e" : void 0
				}),
				errors.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "message-e",
					role: "alert",
					className: "mt-2 text-sm text-dusk",
					children: errors.message
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "hidden",
				name: "_subject",
				value: "New message from THE GREAT AYAZ site"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				name: "_gotcha",
				tabIndex: -1,
				autoComplete: "off",
				"aria-hidden": "true",
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: status === "sending",
				children: status === "sending" ? "sending..." : "send message"
			}),
			status === "fail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-dusk",
				children: "Message not sent. Check your connection and try again."
			})
		]
	});
}
function Contact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
				index: "07",
				children: "dispatch"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "lg:col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-4xl text-paper italic sm:text-5xl",
							children: "connect with Ayaz."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-sm text-base leading-relaxed text-dim",
							children: "For security collaboration, open-source projects, web design queries, or technology research exchanges."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 space-y-3 font-mono text-xs tracking-[0.16em] text-dim uppercase",
							children: site.accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "link-draw block w-fit text-paper",
								href: a.url,
								target: "_blank",
								rel: "noreferrer",
								children: ["github · ", a.user]
							}, a.user))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: .1,
					className: "lg:col-span-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactForm, {})
				})]
			})]
		})
	});
}
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {}) });
}
//#endregion
export { ContactPage as component };
