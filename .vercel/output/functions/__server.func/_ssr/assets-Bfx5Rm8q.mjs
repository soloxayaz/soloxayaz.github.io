import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as assets } from "./router-CK2uAlZd.mjs";
import { n as SectionLabel, t as Reveal } from "./reveal-B7b66KeA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assets-Bfx5Rm8q.js
var import_jsx_runtime = require_jsx_runtime();
function Assets() {
	const cells = [
		[
			"total portfolio value",
			assets.total,
			assets.inr
		],
		[
			"24h performance",
			assets.change,
			assets.changeNote
		],
		[
			"largest holding",
			assets.largest,
			assets.largestNote
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "assets",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					index: "06",
					children: "asset dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl font-display text-3xl text-paper italic sm:text-4xl",
					children: "portfolio monitor."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-sm leading-relaxed text-dim",
					children: "Initial baseline snapshot. These figures are static, not live prices."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-line md:grid-cols-3",
					children: cells.map(([label, value, note], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						delay: .06 * i,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full bg-ink px-5 py-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] tracking-[0.16em] text-dim uppercase",
									children: label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-display text-3xl tracking-tight text-paper tabular-nums sm:text-4xl",
									children: value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-mono text-[11px] text-accent",
									children: note
								})
							]
						})
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 grid gap-12 lg:grid-cols-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						className: "lg:col-span-7",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-[0.2em] text-dim uppercase",
							children: "holdings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4",
							children: assets.holdings.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-baseline justify-between gap-4 border-b border-line py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl text-paper",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm text-dim tabular-nums",
									children: v
								})]
							}, k))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: .1,
						className: "lg:col-span-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs tracking-[0.2em] text-dim uppercase",
							children: "the builder's motto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-display text-3xl leading-snug text-paper italic",
							children: [
								"“",
								assets.motto,
								"”"
							]
						})]
					})]
				})
			]
		})
	});
}
function AssetsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Assets, {}) });
}
//#endregion
export { AssetsPage as component };
