import { AuthShell } from "@/components/auth-shell";
import { EmailVerificationForm } from "@/components/email-verification-form";

export const instant = false;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const query = await searchParams;
  const email = typeof query.email === "string" ? query.email : "";
  return (
    <AuthShell
      title="Verify your email"
      description="One quick check helps keep your ZENTRO account safe and yours."
      switchText="Starting fresh?"
      switchLabel="Create an account"
      switchHref="/sign-up"
    >
      <EmailVerificationForm initialEmail={email} />
    </AuthShell>
  );
}
