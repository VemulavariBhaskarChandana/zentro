import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-forms";

export const instant = false;

export default function SignUpPage() {
  return (
    <AuthShell
      title="Start building"
      description="Create your account and find the support to turn curiosity into something real."
      switchText="Already have an account?"
      switchLabel="Sign in"
      switchHref="/sign-in"
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  );
}
