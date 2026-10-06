import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as now, p as stats, r as about, s as focus } from "./router-Cwe6vTA2.mjs";
import { n as SectionLabel, t as Reveal } from "./reveal-DeWCTacy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-NquRC0FL.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "about",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					index: "03",
					children: "about"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 lg:grid-cols-12 lg:gap-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "lg:col-span-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl leading-snug text-paper sm:text-4xl md:text-5xl",
							children: about.lead
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-xl text-base leading-relaxed text-dim sm:text-lg",
							children: about.body
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: .12,
						className: "lg:col-span-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs tracking-[0.2em] text-dim uppercase",
								children: "at a glance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-8" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "space-y-6",
								children: now.items.map(([k, v], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
									delay: .04 * i,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "font-mono text-[11px] tracking-[0.16em] text-dim uppercase",
										children: k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-1 font-display text-xl text-paper italic",
										children: v
									})]
								}, k))
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line md:grid-cols-4",
					children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: .05 * i,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-ink px-5 py-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl tracking-tight text-paper tabular-nums sm:text-4xl",
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-[11px] tracking-[0.16em] text-dim uppercase",
								children: s.label
							})]
						})
					}, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						index: "03.1",
						children: "security & research"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-10 md:grid-cols-3",
						children: focus.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
							delay: .08 * i,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl text-paper",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-dim",
									children: f.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 font-mono text-[11px] tracking-wide text-accent",
									children: f.tags.join(" / ")
								})
							]
						}, f.title))
					})]
				})
			]
		})
	});
}
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}) });
}
//#endregion
export { AboutPage as component };
