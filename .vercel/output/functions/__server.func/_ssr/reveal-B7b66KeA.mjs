import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { h as easeOut, n as cn } from "./router-CK2uAlZd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reveal-B7b66KeA.js
var import_jsx_runtime = require_jsx_runtime();
function Reveal({ children, className, delay = 0, y = 18 }) {
	const reduced = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: cn(className),
		initial: reduced ? false : {
			opacity: 0,
			y
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-12% 0px -8% 0px",
			amount: .2
		},
		transition: {
			duration: .55,
			delay,
			ease: easeOut
		},
		children
	});
}
function SectionLabel({ index, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.22em] text-dim md:mb-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				children: index
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
		]
	});
}
//#endregion
export { SectionLabel as n, Reveal as t };
