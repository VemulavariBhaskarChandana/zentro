import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { StudentOnboardingData } from "@/lib/student-onboarding-schema";

export type StudentProfile = StudentOnboardingData & {
  onboardingCompleted: boolean;
};

export type StudentProfileSummary = {
  fullName: string;
  collegeName: string;
  qualification: string;
  department: string;
  currentYear: string;
  interests: string[];
  projectGoal: string;
  onboardingCompleted: boolean;
};

export async function getStudentProfile(userId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { configured: false as const, profile: null };
  }

  const { data, error } = await supabase
    .from("students")
    .select(
      "full_name, college_name, qualification, department, current_year, project_type, technical_level, interests, has_project_idea, project_goal, additional_requirements, onboarding_completed",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Could not load student onboarding profile:", error.message);
    return {
      configured: true as const,
      profile: null,
      loadError:
        "We couldn’t load your saved onboarding details. You can continue and try again.",
    };
  }

  if (!data) {
    return { configured: true as const, profile: null };
  }

  return {
    configured: true as const,
    profile: {
      fullName: data.full_name,
      collegeName: data.college_name,
      qualification: data.qualification,
      department: data.department,
      currentYear: data.current_year,
      projectType: data.project_type,
      technicalLevel: data.technical_level,
      interests: data.interests,
      hasProjectIdea: data.has_project_idea,
      projectGoal: data.project_goal,
      additionalRequirements: data.additional_requirements ?? "",
      onboardingCompleted: data.onboarding_completed,
    } satisfies StudentProfile,
  };
}

export async function getStudentProfileSummary(userId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { status: "unconfigured" as const, profile: null };
  }

  const { data, error } = await supabase
    .from("students")
    .select(
      "full_name, college_name, qualification, department, current_year, interests, project_goal, onboarding_completed",
    )
    .eq("user_id", userId)
    .maybeSingle()
    .returns<{
      full_name: string;
      college_name: string;
      qualification: string;
      department: string;
      current_year: string;
      interests: string[];
      project_goal: string;
      onboarding_completed: boolean;
    }>();

  if (error) {
    console.error("Could not load student profile summary:", error.message);
    return {
      status: "error" as const,
      profile: null,
      message: "We couldn’t load your profile. Please try again.",
    };
  }

  if (!data) return { status: "not-found" as const, profile: null };

  return {
    status: "ready" as const,
    profile: {
      fullName: data.full_name,
      collegeName: data.college_name,
      qualification: data.qualification,
      department: data.department,
      currentYear: data.current_year,
      interests: data.interests,
      projectGoal: data.project_goal,
      onboardingCompleted: data.onboarding_completed,
    } satisfies StudentProfileSummary,
  };
}
