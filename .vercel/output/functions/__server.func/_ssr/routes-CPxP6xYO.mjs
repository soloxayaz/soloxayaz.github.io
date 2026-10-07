import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowUpRight, o as ArrowDown } from "../_libs/lucide-react.mjs";
import { o as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as useIntro, c as nav, d as site, g as useClock, h as easeOut, m as thoughts } from "./router-CK2uAlZd.mjs";
import { n as SectionLabel, t as Reveal } from "./reveal-B7b66KeA.mjs";
import { t as Button } from "./button-ByTqYyR0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPxP6xYO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SplitWords({ text, delay, className }) {
	const reduced = useReducedMotion();
	const words = text.split(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		children: words.map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-block overflow-hidden align-bottom",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				className: "inline-block pr-[0.28em]",
				initial: reduced ? false : { y: "110%" },
				animate: { y: "0%" },
				transition: {
					duration: .7,
					delay: delay + i * .06,
					ease: easeOut
				},
				children: word
			})
		}, `${word}-${i}`))
	});
}
function Hero() {
	const { time, day, session, mounted } = useClock();
	const { ready } = useIntro();
	const reduced = useReducedMotion();
	const [thought, setThought] = (0, import_react.useState)(0);
	const start = ready || Boolean(reduced);
	(0, import_react.useEffect)(() => {
		if (!start) return;
		const t = window.setInterval(() => {
			setThought((n) => (n + 1) % thoughts.length);
		}, 4200);
		return () => window.clearInterval(t);
	}, [start]);
	const scrollToPages = () => {
		document.getElementById("pages")?.scrollIntoView({
			behavior: reduced ? "auto" : "smooth",
			block: "start"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col justify-center px-5 py-16 sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
					className: "mb-8 font-mono text-2xs tracking-[0.18em] text-dim uppercase sm:text-xs",
					initial: reduced ? false : {
						opacity: 0,
						y: 8
					},
					animate: start ? {
						opacity: 1,
						y: 0
					} : {
						opacity: 0,
						y: 8
					},
					transition: {
						duration: .5,
						ease: easeOut
					},
					children: [
						"system online // security research & build log",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-line",
							children: "·"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: mounted ? `${time} ${day} · session ${session}` : "loading session"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "overflow-hidden font-display text-hero leading-none tracking-tight text-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
						className: "block",
						initial: reduced ? false : { y: "110%" },
						animate: start ? { y: "0%" } : { y: "110%" },
						transition: {
							duration: .8,
							ease: easeOut
						},
						children: site.display
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 max-w-xl font-display text-3xl leading-tight text-paper italic sm:text-4xl md:text-5xl",
					children: start ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplitWords, {
						text: site.tagline,
						delay: .25
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "opacity-0",
						children: site.tagline
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					className: "mt-6 max-w-md text-base leading-relaxed text-dim sm:text-lg",
					initial: reduced ? false : {
						opacity: 0,
						y: 12
					},
					animate: start ? {
						opacity: 1,
						y: 0
					} : { opacity: 0 },
					transition: {
						duration: .55,
						delay: .55,
						ease: easeOut
					},
					children: site.blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					className: "mt-8 min-h-6 font-mono text-sm text-accent",
					initial: reduced ? false : { opacity: 0 },
					animate: start ? { opacity: 1 } : { opacity: 0 },
					transition: { delay: .7 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
							className: "inline-block",
							initial: {
								opacity: 0,
								y: 8,
								filter: "blur(4px)"
							},
							animate: {
								opacity: 1,
								y: 0,
								filter: "blur(0px)"
							},
							exit: {
								opacity: 0,
								y: -8,
								filter: "blur(4px)"
							},
							transition: {
								duration: .35,
								ease: easeOut
							},
							children: [thoughts[thought], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "blink",
								children: "_"
							})]
						}, thoughts[thought])
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "mt-12 flex flex-wrap items-center gap-3",
					initial: reduced ? false : {
						opacity: 0,
						y: 10
					},
					animate: start ? {
						opacity: 1,
						y: 0
					} : { opacity: 0 },
					transition: {
						duration: .5,
						delay: .8,
						ease: easeOut
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/work",
							children: "view projects"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/repos",
							children: "all repositories"
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
			type: "button",
			onClick: scrollToPages,
			className: "absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-2xs tracking-[0.2em] text-dim uppercase",
			initial: reduced ? false : { opacity: 0 },
			animate: start ? { opacity: 1 } : { opacity: 0 },
			transition: { delay: 1.1 },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				animate: reduced ? void 0 : { y: [
					0,
					6,
					0
				] },
				transition: {
					duration: 1.8,
					repeat: Infinity,
					ease: "easeInOut"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
			}), "scroll"]
		})]
	});
}
/** Home-page index: one animated row per page. */
function PagesIndex() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "pages",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
				index: "00",
				children: "explore"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "border-t border-line",
				children: nav.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: .05 * i,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: "group grid items-baseline gap-2 border-b border-line py-7 sm:grid-cols-[4rem_1fr_auto] sm:gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs text-accent tabular-nums",
								children: ["0", i + 1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-3xl text-paper transition-transform duration-300 ease-out group-hover:translate-x-2 sm:text-5xl",
								children: item.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block text-sm text-dim",
								children: item.blurb
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								"aria-hidden": "true",
								className: "hidden size-5 text-dim transition-[color,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent sm:block"
							})
						]
					})
				}) }, item.id))
			})]
		})
	});
}
/** Old single-page anchors (/#work …) now live on their own pages. */
var LEGACY = {
	work: "/work",
	about: "/about",
	skills: "/skills",
	manifesto: "/manifesto",
	contact: "/contact"
};
function Home() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const id = window.location.hash.replace("#", "");
		if (!id) return;
		if (id in LEGACY) {
			navigate({
				to: LEGACY[id],
				replace: true
			});
			return;
		}
		const t = window.setTimeout(() => {
			document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
		}, 80);
		return () => window.clearTimeout(t);
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagesIndex, {})] });
}
//#endregion
export { Home as component };
