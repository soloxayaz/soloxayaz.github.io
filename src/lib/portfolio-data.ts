import {
  projects as fallbackProjects,
  skillGroups as fallbackSkillGroups,
  type Project,
} from "@/lib/content";
import { supabase } from "@/lib/supabase";

type ProjectRow = {
  id: string;
  project_index: string;
  title: string;
  project_type: string;
  category: Project["category"];
  href: string;
  external: boolean;
  summary: string;
  pattern: Project["pattern"];
};

type SkillRow = {
  id: number;
  group_key: string;
  group_label: string;
  skill_name: string;
  level: string;
  sort_order: number;
};

export async function fetchProjects(): Promise<Project[]> {
  if (!supabase) return fallbackProjects;

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(
      "id, project_index, title, project_type, category, href, external, summary, pattern",
    )
    .eq("published", true)
    .order("project_index", { ascending: true });

  if (error || !data?.length) return fallbackProjects;

  return (data as ProjectRow[]).map((row) => ({
    id: row.id,
    index: row.project_index,
    title: row.title,
    year: row.project_type,
    category: row.category,
    href: row.href,
    external: row.external,
    summary: row.summary,
    pattern: row.pattern,
  }));
}

export async function fetchSkillGroups(): Promise<typeof fallbackSkillGroups> {
  if (!supabase) return fallbackSkillGroups;

  const { data, error } = await supabase
    .from("portfolio_skills")
    .select(
      "id, group_key, group_label, skill_name, level, sort_order",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallbackSkillGroups;

  const rows = data as SkillRow[];

  return ["frontend", "backend", "data", "infra"].map((groupKey) => {
    const groupRows = rows.filter((row) => row.group_key === groupKey);
    const fallback = fallbackSkillGroups.find((group) => group.id === groupKey);

    return {
      id: groupKey,
      label: groupRows[0]?.group_label ?? fallback?.label ?? groupKey,
      items:
        groupRows.length > 0
          ? groupRows.map((row) => ({
              name: row.skill_name,
              hint: row.level,
            }))
          : (fallback?.items ?? []),
    };
  }) as typeof fallbackSkillGroups;
}
