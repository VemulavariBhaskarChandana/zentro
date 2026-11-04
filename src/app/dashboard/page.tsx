import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import Link from "next/link";
import { CatalogStatus } from "@/components/catalog-status";
import { PlatformShell } from "@/components/platform-shell";
import { ProjectCategoryCard } from "@/components/project-category-card";
import { getProjectCategories } from "@/lib/project-catalog";
import { getStudentProfileSummary } from "@/lib/student-data";
import { getUserDisplayName, requireUser } from "@/lib/auth";
import { ArrowRight, Lightbulb } from "lucide-react";

export const instant = false;

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();
  const user = await requireUser();
  const [profileResult, categoryResult] = await Promise.all([
    getStudentProfileSummary(user.id),
    getProjectCategories(),
  ]);

  if (profileResult.status === "unconfigured") redirect("/onboarding");
  if (profileResult.status === "not-found") redirect("/onboarding");
  if (
    profileResult.status === "ready" &&
    !profileResult.profile.onboardingCompleted
  ) {
    redirect("/onboarding");
  }

  const studentName =
    profileResult.status === "ready"
      ? profileResult.profile.fullName
    : getUserDisplayName(user);
  const displayName = studentName?.trim() || "there";
  return (
    <PlatformShell>
      <header className="mb-8 rounded-[1.65rem] border border-[#e7d9b8] bg-[#f7edda] px-6 py-7 sm:px-9 sm:py-9">
        <h1 className="text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
          Welcome back, {displayName}!
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f685c] sm:text-base">
          Explore different technologies and discover what you can build.
        </p>
      </header>

      {profileResult.status === "error" ? (
        <div
          className="mt-7 rounded-2xl border border-[#e8b6a7] bg-[#fff3ef] p-5 text-sm text-[#8a3320]"
          role="alert"
        >
          {profileResult.message}
        </div>
      ) : null}

      <section aria-labelledby="dashboard-categories-heading">
        <div className="mb-5">
          <h2
            className="text-2xl font-semibold tracking-[-0.05em] sm:text-3xl"
            id="dashboard-categories-heading"
          >
            Explore Categories
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77736a] sm:text-base">
            Pick a topic that sounds interesting. Each one has beginner-friendly
            project ideas to help you get started.
          </p>
        </div>
        {categoryResult.status === "ready" ? (
          categoryResult.data.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {categoryResult.data.map((category) => (
                <ProjectCategoryCard category={category} key={category.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d9cfba] bg-[#faf7f0] p-8 text-center">
              <h3 className="font-semibold">No categories published yet</h3>
              <p className="mt-2 text-sm text-[#77736a]">
                New learning areas will appear here when they are ready.
              </p>
            </div>
          )
        ) : (
          <CatalogStatus result={categoryResult} itemName="categories" />
        )}
      </section>

      <section className="mt-10 rounded-[1.5rem] border border-[#ddc687] bg-[#f1e7cb] p-6 sm:p-8">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#886510]">
          <Lightbulb size={15} />
          Personal mentoring
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.045em]">
          Need more guidance?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f685c]">
          Tell us what you want to build or where you feel stuck. A mentor can
          help you choose technologies, plan the next steps, and get started
          with confidence.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#d6a72c] px-5 text-sm font-semibold text-[#24221e] no-underline transition hover:bg-[#e0b53e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d6a72c]/30"
          href="/guidance"
        >
          Ask for guidance
          <ArrowRight size={16} />
        </Link>
      </section>
    </PlatformShell>
  );
}

function DashboardLoading() {
  return (
    <PlatformShell>
      <div aria-busy="true" className="animate-pulse space-y-8" role="status">
        <span className="sr-only">Loading your ZENTRO dashboard…</span>
        <div className="h-36 rounded-[1.65rem] border border-[#e7d9b8] bg-[#f7edda]" />
        <div className="h-8 w-56 rounded bg-[#e8e1d4]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="h-64 rounded-2xl border border-[#e8e1d4] bg-[#faf7f0]"
              key={index}
            />
          ))}
        </div>
      </div>
    </PlatformShell>
  );
}
