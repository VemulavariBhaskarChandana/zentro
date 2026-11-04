import { CatalogStatus } from "@/components/catalog-status";
import { PlatformShell } from "@/components/platform-shell";
import { ProjectBrowser } from "@/components/project-browser";
import { getProjects } from "@/lib/project-catalog";
import { requireUser } from "@/lib/auth";

export const instant = false;

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/projects">) {
  await requireUser();
  const query = await searchParams;
  const result = await getProjects();
  const initialProjectType =
    typeof query.projectType === "string" &&
    ["Basic", "Mini", "Major"].includes(query.projectType)
      ? query.projectType
      : "";
  const initialDifficulty =
    typeof query.difficulty === "string" &&
    ["Beginner", "Intermediate", "Advanced"].includes(query.difficulty)
      ? query.difficulty
      : "";

  return (
    <PlatformShell>
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#454545]">
          Find your next learning step
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
          All Projects
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#666666] sm:text-base">
          Explore the full project catalog, or narrow it to major projects and
          advanced challenges.
        </p>
      </div>
      {result.status === "ready" ? (
        result.data.length ? (
          <ProjectBrowser
            initialDifficulty={initialDifficulty}
            initialProjectType={initialProjectType}
            projects={result.data}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e4e4e2] bg-[#fcfcfb] p-8 text-center">
            <h2 className="font-semibold">No projects published yet</h2>
            <p className="mt-2 text-sm text-[#666666]">
              Projects will appear here when the catalog is ready.
            </p>
          </div>
        )
      ) : (
        <CatalogStatus result={result} itemName="projects" />
      )}
    </PlatformShell>
  );
}
