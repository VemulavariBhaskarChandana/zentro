import Link from "next/link";
import { ArrowRight, GraduationCap, PencilLine } from "lucide-react";
import type { ReactNode } from "react";
import { PlatformShell } from "@/components/platform-shell";
import { getStudentProfileSummary } from "@/lib/student-data";
import { getUserDisplayName, requireUser } from "@/lib/auth";

export const instant = false;

export default async function MyProfilePage() {
  const user = await requireUser();
  const profileResult = await getStudentProfileSummary(user.id);

  return (
    <PlatformShell
      studentName={
        profileResult.status === "ready"
          ? profileResult.profile.fullName
          : getUserDisplayName(user)
      }
    >
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#454545]">
          Your learning starting point
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">
          My Profile
        </h1>
      </div>
      {profileResult.status === "unconfigured" ? (
        <ProfileMessage>
          Your student profile is stored in Supabase, which isn’t configured in
          this environment yet. Set the server environment and run the students
          migration to view or update your details.
        </ProfileMessage>
      ) : profileResult.status === "error" ? (
        <ProfileMessage>{profileResult.message}</ProfileMessage>
      ) : profileResult.status === "not-found" ? (
        <ProfileMessage>
          Your student profile isn’t complete yet. Start onboarding to add your
          study details and interests.
          <Link className="mt-4 inline-flex items-center gap-2 font-semibold" href="/onboarding">
            Continue onboarding <ArrowRight size={15} />
          </Link>
        </ProfileMessage>
      ) : (
        <section className="rounded-3xl border border-[#e4e4e2] bg-[#fcfcfb] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e4e4e2] pb-5">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-[#ebebea] text-[#454545]">
                <GraduationCap size={23} />
              </span>
              <div>
                <h2 className="text-lg font-semibold">
                  {profileResult.profile.fullName}
                </h2>
                <p className="mt-0.5 text-sm text-[#666666]">
                  {profileResult.profile.collegeName}
                </p>
              </div>
            </div>
            <Link
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e4e4e2] bg-[#ffffff] px-4 text-sm font-semibold text-[#555555] no-underline hover:bg-[#f1f1ef]"
              href="/onboarding?edit=1"
            >
              <PencilLine size={15} />
              Edit details
            </Link>
          </div>
          <dl className="grid gap-x-8 gap-y-5 pt-6 sm:grid-cols-2">
            <ProfileField label="Qualification" value={profileResult.profile.qualification} />
            <ProfileField label="Department" value={profileResult.profile.department} />
            <ProfileField label="Current semester / year" value={profileResult.profile.currentYear} />
            <ProfileField label="Main project goal" value={profileResult.profile.projectGoal} />
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#777777]">
                Areas of interest
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {profileResult.profile.interests.map((interest) => (
                  <span
                    className="rounded-full bg-[#ebebea] px-3 py-1 text-xs font-medium text-[#555555]"
                    key={interest}
                  >
                    {interest}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </PlatformShell>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#777777]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[#333333]">{value}</dd>
    </div>
  );
}

function ProfileMessage({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e4e4e2] bg-[#f7f7f6] p-6 text-sm leading-6 text-[#555555]">
      {children}
    </div>
  );
}
