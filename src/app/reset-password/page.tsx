import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { PasswordUpdateForm } from "@/components/password-update-form";
import { getCurrentUser } from "@/lib/auth";

export const instant = false;

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/forgot-password");

  return (
    <AuthShell
      title="Choose a new password"
      description="Set a fresh password to secure your ZENTRO account."
      switchText="Remembered your password?"
      switchLabel="Back to sign in"
      switchHref="/sign-in"
    >
      <PasswordUpdateForm />
    </AuthShell>
  );
}
