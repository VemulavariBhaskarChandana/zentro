import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CatalogStatus } from "@/components/catalog-status";
import { PlatformShell } from "@/components/platform-shell";
import { ProjectCard } from "@/components/project-card";
import {
  getProjectCategoryBySlug,
  getProjects,
} from "@/lib/project-catalog";
import { requireUser } from "@/lib/auth";

export const instant = false;

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireUser();
  const { slug } = await params;
  const [categoryResult, projectResult] = await Promise.all([
    getProjectCategoryBySlug(slug),
    getProjects({ categorySlug: slug }),
  ]);

  if (categoryResult.status === "not-found") notFound();

  return (
    <PlatformShell>
      <Link
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#555555] no-underline hover:underline"
        href="/categories"
      >
        <ArrowLeft size={16} />
        All categories
      </Link>
      {categoryResult.status !== "ready" ? (
        <CatalogStatus result={categoryResult} itemName="category details" />
      ) : (
        <>
          <section className="rounded-[1.65rem] border border-[#e4e4e2] bg-[#f4f4f2] p-6 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#454545]">
              {categoryResult.data.name}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              What is this technology?
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#666666] sm:text-base">
              {categoryResult.data.name}: {categoryResult.data.description}
            </p>
            <div className="mt-6 grid gap-4 border-t border-[#e4e4e2] pt-5 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold">What can you build?</h2>
                <p className="mt-1 text-sm leading-6 text-[#666666]">
                  {categoryResult.data.build_examples}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold">Common tools</h2>
                <p className="mt-2 flex flex-wrap gap-2">
                  {categoryResult.data.technologies.map((technology) => (
                    <span
                      className="rounded-full border border-[#e4e4e2] bg-[#f7f7f6] px-3 py-1 text-xs font-medium text-[#555555]"
                      key={technology}
                    >
                      {technology}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-9">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#454545]">
                Pick a starting point
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                Projects in {categoryResult.data.name}
              </h2>
            </div>
            {projectResult.status === "ready" ? (
              projectResult.data.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {projectResult.data.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#e4e4e2] bg-[#fcfcfb] p-8 text-center">
                  <h3 className="font-semibold">No projects in this category yet</h3>
                  <p className="mt-2 text-sm text-[#666666]">
                    Try another category or come back when more projects are
                    published.
                  </p>
                </div>
              )
            ) : (
              <CatalogStatus result={projectResult} itemName="projects" />
            )}
          </section>
        </>
      )}
    </PlatformShell>
  );
}
