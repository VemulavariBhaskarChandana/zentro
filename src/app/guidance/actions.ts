"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

const guidanceRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  phone: z.string().trim().max(40, "Keep your phone number under 40 characters."),
  college: z.string().trim().max(180, "Keep your college name under 180 characters."),
  department: z.string().trim().max(120, "Keep your department under 120 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Please share a little more about the help you need.")
    .max(1200, "Keep your message under 1,200 characters."),
  projectSlug: z.string().trim().max(140).optional(),
});

export type GuidanceRequestResult =
  | { success: true }
  | { success: false; error: string };

export async function requestGuidance(
  input: unknown,
): Promise<GuidanceRequestResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: "Your session has expired. Sign in again to send your request.",
    };
  }

  const parsed = guidanceRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check your details and try again.",
    };
  }

  const email = user.email;
  if (!email || !user.email_confirmed_at) {
    return {
      success: false,
      error: "Verify your email address so a mentor can contact you.",
    };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      success: false,
      error:
        "Guidance requests can’t be saved yet. Check the Supabase server settings and run the latest database migration.",
    };
  }

  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("onboarding_completed")
    .eq("user_id", user.id)
    .maybeSingle()
    .returns<{ onboarding_completed: boolean }>();

  if (studentError) {
    console.error("Could not verify guidance request profile:", studentError.message);
    return {
      success: false,
      error: "We couldn’t verify your student profile. Please try again.",
    };
  }
  if (!student?.onboarding_completed) {
    return {
      success: false,
      error: "Complete your student profile before asking for guidance.",
    };
  }

  let projectId: string | null = null;
  if (parsed.data.projectSlug) {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, title")
      .eq("slug", parsed.data.projectSlug)
      .eq("published", true)
      .maybeSingle()
      .returns<{ id: string; title: string }>();

    if (projectError) {
      console.error("Could not verify guidance request project:", projectError.message);
      return {
        success: false,
        error: "We couldn’t verify that project. Please try again.",
      };
    }
    if (!project) {
      return {
        success: false,
        error: "That project is no longer available. Choose another project.",
      };
    }
    projectId = project.id;
  }

  const { error } = await supabase.from("demo_bookings").insert({
    user_id: user.id,
    student_name: parsed.data.name,
    student_email: email,
    project_id: projectId,
    preferred_time: "Not specified",
    student_note: parsed.data.message,
    student_phone: parsed.data.phone,
    student_college: parsed.data.college,
    student_department: parsed.data.department,
  });

  if (error) {
    console.error("Could not save guidance request:", error.message);
    return {
      success: false,
      error:
        "We couldn’t save your request right now. Please try again in a moment.",
    };
  }

  return { success: true };
}
