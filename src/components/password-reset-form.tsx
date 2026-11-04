"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        },
      );
      if (resetError) throw resetError;
      setSent(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t send the password reset email. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="auth-card">
        <div className="mb-4 grid size-11 place-items-center rounded-full bg-[#f7f7f5] text-[#454545]">
          <MailCheck size={21} />
        </div>
        <h3 className="m-0 text-lg font-semibold tracking-tight">
          Check your email
        </h3>
        <p className="auth-note mt-2">
          If an account exists for {email}, Supabase will send a secure password
          reset link.
        </p>
      </div>
    );
  }

  return (
    <form aria-busy={isSubmitting} className="auth-card" onSubmit={submit}>
      {error ? (
        <p className="auth-alert" role="alert">
          {error}
        </p>
      ) : null}
      <p className="auth-note">
        Enter the email address you used to create your account.
      </p>
      <div className="auth-field">
        <label htmlFor="reset-email">Email address</label>
        <input
          autoComplete="email"
          className="auth-input"
          id="reset-email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>
      <Button
        aria-busy={isSubmitting}
        className="w-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />
            Sending reset link…
          </>
        ) : (
          <>
            Send reset link
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  );
}
