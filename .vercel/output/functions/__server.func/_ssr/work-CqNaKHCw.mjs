import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { a as LayoutGroup, o as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { h as easeOut, n as cn, o as categories, u as projects } from "./router-Cwe6vTA2.mjs";
import { n as SectionLabel } from "./reveal-DeWCTacy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/work-CqNaKHCw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectPattern({ pattern, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("absolute inset-0 overflow-hidden", className),
		"aria-hidden": "true",
		children: [
			pattern === "radial" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pat-radial absolute inset-0" }),
			pattern === "lines" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pat-lines absolute inset-0" }),
			pattern === "grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pat-grid absolute inset-0" }),
			pattern === "slash" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pat-slash absolute inset-0" }),
			pattern === "dots" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pat-dots absolute inset-0" }),
			pattern === "void" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pat-void absolute inset-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/20" })
			}),
			pattern === "orbit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[28%] left-[62%] size-3 rounded-full bg-accent/80" })
			] }),
			pattern === "wave" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "absolute inset-0 h-full w-full",
				viewBox: "0 0 400 300",
				preserveAspectRatio: "none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 180 C 80 120, 140 240, 220 170 S 340 90, 400 150",
					fill: "none",
					stroke: "currentColor",
					className: "text-accent/40",
					strokeWidth: "1.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 210 C 90 150, 150 260, 240 190 S 350 120, 400 180",
					fill: "none",
					stroke: "currentColor",
					className: "text-paper/15",
					strokeWidth: "1.5"
				})]
			})
		]
	});
}
function ProjectCard({ project, featured }) {
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectPattern, { pattern: project.pattern }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-wash absolute inset-0" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex h-full flex-col justify-between p-6 sm:p-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-5xl leading-none text-paper/15 tabular-nums sm:text-6xl",
					children: project.index
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-2xs tracking-[0.18em] text-dim uppercase",
					children: [
						project.category,
						" · ",
						project.year
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-3xl tracking-tight text-paper sm:text-4xl",
				children: project.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-sm leading-relaxed text-dim md:hidden",
				children: project.summary
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden md:block", "translate-y-full bg-ink/92 p-7", "transition-transform duration-300 ease-out", "group-hover:translate-y-0 group-focus-visible:translate-y-0"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm leading-relaxed text-paper",
				children: project.summary
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 flex items-center gap-2 font-mono text-2xs tracking-[0.18em] text-accent uppercase",
				children: ["open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
			})]
		})
	] });
	const cls = cn("group relative block min-h-72 overflow-hidden rounded-lg bg-elevated shadow-border", "transition-[transform,box-shadow] duration-300 ease-out", "hover:-translate-y-1 hover:shadow-border-hover", "focus-visible:outline-offset-4", featured && "md:col-span-2 md:min-h-96");
	if (project.external) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: project.href,
		target: "_blank",
		rel: "noreferrer",
		className: cls,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: project.href,
		className: cls,
		children: inner
	});
}
function Projects() {
	const [filter, setFilter] = (0, import_react.useState)("all");
	const reduced = useReducedMotion();
	const visible = (0, import_react.useMemo)(() => filter === "all" ? projects : projects.filter((p) => p.category === filter), [filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "work",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					index: "01",
					children: "projects"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md font-display text-2xl text-paper italic sm:text-3xl",
						children: "tools, utilities and web builds."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						role: "tablist",
						"aria-label": "Filter projects by category",
						children: categories.map((cat) => {
							const on = filter === cat;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-selected": on,
								onClick: () => setFilter(cat),
								className: cn("relative h-11 min-w-11 overflow-hidden rounded-full px-4 font-mono text-2xs tracking-[0.16em] uppercase", "transition-colors duration-200", on ? "text-ink" : "text-dim hover:text-paper"),
								children: [on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: reduced ? void 0 : "chip-pill",
									className: "absolute inset-0 rounded-full bg-paper",
									transition: {
										duration: .28,
										ease: easeOut
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative z-10",
									children: cat
								})]
							}, cat);
						})
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					layout: true,
					className: "grid grid-cols-1 gap-4 md:grid-cols-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "popLayout",
						initial: false,
						children: visible.map((project, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							layout: true,
							initial: reduced ? false : {
								opacity: 0,
								y: 16,
								scale: .98
							},
							animate: {
								opacity: 1,
								y: 0,
								scale: 1
							},
							exit: {
								opacity: 0,
								y: -10,
								scale: .98
							},
							transition: {
								duration: .35,
								delay: Math.min(i, 6) * .04,
								ease: easeOut
							},
							className: i === 0 && filter === "all" ? "md:col-span-2" : void 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCard, {
								project,
								featured: i === 0 && filter === "all"
							})
						}, project.id))
					})
				})
			]
		})
	});
}
function ProjectsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projects, {}) });
}
//#endregion
export { ProjectsPage as component };
