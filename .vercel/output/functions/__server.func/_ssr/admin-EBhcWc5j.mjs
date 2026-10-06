import { t as supabase } from "./supabase-B1UUYl23.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-EBhcWc5j.js
var configuredAdminEmail = "ahmadayaz0704@gmail.com".trim().toLowerCase() || "";
function getSupabase() {
	if (!supabase) throw new Error("Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
	return supabase;
}
async function getCurrentUser() {
	const { data, error } = await getSupabase().auth.getUser();
	if (error) return null;
	return data.user ?? null;
}
async function isAdmin() {
	const user = await getCurrentUser();
	if (!user) return false;
	if (!configuredAdminEmail) return false;
	return user.email?.trim().toLowerCase() === configuredAdminEmail;
}
async function signIn(email, password) {
	const { data, error } = await getSupabase().auth.signInWithPassword({
		email,
		password
	});
	if (error) throw error;
	return data;
}
async function signOut() {
	await getSupabase().auth.signOut();
}
async function getProjects() {
	const { data, error } = await getSupabase().from("portfolio_projects").select("id, project_index, title, project_type, category, href, external, summary, pattern, published").order("project_index", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function insertProject(project) {
	const { data, error } = await getSupabase().from("portfolio_projects").insert(project).select().single();
	if (error) throw error;
	return data;
}
async function editProject(id, project) {
	const { data, error } = await getSupabase().from("portfolio_projects").update(project).eq("id", id).select().single();
	if (error) throw error;
	return data;
}
async function removeProject(id) {
	const { error } = await getSupabase().from("portfolio_projects").delete().eq("id", id);
	if (error) throw error;
}
async function getSkills() {
	const { data, error } = await getSupabase().from("portfolio_skills").select("id, group_key, group_label, skill_name, level, sort_order, published").order("sort_order", { ascending: true });
	if (error) throw error;
	return data ?? [];
}
async function insertSkill(skill) {
	const { data, error } = await getSupabase().from("portfolio_skills").insert(skill).select().single();
	if (error) throw error;
	return data;
}
async function editSkill(id, skill) {
	const { data, error } = await getSupabase().from("portfolio_skills").update(skill).eq("id", id).select().single();
	if (error) throw error;
	return data;
}
async function removeSkill(id) {
	const { error } = await getSupabase().from("portfolio_skills").delete().eq("id", id);
	if (error) throw error;
}
//#endregion
export { getSkills as a, isAdmin as c, signIn as d, signOut as f, getProjects as i, removeProject as l, editSkill as n, insertProject as o, getCurrentUser as r, insertSkill as s, editProject as t, removeSkill as u };
