import { CatalogStatus } from "@/components/catalog-status";
import { PlatformShell } from "@/components/platform-shell";
import { ProjectCategoryCard } from "@/components/project-category-card";
import { getProjectCategories } from "@/lib/project-catalog";
import { requireUser } from "@/lib/auth";

export const instant = false;

export default async function CategoriesPage() {
  await requireUser();
  const result = await getProjectCategories();

  return (
    <PlatformShell>
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#927016]">
          Explore at your own pace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
          Explore Categories
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#77736a] sm:text-base">
          Each area is a different way to solve problems. Pick one that sounds
          interesting; you don’t need to know everything to get started.
        </p>
      </div>

      {result.status === "ready" ? (
        result.data.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.data.map((category) => (
              <ProjectCategoryCard category={category} key={category.id} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d9cfba] bg-[#faf7f0] p-8 text-center">
            <h2 className="font-semibold">No categories published yet</h2>
            <p className="mt-2 text-sm text-[#77736a]">
              Categories will show up here when they’re ready.
            </p>
          </div>
        )
      ) : (
        <CatalogStatus result={result} itemName="categories" />
      )}
    </PlatformShell>
  );
}
