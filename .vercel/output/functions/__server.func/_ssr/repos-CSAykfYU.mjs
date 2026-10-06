import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ArrowUpRight, r as Search } from "../_libs/lucide-react.mjs";
import { a as LayoutGroup, o as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { h as easeOut, n as cn } from "./router-Cwe6vTA2.mjs";
import { n as SectionLabel, t as Reveal } from "./reveal-DeWCTacy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/repos-CSAykfYU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var owners = ["soloxayaz", "htr-tech"];
var ownerLabels = {
	soloxayaz: "Ayaz Ahmad",
	"htr-tech": "Tahmid Rayat"
};
var r = (owner, name, desc, lang, stars = 0, extra = {}) => ({
	owner,
	name,
	desc,
	lang,
	stars,
	url: `https://github.com/${owner}/${name}`,
	...extra
});
/** Snapshot of what was visible at build time. The page refreshes it from GitHub in the browser. */
var staticRepos = [
	r("soloxayaz", "ayaz-terminal", "A lightweight terminal utility for Termux and Linux.", "Python", 1),
	r("soloxayaz", "airgorah", "A WiFi security auditing software mainly based on aircrack-ng tools suite.", "Rust", 0, { fork: true }),
	r("soloxayaz", "soloxayaz.github.io", "Personal cybersecurity website and digital lab.", "HTML"),
	r("soloxayaz", "soloxayaz", "GitHub profile README.", null),
	r("soloxayaz", "soloxayaz-apex", "SOLOXAYAZ // APEX. One Console. Every Surface. Zero Noise.", "Python"),
	r("soloxayaz", "htr-tech", "SOLOXAYAZ // APEX. One Console. Every Surface. Zero Noise.", "HTML"),
	r("htr-tech", "zphisher", "An automated phishing tool with 30+ templates, made for educational purposes only.", "HTML", 16900),
	r("modded-ubuntu", "modded-ubuntu", "Run Ubuntu GUI on your Termux with many features.", "Shell", 1200),
	r("hax0rtahm1d", "Reverse-Engineering", "Reverse-engineered tools, count 119.", "Python", 547),
	r("htr-tech", "PyObfuscate", "Simple Python code obfuscator. Supports python2 and python3.", "Python", 180),
	r("htr-tech", "Vigenere-Decoder", "Decode or brute-force Vigenere cipher text using the flag format.", "Python", 42),
	r("htr-tech", "0xTwin", "Twin-Hex cipher encoder and decoder.", "Python", 23),
	r("htr-tech", "public.repo", "Collection of codes.", "Shell", 54),
	r("htr-tech", "htr-tech", "GitHub profile README.", null, 212),
	r("htr-tech", "host", "Temporarily host files from your device.", null),
	r("htr-tech", "fake-mailer", "Mail sender script.", "Python", 315, { archived: true }),
	r("htr-tech", "GithubStat", "A simple GitHub user statistics meter based on the GitHub API.", "Python", 18),
	r("htr-tech", "SPA-AI-Practise", "A minimalist single page app in vanilla JS and CSS, built solely with AI.", "JavaScript", 5),
	r("htr-tech", "monad", "Random userscripts and contracts.", "JavaScript", 6, { archived: true }),
	r("htr-tech", "nexphisher", "Terminal tool for Linux and Termux.", null, 0, { archived: true }),
	r("htr-tech", "track-ip", "", null, 0, { archived: true }),
	r("htr-tech", "haxorbd", "", null),
	r("htr-tech", "pakcrack", "", null),
	r("htr-tech", "afgcrack", "", null),
	r("htr-tech", "indocrack", "", null),
	r("htr-tech", "termux-login", "Termux login security tool.", null),
	r("htr-tech", "termux-shell", "", null),
	r("htr-tech", "unfollow-plus", "Instagram unfollower bot written in bash.", "Shell"),
	r("htr-tech", "bash2mp4", "", null)
];
var keyOf = (x) => `${x.owner}/${x.name}`.toLowerCase();
/** Fetch every public repo for the given users, then merge over the snapshot. */
async function loadLiveRepos(signal) {
	const live = [];
	for (const user of owners) for (let page = 1; page <= 4; page++) {
		const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&page=${page}&sort=pushed`, {
			signal,
			headers: { Accept: "application/vnd.github+json" }
		});
		if (!res.ok) throw new Error(`GitHub ${res.status}`);
		const rows = await res.json();
		for (const x of rows) live.push({
			owner: x.owner.login,
			name: x.name,
			desc: x.description ?? "",
			lang: x.language,
			stars: x.stargazers_count,
			archived: x.archived,
			fork: x.fork,
			url: x.html_url,
			pushed: x.pushed_at ?? void 0
		});
		if (rows.length < 100) break;
	}
	const liveKeys = new Set(live.map(keyOf));
	return [...live, ...staticRepos.filter((s) => !liveKeys.has(keyOf(s)))];
}
var GLYPHS = "!<>-_\\/[]{}=+*^?#0123456789abcdef";
var groupOf = (r) => r.owner === "soloxayaz" ? "soloxayaz" : "htr-tech";
var fmt = (n) => n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}k` : String(n);
/** Letters decode from noise to the real name each time the row is hovered or focused. */
function useScramble(text, reduced) {
	const [out, setOut] = (0, import_react.useState)(text);
	const raf = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		setOut(text);
		return () => cancelAnimationFrame(raf.current);
	}, [text]);
	return [out, (0, import_react.useCallback)(() => {
		if (reduced) return;
		cancelAnimationFrame(raf.current);
		const t0 = performance.now();
		const dur = 520;
		const tick = (t) => {
			const p = Math.min(1, (t - t0) / dur);
			const next = [...text].map((ch, i) => i < p * text.length * 1.15 ? ch : GLYPHS[Math.floor(Math.random() * 33)]).join("");
			setOut(p < 1 ? next : text);
			if (p < 1) raf.current = requestAnimationFrame(tick);
		};
		raf.current = requestAnimationFrame(tick);
	}, [text, reduced])];
}
function Count({ to }) {
	const reduced = useReducedMotion();
	const [n, setN] = (0, import_react.useState)(0);
	const prev = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (reduced) {
			setN(to);
			prev.current = to;
			return;
		}
		const from = prev.current;
		const t0 = performance.now();
		let raf = 0;
		const tick = (t) => {
			const p = Math.min(1, (t - t0) / 800);
			setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
			if (p < 1) raf = requestAnimationFrame(tick);
			else prev.current = to;
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [to, reduced]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fmt(n) });
}
function Row({ repo, index, open, onToggle, reduced }) {
	const [shown, scramble] = useScramble(repo.name, reduced);
	const pushed = repo.pushed ? new Date(repo.pushed).toLocaleDateString([], {
		year: "numeric",
		month: "short"
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "border-b border-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-expanded": open,
			onClick: onToggle,
			onMouseEnter: scramble,
			onFocus: scramble,
			className: "type-row group grid w-full items-baseline gap-x-6 gap-y-2 py-6 text-left sm:grid-cols-[3rem_1fr_auto]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-accent tabular-nums",
					children: String(index + 1).padStart(2, "0")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-display text-4xl leading-[0.95] tracking-tight text-paper [overflow-wrap:anywhere] sm:text-6xl md:text-7xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: repo.name
					}), [...shown].map((ch, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: "ch",
						style: { "--i": k },
						children: ch
					}, k))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-2xs tracking-[0.14em] text-dim uppercase sm:text-right",
					children: [
						repo.lang ?? "no language",
						" · ★ ",
						fmt(repo.stars)
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "overflow-hidden",
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
					duration: reduced ? 0 : .3,
					ease: easeOut
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 pb-8 sm:grid-cols-[3rem_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "aria-hidden": "true" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xl text-base leading-relaxed text-paper",
							children: repo.desc || "No description on GitHub."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-wide text-dim",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [repo.owner, ownerLabels[repo.owner] ? ` · ${ownerLabels[repo.owner]}` : ""] }),
								repo.fork && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "fork" }),
								repo.archived && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "archived" }),
								pushed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["last push ", pushed] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: repo.url,
							target: "_blank",
							rel: "noreferrer",
							className: "link-draw mt-6 inline-flex w-fit items-center gap-2 font-mono text-xs tracking-[0.16em] text-accent uppercase",
							children: ["open on github", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
						})
					] })]
				})
			})
		})]
	});
}
function ReposBoard() {
	const reduced = Boolean(useReducedMotion());
	const [repos, setRepos] = (0, import_react.useState)(staticRepos);
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [group, setGroup] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("stars");
	const [q, setQ] = (0, import_react.useState)("");
	const [openKey, setOpenKey] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const ac = new AbortController();
		loadLiveRepos(ac.signal).then((list) => {
			setRepos(list);
			setStatus("live");
		}).catch(() => {
			if (!ac.signal.aborted) setStatus("snapshot");
		});
		return () => ac.abort();
	}, []);
	const visible = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return repos.filter((r) => (group === "all" || groupOf(r) === group) && r.name.toLowerCase().includes(needle)).sort((a, b) => sort === "stars" ? b.stars - a.stars || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
	}, [
		repos,
		group,
		sort,
		q
	]);
	const count = (g) => repos.filter((r) => g === "all" || groupOf(r) === g).length;
	const stars = repos.reduce((n, r) => n + r.stars, 0);
	const names = (0, import_react.useMemo)(() => repos.map((r) => r.name), [repos]);
	const loop = [...names, ...names];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "repos",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					index: "02",
					children: "repositories"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "type-row font-display text-6xl leading-none tracking-tight text-paper italic sm:text-8xl",
						children: [[..."every repo."].map((ch, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "ch",
							style: { "--i": k },
							children: ch === " " ? "\xA0" : ch
						}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "every repo."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-xl text-sm leading-relaxed text-dim",
						children: "Public repositories from github.com/soloxayaz and github.com/htr-tech. Hover a name to decode it, tap to open the details."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: cn("mt-3 font-mono text-[11px] tracking-[0.14em] uppercase", status === "live" ? "text-accent" : "text-dim"),
						children: status === "live" ? "live from github" : status === "loading" ? "syncing with github…" : "offline snapshot · may be incomplete"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line md:grid-cols-4",
					children: [
						["repositories", repos.length],
						["soloxayaz", count("soloxayaz")],
						["htr-tech", count("htr-tech")],
						["stars", stars]
					].map(([label, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-ink px-5 py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl tracking-tight text-paper tabular-nums sm:text-4xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Count, { to: n })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-mono text-[11px] tracking-[0.16em] text-dim uppercase",
							children: label
						})]
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "marquee-pause my-12 space-y-2 overflow-hidden",
					"aria-hidden": "true",
					children: [false, true].map((rev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("marquee-track outline-type flex w-max gap-8 font-display text-5xl whitespace-nowrap sm:text-7xl", rev && "marquee-rev"),
							children: (rev ? [...loop].reverse() : loop).map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n }, `${n}-${i}`))
						})
					}, String(rev)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						role: "tablist",
						"aria-label": "Filter by account",
						children: [
							"all",
							"soloxayaz",
							"htr-tech"
						].map((g) => {
							const on = group === g;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "tab",
								"aria-selected": on,
								onClick: () => setGroup(g),
								className: cn("relative h-11 min-w-11 overflow-hidden rounded-full px-4 font-mono text-2xs tracking-[0.16em] uppercase transition-colors duration-200", on ? "text-ink" : "text-dim hover:text-paper"),
								children: [on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: reduced ? void 0 : "repo-pill",
									className: "absolute inset-0 rounded-full bg-paper",
									transition: {
										duration: .28,
										ease: easeOut
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative z-10",
									children: g
								})]
							}, g);
						})
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 border-b border-line focus-within:border-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "size-4 text-dim",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "search repos",
								"aria-label": "Search repositories",
								className: "w-40 bg-transparent font-mono text-xs text-paper outline-none placeholder:text-dim/70"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSort((s) => s === "stars" ? "name" : "stars"),
							className: "h-11 font-mono text-2xs tracking-[0.16em] text-dim uppercase hover:text-paper",
							children: ["sort: ", sort === "stars" ? "stars" : "a–z"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 font-mono text-[11px] tracking-[0.14em] text-dim uppercase",
					children: [
						"showing ",
						visible.length,
						" of ",
						repos.length
					]
				}),
				visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "border-t border-line py-10 font-display text-2xl text-paper italic",
					children: [
						"No repository matches “",
						q,
						"”.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setQ(""),
							className: "link-draw font-mono text-xs not-italic tracking-[0.16em] text-accent uppercase",
							children: "clear search"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "border-t border-line",
					children: visible.map((r, i) => {
						const key = `${r.owner}/${r.name}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							repo: r,
							index: i,
							reduced,
							open: openKey === key,
							onToggle: () => setOpenKey((k) => k === key ? null : key)
						}, key);
					})
				})
			]
		})
	});
}
function ReposPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReposBoard, {}) });
}
//#endregion
export { ReposPage as component };
