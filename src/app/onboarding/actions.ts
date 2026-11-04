"use server";

import { getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { studentOnboardingSchema } from "@/lib/student-onboarding-schema";

export type SaveOnboardingResult =
  | { success: true }
  | { success: false; error: string };

export async function saveStudentOnboarding(
  input: unknown,
): Promise<SaveOnboardingResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "Your session has expired. Sign in again to save your profile.",
    };
  }

  const parsed = studentOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check your details and try again.",
    };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      success: false,
      error:
        "Profile saving is not configured yet. Add the Supabase URL and service role key to the server environment.",
    };
  }

  const student = parsed.data;
  const { error } = await supabase.from("students").upsert(
    {
      user_id: user.id,
      full_name: student.fullName,
      college_name: student.collegeName,
      qualification: student.qualification,
      department: student.department,
      current_year: student.currentYear,
      project_type: student.projectType,
      technical_level: student.technicalLevel,
      interests: student.interests,
      has_project_idea: student.hasProjectIdea,
      project_goal: student.projectGoal,
      additional_requirements: student.additionalRequirements,
      onboarding_completed: true,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("Could not save student onboarding profile:", error.message);
    return {
      success: false,
      error:
        "We couldn’t save your details right now. Please try again in a moment.",
    };
  }

  return { success: true };
}
