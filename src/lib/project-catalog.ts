import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export type ProjectCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  build_examples: string;
  technologies: string[];
  icon: string;
  project_count?: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  project_type: "Basic" | "Mini" | "Major";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  technologies: string[];
  overview: string;
  problem_solved: string;
  how_it_works: string;
  real_world_application: string;
  main_features: string[];
  frontend_technologies: string[];
  backend_technologies: string[];
  database_technologies: string[];
  other_tools: string[];
  technology_explanations: Record<string, string>;
  learning_outcomes: string[];
  suggested_duration: string;
  category: Pick<ProjectCategory, "slug" | "name" | "icon">;
};

export type CatalogResult<T> =
  | { status: "ready"; data: T }
  | { status: "unconfigured"; data: [] }
  | { status: "error"; data: []; message: string };

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function getProjectCategories(): Promise<
  CatalogResult<ProjectCategory[]>
> {
  if (!isConfigured()) return { status: "unconfigured", data: [] };
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { status: "unconfigured", data: [] };

  const { data, error } = await supabase
    .from("project_categories")
    .select(
      "id, slug, name, description, build_examples, technologies, icon, projects(count)",
    )
    .order("name")
    .eq("projects.published", true)
    .returns<
      Array<
        ProjectCategory & {
          projects: Array<{ count: number }>;
        }
      >
    >();

  if (error) {
    console.error("Could not load project categories:", error.message);
    return {
      status: "error",
      data: [],
      message:
        "We couldn’t load project categories. Check the Supabase catalog migration and try again.",
    };
  }

  return {
    status: "ready",
    data: data.map(({ projects, ...category }) => ({
      ...category,
      project_count: projects[0]?.count ?? 0,
    })),
  };
}

export async function getProjects(filters?: {
  categorySlug?: string;
  projectType?: string;
  difficulty?: string;
}): Promise<CatalogResult<Project[]>> {
  if (!isConfigured()) return { status: "unconfigured", data: [] };
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { status: "unconfigured", data: [] };

  let query = supabase
    .from("projects")
    .select(
      `id, slug, title, short_description, project_type, difficulty, technologies, overview, problem_solved, how_it_works, real_world_application, main_features, frontend_technologies, backend_technologies, database_technologies, other_tools, technology_explanations, learning_outcomes, suggested_duration, category:project_categories${filters?.categorySlug ? "!inner" : ""}(slug, name, icon)`,
    )
    .eq("published", true)
    .order("title");

  if (filters?.categorySlug) {
    query = query.eq("category.slug", filters.categorySlug);
  }
  if (filters?.projectType) {
    query = query.eq("project_type", filters.projectType);
  }
  if (filters?.difficulty) {
    query = query.eq("difficulty", filters.difficulty);
  }

  const { data, error } = await query.returns<Project[]>();
  if (error) {
    console.error("Could not load projects:", error.message);
    return {
      status: "error",
      data: [],
      message:
        "We couldn’t load projects. Check the Supabase catalog migration and try again.",
    };
  }

  return { status: "ready", data };
}

export async function getProjectCategoryBySlug(slug: string) {
  const categories = await getProjectCategories();
  if (categories.status !== "ready") return categories;
  const category = categories.data.find((item) => item.slug === slug);
  return category
    ? { status: "ready" as const, data: category }
    : { status: "not-found" as const, data: null };
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  if (projects.status !== "ready") return projects;
  const project = projects.data.find((item) => item.slug === slug);
  return project
    ? { status: "ready" as const, data: project }
    : { status: "not-found" as const, data: null };
}
