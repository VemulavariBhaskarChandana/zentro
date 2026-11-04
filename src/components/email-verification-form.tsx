"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, MailCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function EmailVerificationForm({
  initialEmail,
}: {
  initialEmail: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function resend() {
    setError("");
    setNotice("");
    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (resendError) throw resendError;
      setNotice("If this address has a pending account, a new link is on its way.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t resend the verification link. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="mb-4 grid size-11 place-items-center rounded-full bg-[#f5f0e6] text-[#927016]">
        <MailCheck size={21} />
      </div>
      {error ? (
        <p className="auth-alert" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p
          className="mb-4 rounded-xl border border-[#d7e5cd] bg-[#f5faef] px-3 py-2 text-sm text-[#49643a]"
          role="status"
        >
          {notice}
        </p>
      ) : null}
      <p className="auth-note">
        We sent a verification link to your email. Open it on this device to
        verify your address and continue to onboarding.
      </p>
      <div className="auth-field">
        <label htmlFor="verification-email">Email address</label>
        <input
          autoComplete="email"
          className="auth-input"
          id="verification-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <Button
        aria-busy={isSubmitting}
        className="w-full"
        disabled={isSubmitting || !email.trim()}
        onClick={resend}
        type="button"
        variant="outline"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />
            Sending verification link…
          </>
        ) : (
          <>
            Resend verification link
            <ArrowRight size={16} />
          </>
        )}
      </Button>
      <Link className="auth-inline-link mt-4" href="/sign-in">
        Return to sign in
      </Link>
    </div>
  );
}
