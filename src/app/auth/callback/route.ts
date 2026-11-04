import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/onboarding";

  const destination = new URL(value, "http://zentro.local");
  return destination.origin === "http://zentro.local"
    ? `${destination.pathname}${destination.search}${destination.hash}`
    : "/onboarding";
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextPath = safeNextPath(url.searchParams.get("next"));
  const supabase = await createSupabaseServerClient();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Could not complete Supabase auth callback:", error.message);
      return NextResponse.redirect(new URL("/sign-in?auth_error=callback", url));
    }
    return NextResponse.redirect(new URL(nextPath, url));
  }

  if (tokenHash && (type === "signup" || type === "recovery")) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) {
      console.error("Could not verify Supabase email link:", error.message);
      return NextResponse.redirect(new URL("/sign-in?auth_error=verification", url));
    }
    return NextResponse.redirect(
      new URL(type === "recovery" ? "/reset-password" : nextPath, url),
    );
  }

  return NextResponse.redirect(new URL("/sign-in?auth_error=callback", url));
}
