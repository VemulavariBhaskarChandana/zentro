import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";
import { GuidanceRequestForm } from "@/components/guidance-request-form";
import { PlatformShell } from "@/components/platform-shell";
import { getProjectBySlug } from "@/lib/project-catalog";
import { getUserDisplayName, requireUser } from "@/lib/auth";
import { getStudentProfileSummary } from "@/lib/student-data";

export const instant = false;

export default async function GuidancePage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const projectSlug = typeof query.project === "string" ? query.project : "";
  const [profileResult, projectResult] = await Promise.all([
    getStudentProfileSummary(user.id),
    projectSlug ? getProjectBySlug(projectSlug) : Promise.resolve(null),
  ]);

  if (projectResult?.status === "not-found") notFound();

  const profile =
    profileResult.status === "ready" ? profileResult.profile : null;
  return (
    <PlatformShell>
      <Link
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#555555] no-underline hover:underline"
        href={projectSlug ? `/projects/${projectSlug}` : "/dashboard"}
      >
        <ArrowLeft size={16} />
        {projectSlug ? "Back to project" : "Back to dashboard"}
      </Link>

      <div className="mx-auto max-w-3xl">
        <header className="rounded-[1.65rem] border border-[#e4e4e2] bg-[#f4f4f2] p-6 sm:p-9">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#454545]">
            <Lightbulb size={15} />
            Personal mentoring
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
            Need more guidance?
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#666666] sm:text-base">
            Share what you are hoping to build or what feels difficult. We can
            help you understand the project, choose technologies, plan your
            steps, and get started. A mentor will contact you using your
            account email.
          </p>
          {projectResult?.status === "ready" ? (
            <p className="mt-4 rounded-xl border border-[#e4e4e2] bg-[#f7f7f6] px-4 py-3 text-sm text-[#666666]">
              Asking about{" "}
              <span className="font-semibold text-[#1b1b1b]">
                {projectResult.data.title}
              </span>
            </p>
          ) : null}
        </header>

        {profileResult.status === "error" ? (
          <p
            className="mt-5 rounded-xl border border-[#e8b6a7] bg-[#fff3ef] px-4 py-3 text-sm text-[#8a3320]"
            role="alert"
          >
            {profileResult.message}
          </p>
        ) : null}

        {projectResult?.status === "error" ? (
          <p
            className="mt-5 rounded-xl border border-[#e8b6a7] bg-[#fff3ef] px-4 py-3 text-sm text-[#8a3320]"
            role="alert"
          >
            We couldn’t load this project. You can still send a general
            guidance request.
          </p>
        ) : null}

        <section className="mt-6 rounded-[1.5rem] border border-[#e4e4e2] bg-[#fcfcfb] p-5 sm:p-8">
          <h2 className="text-xl font-semibold tracking-[-0.04em]">
            Your contact details
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#666666]">
            Check the details below so we know how to reach you.
          </p>
          <GuidanceRequestForm
            defaults={{
              name: profile?.fullName ?? getUserDisplayName(user) ?? "",
              email: user.email ?? "",
              phone: "",
              college: profile?.collegeName ?? "",
              department: profile?.department ?? "",
            }}
            projectSlug={
              projectResult?.status === "ready" ? projectResult.data.slug : ""
            }
          />
        </section>
      </div>
    </PlatformShell>
  );
}
