import { AuthShell } from "@/components/auth-shell";
import { PasswordResetForm } from "@/components/password-reset-form";

export const instant = false;

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="We’ll send a secure verification code to the email address on your account."
      switchText="Remembered your password?"
      switchLabel="Back to sign in"
      switchHref="/sign-in"
    >
      <PasswordResetForm />
    </AuthShell>
  );
}
