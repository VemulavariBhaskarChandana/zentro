import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/auth-forms";

export const instant = false;

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to pick up where your next big idea begins."
      switchText="New to ZENTRO?"
      switchLabel="Create an account"
      switchHref="/sign-up"
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  );
}
