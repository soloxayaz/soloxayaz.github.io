import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./router-Cwe6vTA2.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-Cfr0AJyw.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.16em] transition-[transform,background-color,color,border-color,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-paper text-ink hover:bg-accent",
			outline: "border border-paper/40 bg-transparent text-paper hover:border-paper hover:bg-paper hover:text-ink",
			ghost: "text-dim hover:text-paper"
		},
		size: {
			md: "h-11 min-h-11 px-5",
			lg: "h-12 min-h-12 px-6"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
