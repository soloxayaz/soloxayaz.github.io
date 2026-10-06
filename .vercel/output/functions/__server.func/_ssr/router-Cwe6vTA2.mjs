import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Menu, n as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { n as useSpring, o as AnimatePresence, r as useScroll } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cwe6vTA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-center gap-3 px-5 py-24 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-dusk",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-8",
					strokeWidth: 1.75
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-paper italic",
				children: "something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm leading-relaxed break-words text-dim",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var IntroContext = (0, import_react.createContext)({
	showIntro: false,
	ready: true,
	completeIntro: () => {}
});
function useIntro() {
	return (0, import_react.useContext)(IntroContext);
}
function usePrefersReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => setReduced(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	return reduced;
}
function timeOfDayFromHour(hour) {
	if (hour < 5) return "night";
	if (hour < 12) return "morning";
	if (hour < 18) return "afternoon";
	if (hour < 22) return "evening";
	return "night";
}
function pad(n) {
	return String(n).padStart(2, "0");
}
var sessionStart = 0;
function getSessionStart() {
	if (!sessionStart) sessionStart = Date.now();
	return sessionStart;
}
function useClock() {
	const [now, setNow] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [start] = (0, import_react.useState)(getSessionStart);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
		return () => clearInterval(t);
	}, []);
	const seconds = Math.floor((now.getTime() - start) / 1e3);
	const hour = now.getHours();
	return {
		mounted,
		now,
		hour,
		tod: timeOfDayFromHour(hour),
		time: now.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		}),
		day: now.toLocaleDateString([], { weekday: "long" }).toLowerCase(),
		session: `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
	};
}
function Ambient() {
	const { tod, mounted } = useClock();
	const reduced = usePrefersReducedMotion();
	const { scrollYProgress } = useScroll();
	const progress = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 28,
		restDelta: .001
	});
	(0, import_react.useEffect)(() => {
		if (!mounted) return;
		document.documentElement.dataset.tod = tod;
	}, [tod, mounted]);
	(0, import_react.useEffect)(() => {
		if (reduced) return;
		let mx = window.innerWidth / 2;
		let my = window.innerHeight * .28;
		let cx = mx;
		let cy = my;
		const onMove = (e) => {
			mx = e.clientX;
			my = e.clientY;
		};
		let raf = 0;
		const tick = () => {
			cx += (mx - cx) * .12;
			cy += (my - cy) * .12;
			document.documentElement.style.setProperty("--mx", `${cx}px`);
			document.documentElement.style.setProperty("--my", `${cy}px`);
			raf = requestAnimationFrame(tick);
		};
		window.addEventListener("mousemove", onMove, { passive: true });
		raf = requestAnimationFrame(tick);
		return () => {
			window.removeEventListener("mousemove", onMove);
			cancelAnimationFrame(raf);
		};
	}, [reduced]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glow",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grain",
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			"aria-hidden": "true",
			className: "pointer-events-none fixed top-0 right-0 left-0 z-50 h-px origin-left bg-accent",
			style: { scaleX: reduced ? 0 : progress }
		})
	] });
}
var easeOut = [
	.22,
	1,
	.36,
	1
];
var site = {
	name: "ayaz@htr-tech",
	display: "THE GREAT AYAZ",
	tagline: "cybersecurity, development, web design.",
	blurb: "An independent technology builder exploring cybersecurity, ethical hacking, web development, automation, open-source software, and digital product design.",
	github: "https://github.com/soloxayaz",
	handle: "@soloxayaz",
	formspree: "https://formspree.io/f/mvkgyqbg",
	accounts: [{
		user: "soloxayaz",
		label: "Ayaz Ahmad",
		url: "https://github.com/soloxayaz"
	}, {
		user: "htr-tech",
		label: "Tahmid Rayat",
		url: "https://github.com/htr-tech"
	}]
};
/** Rotating status lines under the hero (from the original boot log). */
var thoughts = [
	"security telemetry online.",
	"github profile fetched: @htr-tech.",
	"environment: linux / termux / web.",
	"primary research: tooling & automation.",
	"public repos: 10+ active toolkits."
];
var beliefs = [
	"Code builds the system. Assets measure the journey.",
	"Tools exist for education, awareness and authorized testing only.",
	"Experimentation and practical development belong together.",
	"Interfaces should have Linear and Apple level polish.",
	"Deep security exploration, full-stack development and digital assets, in one place."
];
var now = { items: [
	["environment", "Linux / Termux / Web"],
	["primary research", "Tooling & automation"],
	["public repos", "10+ active toolkits"],
	["primary stack", "Python / JS / Linux"],
	["community", "Open source"]
] };
var about = {
	lead: "A technology-focused builder with interests spanning cybersecurity, ethical hacking, web development, automation, open-source software and digital design.",
	body: "His work combines experimentation with practical development, from command-line utilities and security tooling to modern web interfaces and automated systems. All cybersecurity tooling, research projects and code authored by Ayaz is designed exclusively for controlled educational contexts, security awareness, defensive analysis and authorized security testing environments."
};
var focus = [
	{
		title: "Security awareness & tooling",
		body: "Educational command-line utilities that simulate credential workflows to demonstrate phishing attack vectors and increase user security awareness.",
		tags: [
			"Python",
			"Bash",
			"Phishing simulation"
		]
	},
	{
		title: "Linux environments & PRoot",
		body: "Mobile Linux research with Proot-Distro in Termux, enabling full desktop GUI deployments and modular setups on mobile hardware.",
		tags: [
			"Termux",
			"Ubuntu GUI",
			"Linux admin"
		]
	},
	{
		title: "Reverse engineering & cryptography",
		body: "Code obfuscation methods, Python reverse-engineering techniques, and cryptographic cipher decoders such as Vigenère.",
		tags: [
			"Obfuscation",
			"Cryptography",
			"Decompilation"
		]
	}
];
var nav = [
	{
		id: "work",
		label: "projects",
		to: "/work",
		blurb: "toolkits, utilities and web builds."
	},
	{
		id: "repos",
		label: "repos",
		to: "/repos",
		blurb: "every repository, set in type."
	},
	{
		id: "about",
		label: "about",
		to: "/about",
		blurb: "the builder, focus areas and a snapshot."
	},
	{
		id: "skills",
		label: "stack",
		to: "/skills",
		blurb: "languages, databases and infrastructure."
	},
	{
		id: "manifesto",
		label: "ethics",
		to: "/manifesto",
		blurb: "philosophy and ethical disclosure."
	},
	{
		id: "assets",
		label: "assets",
		to: "/assets",
		blurb: "portfolio monitor snapshot."
	},
	{
		id: "contact",
		label: "contact",
		to: "/contact",
		blurb: "security collaboration and open source."
	}
];
var categories = [
	"all",
	"tools",
	"security",
	"web"
];
var projects = [
	{
		id: "apex",
		index: "01",
		title: "soloxayaz-apex",
		year: "python",
		category: "tools",
		href: "https://github.com/soloxayaz/soloxayaz-apex",
		external: true,
		summary: "SOLOXAYAZ // APEX. One console, every surface, zero noise.",
		pattern: "radial"
	},
	{
		id: "terminal",
		index: "02",
		title: "ayaz-terminal",
		year: "python",
		category: "tools",
		href: "https://github.com/soloxayaz/ayaz-terminal",
		external: true,
		summary: "A lightweight terminal utility for Termux and Linux.",
		pattern: "grid"
	},
	{
		id: "lab",
		index: "03",
		title: "ayaz cybersecurity lab",
		year: "html",
		category: "web",
		href: "https://soloxayaz.github.io/",
		external: true,
		summary: "A personal cybersecurity-focused website and digital lab.",
		pattern: "lines"
	},
	{
		id: "airgorah",
		index: "04",
		title: "airgorah (fork)",
		year: "rust",
		category: "security",
		href: "https://github.com/soloxayaz/airgorah",
		external: true,
		summary: "Forked from martin-olivier/airgorah: WiFi security auditing software built around the aircrack-ng suite, for authorized testing.",
		pattern: "slash"
	},
	{
		id: "assets",
		index: "05",
		title: "asset dashboard",
		year: "web",
		category: "web",
		href: "/assets",
		summary: "A portfolio monitor with a baseline snapshot, holdings and a growth trend.",
		pattern: "wave"
	}
];
var skillGroups = [
	{
		id: "frontend",
		label: "frontend",
		items: [
			{
				name: "HTML5 / CSS3",
				hint: "Expert"
			},
			{
				name: "JavaScript ES6+",
				hint: "Advanced"
			},
			{
				name: "React / Next.js",
				hint: "Intermediate"
			},
			{
				name: "Tailwind CSS",
				hint: "Advanced"
			}
		]
	},
	{
		id: "backend",
		label: "backend",
		items: [
			{
				name: "Python",
				hint: "Advanced"
			},
			{
				name: "Node.js",
				hint: "Intermediate"
			},
			{
				name: "PHP",
				hint: "Intermediate"
			},
			{
				name: "REST APIs",
				hint: "Advanced"
			}
		]
	},
	{
		id: "data",
		label: "databases & baas",
		items: [
			{
				name: "SQLite",
				hint: "Intermediate"
			},
			{
				name: "Firebase / Firestore",
				hint: "Advanced"
			},
			{
				name: "Supabase",
				hint: "Intermediate"
			},
			{
				name: "JSON data store",
				hint: "Expert"
			}
		]
	},
	{
		id: "infra",
		label: "infrastructure",
		items: [
			{
				name: "Git & GitHub",
				hint: "Advanced"
			},
			{
				name: "Linux admin",
				hint: "Advanced"
			},
			{
				name: "Termux & PRoot",
				hint: "Expert"
			},
			{
				name: "Cloudflare",
				hint: "Intermediate"
			}
		]
	}
];
var stats = [
	{
		value: "10+",
		label: "active toolkits"
	},
	{
		value: "04",
		label: "focus areas"
	},
	{
		value: "Py/JS",
		label: "primary stack"
	},
	{
		value: "OSS",
		label: "community"
	}
];
/** Static baseline snapshot, copied from the reference site. Not live prices. */
var assets = {
	total: "$4,348,861.65",
	inr: "≈ ₹36,11,70,460",
	change: "+2.41%",
	changeNote: "+102,140.20 USDT today",
	largest: "USDT (94.0%)",
	largestNote: "stable liquidity reserve",
	holdings: [
		["USDT reserve", "4,089,300.16"],
		["BTC holding", "2.930000 BTC"],
		["ETH holding", "30.760000 ETH"]
	],
	motto: "Code builds the system. Assets measure the journey."
};
function IntroCurtain() {
	const { completeIntro } = useIntro();
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(completeIntro, 1680);
		return () => window.clearTimeout(t);
	}, [completeIntro]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: "fixed inset-0 z-intro flex flex-col items-center justify-center bg-ink",
		initial: { y: 0 },
		exit: {
			y: "-100%",
			transition: {
				duration: .7,
				ease: easeOut
			}
		},
		role: "dialog",
		"aria-label": "Intro",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "intro-copy mb-6 font-mono text-xs tracking-[0.22em] text-dim uppercase",
				children: "system online"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-5xl tracking-tight text-paper sm:text-7xl",
				children: site.display
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "intro-line mt-10 h-px w-16 origin-left bg-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: completeIntro,
				className: "absolute right-5 bottom-6 font-mono text-2xs tracking-[0.18em] text-dim uppercase hover:text-paper",
				children: "skip"
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function SiteHeader() {
	const { time, session, mounted } = useClock();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const active = nav.find((n) => pathname === n.to || pathname.startsWith(`${n.to}/`))?.id ?? "";
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("sticky top-0 z-40 transition-[background-color,border-color] duration-300 ease-out", scrolled ? "border-b border-line bg-ink" : "border-b border-transparent bg-ink/80"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-5 sm:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "font-mono text-sm tracking-tight text-paper transition-colors duration-200 hover:text-accent",
						children: site.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "main",
						className: "hidden shrink-0 items-center gap-1 lg:flex",
						children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							"aria-current": active === item.id ? "page" : void 0,
							className: cn("relative flex h-11 items-center px-3 font-mono text-xs tracking-[0.16em] uppercase transition-colors duration-200", active === item.id ? "text-paper" : "text-dim hover:text-paper"),
							children: [active === item.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								layoutId: "nav-underline",
								className: "absolute inset-x-3 bottom-2 h-px bg-accent",
								transition: {
									duration: .25,
									ease: easeOut
								}
							}), item.label]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "hidden shrink-0 font-mono text-2xs tracking-wide text-dim tabular-nums xl:block",
						children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							time,
							" · ",
							session
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "session --:--" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "relative flex size-11 items-center justify-center text-paper lg:hidden",
						"aria-expanded": open,
						"aria-label": open ? "Close menu" : "Open menu",
						onClick: () => setOpen((v) => !v),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative size-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-300", open ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-300", open ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})]
						})
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			className: "overflow-hidden border-t border-line bg-ink lg:hidden",
			initial: {
				height: 0,
				opacity: 0
			},
			animate: {
				height: "auto",
				opacity: 1
			},
			exit: {
				height: 0,
				opacity: 0
			},
			transition: {
				duration: .28,
				ease: easeOut
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col px-5 py-4",
				"aria-label": "mobile",
				children: nav.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: -8
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: {
						delay: .04 * i,
						duration: .3,
						ease: easeOut
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => setOpen(false),
						"aria-current": active === item.id ? "page" : void 0,
						className: cn("flex h-12 items-center justify-between font-display text-2xl", active === item.id ? "text-accent" : "text-paper"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-2xs text-dim",
							children: ["0", i + 1]
						})]
					})
				}, item.id))
			})
		}) })]
	});
}
function SiteFooter() {
	const { time, day, session, mounted, tod } = useClock();
	const loop = [...beliefs, ...beliefs];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative z-10 mt-8 border-t border-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden border-b border-line py-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "marquee-track flex w-max gap-10 whitespace-nowrap font-display text-xl text-dim italic sm:text-2xl",
				children: loop.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-10",
					children: [b, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-accent",
						"aria-hidden": "true",
						children: "/"
					})]
				}, `${b}-${i}`))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm text-paper",
					children: site.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 max-w-xs text-sm leading-relaxed text-dim",
					children: [
						"cybersecurity, development, web design and open source, as",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "link-draw text-paper",
							href: site.github,
							target: "_blank",
							rel: "noreferrer",
							children: site.handle
						}),
						"."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.16em] text-dim",
					children: [
						site.accounts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "link-draw w-fit text-paper",
							href: a.url,
							target: "_blank",
							rel: "noreferrer",
							children: ["github · ", a.user]
						}, a.user)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "link-draw w-fit text-paper",
							to: "/void",
							children: "void"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "link-draw w-fit text-left text-paper",
							onClick: () => window.scrollTo({
								top: 0,
								behavior: "smooth"
							}),
							children: "back to top"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-xs leading-relaxed text-dim tabular-nums md:text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: mounted ? `${time} ${day}` : "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["session ", mounted ? session : "--:--"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["palette ", mounted ? tod : "—"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4",
							children: "educational use · authorized testing only"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "keys: g then h / w / r / n / s / m / a / j"
						})
					]
				})
			]
		})]
	});
}
var INTRO_KEY = "ap-intro";
/** `g` then a letter jumps between pages. */
var KEYMAP = {
	h: "/",
	w: "/work",
	n: "/about",
	s: "/skills",
	r: "/repos",
	m: "/manifesto",
	a: "/assets",
	j: "/contact",
	v: "/void"
};
/**
* Mounted once in the root route, so the ambient glow, header, footer and intro
* persist across pages. Only the page content inside swaps (and animates in).
*/
function PageShell({ children }) {
	const reduced = usePrefersReducedMotion();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [showIntro, setShowIntro] = (0, import_react.useState)(() => pathname === "/");
	const firstRender = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		firstRender.current = false;
	}, []);
	const completeIntro = (0, import_react.useCallback)(() => {
		try {
			sessionStorage.setItem(INTRO_KEY, "1");
		} catch {}
		setShowIntro(false);
	}, []);
	(0, import_react.useEffect)(() => {
		let seen = false;
		try {
			seen = sessionStorage.getItem(INTRO_KEY) === "1";
		} catch {
			seen = false;
		}
		if (reduced || seen) setShowIntro(false);
	}, [reduced]);
	(0, import_react.useEffect)(() => {
		if (!showIntro) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [showIntro]);
	(0, import_react.useEffect)(() => {
		let g = 0;
		const onKey = (e) => {
			const t = e.target;
			if (!t) return;
			if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable) return;
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (g && Date.now() - g < 1200) {
				const to = KEYMAP[e.key];
				if (to) {
					if (window.location.pathname === to) window.scrollTo({
						top: 0,
						behavior: reduced ? "auto" : "smooth"
					});
					else navigate({ to });
				}
				g = 0;
			} else if (e.key === "g") g = Date.now();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [navigate, reduced]);
	const ctx = (0, import_react.useMemo)(() => ({
		showIntro,
		ready: !showIntro,
		completeIntro
	}), [showIntro, completeIntro]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IntroContext.Provider, {
		value: ctx,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ambient, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showIntro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntroCurtain, {}, "intro") : null }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: firstRender.current || reduced ? false : {
							opacity: 0,
							y: 14
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .5,
							ease: easeOut
						},
						children
					}, pathname),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
				]
			})
		]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function NotFound() {
	const [n, setN] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-[0.2em] text-dim uppercase",
				children: "lost"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-7xl tracking-tight text-paper sm:text-8xl",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-2xl text-paper italic sm:text-3xl",
				children: "this page escaped."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setN((v) => v + 1),
				className: "mt-10 max-w-lg text-left font-mono text-sm leading-relaxed text-dim",
				children: [
					"$ locate requested_page",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"result: not found",
					n >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}), "...it's not coming back. try /void"] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "link-draw mt-10 w-fit font-mono text-xs tracking-[0.16em] text-paper uppercase",
				children: "return home"
			})
		]
	});
}
var styles_default = "/assets/styles-QhAvNzw6.css";
var APP_NAME = "THE GREAT AYAZ — Cybersecurity • Development • Web Design";
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Portfolio of Ayaz — cybersecurity enthusiast, ethical hacking learner, web developer, designer, and open-source builder."
			},
			{
				name: "theme-color",
				content: "#0f1216"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Outfit:wght@400;500;600&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	notFoundComponent: NotFound,
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-ink text-paper",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$10 = () => import("./routes-Ci8TZ7R_.mjs");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
/** Old single-page anchors (/#work …) now live on their own pages. */
var $$splitComponentImporter$9 = () => import("./about-NquRC0FL.mjs");
var Route$9 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "about · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin-Bo_7KNMF.mjs");
var Route$8 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./assets-CE_3_r56.mjs");
var Route$7 = createFileRoute("/assets")({
	head: () => ({ meta: [{ title: "assets · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./contact-BBk9TzJ_.mjs");
var Route$6 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "contact · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./manifesto-CZp5gxtO.mjs");
var Route$5 = createFileRoute("/manifesto")({
	head: () => ({ meta: [{ title: "manifesto · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./repos-CSAykfYU.mjs");
var Route$4 = createFileRoute("/repos")({
	head: () => ({ meta: [{ title: "repos · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./skills-BzPdiRsf.mjs");
var Route$3 = createFileRoute("/skills")({
	head: () => ({ meta: [{ title: "skills · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./void-CsJrMUE2.mjs");
var Route$2 = createFileRoute("/void")({
	head: () => ({ meta: [{ title: "void · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./work-CqNaKHCw.mjs");
var Route$1 = createFileRoute("/work")({
	head: () => ({ meta: [{ title: "work · the great ayaz" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.login-DuHj-N6M.mjs");
var Route = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var AboutRoute = Route$9.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$11
});
var AdminRoute = Route$8.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$11
});
var AssetsRoute = Route$7.update({
	id: "/assets",
	path: "/assets",
	getParentRoute: () => Route$11
});
var ContactRoute = Route$6.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$11
});
var ManifestoRoute = Route$5.update({
	id: "/manifesto",
	path: "/manifesto",
	getParentRoute: () => Route$11
});
var ReposRoute = Route$4.update({
	id: "/repos",
	path: "/repos",
	getParentRoute: () => Route$11
});
var SkillsRoute = Route$3.update({
	id: "/skills",
	path: "/skills",
	getParentRoute: () => Route$11
});
var VoidRoute = Route$2.update({
	id: "/void",
	path: "/void",
	getParentRoute: () => Route$11
});
var WorkRoute = Route$1.update({
	id: "/work",
	path: "/work",
	getParentRoute: () => Route$11
});
var AdminRouteChildren = { AdminLoginRoute: Route.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AssetsRoute,
	ContactRoute,
	ManifestoRoute,
	ReposRoute,
	SkillsRoute,
	VoidRoute,
	WorkRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultPreload: "intent",
		scrollRestoration: true,
		scrollRestorationBehavior: "instant"
	});
}
//#endregion
export { useIntro as _, beliefs as a, nav as c, site as d, skillGroups as f, useClock as g, easeOut as h, assets as i, now as l, thoughts as m, cn as n, categories as o, stats as p, about as r, focus as s, router_exports as t, projects as u };
