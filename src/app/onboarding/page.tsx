import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StudentOnboarding } from "@/components/student-onboarding";
import {
  createEmptyOnboardingData,
  type StudentOnboardingFormData,
} from "@/lib/student-onboarding-schema";
import { getStudentProfile } from "@/lib/student-data";

export const instant = false;

export default async function OnboardingPage({
  searchParams,
}: PageProps<"/onboarding">) {
  const query = await searchParams;
  const user = await requireUser();
  const profileResult = await getStudentProfile(user.id);

  if (profileResult.profile?.onboardingCompleted && query.edit !== "1") {
    redirect("/dashboard");
  }

  const initialData: StudentOnboardingFormData = profileResult.profile
    ? {
        fullName: profileResult.profile.fullName,
        collegeName: profileResult.profile.collegeName,
        qualification: profileResult.profile.qualification,
        department: profileResult.profile.department,
        currentYear: profileResult.profile.currentYear,
        projectType: profileResult.profile.projectType,
        technicalLevel: profileResult.profile.technicalLevel,
        interests: profileResult.profile.interests,
        hasProjectIdea: profileResult.profile.hasProjectIdea,
        projectGoal: profileResult.profile.projectGoal,
        additionalRequirements: profileResult.profile.additionalRequirements,
      }
    : createEmptyOnboardingData(
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : "",
      );

  return (
    <StudentOnboarding
      databaseConfigured={profileResult.configured}
      initialData={initialData}
      initialLoadError={"loadError" in profileResult ? profileResult.loadError : undefined}
    />
  );
}
