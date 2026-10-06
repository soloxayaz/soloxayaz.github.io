import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { a as beliefs, h as easeOut } from "./router-Cwe6vTA2.mjs";
import { n as SectionLabel } from "./reveal-DeWCTacy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/manifesto-CZp5gxtO.js
var import_jsx_runtime = require_jsx_runtime();
function Manifesto() {
	const reduced = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "manifesto",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
				index: "05",
				children: "ethical disclosure & philosophy"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-8 sm:space-y-10",
				children: beliefs.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
					className: "grid items-baseline gap-3 border-b border-line pb-8 sm:grid-cols-[4rem_1fr] sm:gap-8",
					initial: reduced ? false : {
						opacity: 0,
						y: 20
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: {
						once: true,
						margin: "-8%"
					},
					transition: {
						duration: .55,
						delay: i * .06,
						ease: easeOut
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-accent tabular-nums",
						children: ["0", i + 1]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl leading-snug text-paper sm:text-4xl md:text-5xl",
						children: b
					})]
				}, b))
			})]
		})
	});
}
function ManifestoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Manifesto, {}) });
}
//#endregion
export { ManifestoPage as component };
