import { supabase } from "@/lib/supabase";

export const ADMIN_EMAIL = "ahmadayaz0704@gmail.com";

export type AdminProject = {
  id: string;
  project_index: string;
  title: string;
  project_type: string;
  category: string;
  href: string;
  external: boolean;
  summary: string;
  pattern: string;
  published: boolean;
};

export type AdminSkill = {
  id: number;
  group_key: string;
  group_label: string;
  skill_name: string;
  level: string;
  sort_order: number;
  published: boolean;
};

export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Check your environment variables."
    );
  }

  return supabase;
}

export async function getSession() {
  const client = getSupabase();

  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session ?? null;
}

export async function signIn(email: string, password: string) {
  const client = getSupabase();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const client = getSupabase();
  await client.auth.signOut();
}

export function isAdminEmail(email: string | null | undefined) {
  return (
    !!email &&
    email.trim().toLowerCase() === ADMIN_EMAIL
  );
}

export async function getProjects() {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .select(
      "id, project_index, title, project_type, category, href, external, summary, pattern, published"
    )
    .order("project_index", { ascending: true });

  if (error) throw error;

  return (data ?? []) as AdminProject[];
}

export async function insertProject(
  project: Omit<AdminProject, "id">
) {
  const client = getSupabase();

  // portfolio_projects.id is a required text primary key.
  const row = {
    ...project,
    id: crypto.randomUUID(),
  };

  const { data, error } = await client
    .from("portfolio_projects")
    .insert(row)
    .select()
    .single();

  if (error) throw error;

  return data as AdminProject;
}

export async function editProject(
  id: string,
  project: Partial<Omit<AdminProject, "id">>
) {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as AdminProject;
}

export async function removeProject(id: string) {
  const client = getSupabase();

  const { error } = await client
    .from("portfolio_projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getSkills() {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .select(
      "id, group_key, group_label, skill_name, level, sort_order, published"
    )
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []) as AdminSkill[];
}

export async function insertSkill(
  skill: Omit<AdminSkill, "id">
) {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .insert(skill)
    .select()
    .single();

  if (error) throw error;

  return data as AdminSkill;
}

export async function editSkill(
  id: number,
  skill: Partial<Omit<AdminSkill, "id">>
) {
  const client = getSupabase();

  const { data, error } = await client
    .from("portfolio_skills")
    .update(skill)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as AdminSkill;
}

export async function removeSkill(id: number) {
  const client = getSupabase();

  const { error } = await client
    .from("portfolio_skills")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
