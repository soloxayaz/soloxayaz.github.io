import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useReducedMotion } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
import { f as skillGroups, h as easeOut } from "./router-Cwe6vTA2.mjs";
import { n as SectionLabel, t as Reveal } from "./reveal-DeWCTacy.mjs";
import { t as supabase } from "./supabase-B1UUYl23.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skills-BzPdiRsf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function fetchSkillGroups() {
	if (!supabase) return skillGroups;
	const { data, error } = await supabase.from("portfolio_skills").select("id, group_key, group_label, skill_name, level, sort_order").eq("published", true).order("sort_order", { ascending: true });
	if (error || !data?.length) return skillGroups;
	const rows = data;
	return [
		"frontend",
		"backend",
		"data",
		"infra"
	].map((groupKey) => {
		const groupRows = rows.filter((row) => row.group_key === groupKey);
		const fallback = skillGroups.find((group) => group.id === groupKey);
		return {
			id: groupKey,
			label: groupRows[0]?.group_label ?? fallback?.label ?? groupKey,
			items: groupRows.length > 0 ? groupRows.map((row) => ({
				name: row.skill_name,
				hint: row.level
			})) : fallback?.items ?? []
		};
	});
}
function Skills() {
	const reduced = useReducedMotion();
	const [skillGroups$1, setSkillGroups] = (0, import_react.useState)(skillGroups);
	(0, import_react.useEffect)(() => {
		let active = true;
		fetchSkillGroups().then((remoteGroups) => {
			if (active && remoteGroups.length > 0) setSkillGroups(remoteGroups);
		});
		return () => {
			active = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "skills",
		className: "relative z-10 px-5 py-24 sm:px-8 md:py-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					index: "04",
					children: "tech stack"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-14 max-w-lg font-display text-3xl text-paper italic sm:text-4xl",
					children: "languages, frameworks, databases and environments used across projects."
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-10 sm:grid-cols-2 lg:grid-cols-4",
					children: skillGroups$1.map((group, gi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
						delay: gi * .08,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-5 font-mono text-xs tracking-[0.2em] text-accent uppercase",
							children: group.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: group.items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
								className: "group flex items-baseline justify-between gap-4 border-b border-line py-3",
								initial: reduced ? false : {
									opacity: 0,
									x: -8
								},
								whileInView: {
									opacity: 1,
									x: 0
								},
								viewport: { once: true },
								transition: {
									delay: .04 * i,
									duration: .4,
									ease: easeOut
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl text-paper",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "max-w-[50%] text-right font-mono text-[11px] tracking-wide text-dim transition-colors duration-200 group-hover:text-accent",
									children: item.hint
								})]
							}, item.name))
						})]
					}, group.id))
				})
			]
		})
	});
}
function SkillsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skills, {}) });
}
//#endregion
export { SkillsPage as component };
