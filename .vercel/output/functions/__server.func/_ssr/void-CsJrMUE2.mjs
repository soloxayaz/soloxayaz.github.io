import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/void-CsJrMUE2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VoidPage() {
	const [late, setLate] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setLate(true), 8e3);
		return () => window.clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.2em] text-dim uppercase",
				children: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-6 font-display text-4xl text-paper italic sm:text-5xl",
				children: ["you weren't supposed to find this", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "blink text-accent",
					children: "_"
				})]
			}),
			late && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 max-w-md text-sm leading-relaxed text-dim",
				children: "...but since you stayed: nothing here is a secret. it's just quiet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "link-draw mt-12 w-fit font-mono text-xs tracking-[0.16em] text-paper uppercase",
				children: "return"
			})
		]
	});
}
//#endregion
export { VoidPage as component };
