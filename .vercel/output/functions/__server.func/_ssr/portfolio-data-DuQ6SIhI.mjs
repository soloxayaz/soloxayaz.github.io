import { f as skillGroups, u as projects } from "./router-CK2uAlZd.mjs";
import { t as supabase } from "./supabase-B1UUYl23.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portfolio-data-DuQ6SIhI.js
async function fetchProjects() {
	if (!supabase) return projects;
	const { data, error } = await supabase.from("portfolio_projects").select("id, project_index, title, project_type, category, href, external, summary, pattern").eq("published", true).order("project_index", { ascending: true });
	if (error || !data?.length) return projects;
	return data.map((row) => ({
		id: row.id,
		index: row.project_index,
		title: row.title,
		year: row.project_type,
		category: row.category,
		href: row.href,
		external: row.external,
		summary: row.summary,
		pattern: row.pattern
	}));
}
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
//#endregion
export { fetchSkillGroups as n, fetchProjects as t };
