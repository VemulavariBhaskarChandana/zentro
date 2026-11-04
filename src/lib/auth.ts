import "server-only";

import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  await cookies();
  if (!isSupabaseAuthConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    if (error.name !== "AuthSessionMissingError") {
      console.error("Could not verify Supabase session:", error.message);
    }
    return null;
  }

  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(
      isSupabaseAuthConfigured()
        ? "/sign-in"
        : "/sign-in?auth_setup=missing",
    );
  }
  return user;
}

export function getUserDisplayName(user: User) {
  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim()) return fullName;
  return user.email?.split("@")[0] ?? undefined;
}
