"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function messageFrom(error: unknown) {
  return error instanceof Error
    ? error.message
    : "We couldn’t complete that request. Please try again.";
}

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === "sign-up";
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
            data: { full_name: fullName.trim() },
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          router.replace("/onboarding");
        } else {
          router.replace(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        }
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        router.replace("/onboarding");
        router.refresh();
      }
    } catch (requestError) {
      setError(messageFrom(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      {!isConfigured ? (
        <p className="auth-alert" role="alert">
          Supabase Auth setup is incomplete. Add NEXT_PUBLIC_SUPABASE_ANON_KEY
          to .env.local and restart the app.
        </p>
      ) : null}
      {error ? (
        <p className="auth-alert" role="alert">
          {error}
        </p>
      ) : null}
      <form aria-busy={isSubmitting} className="grid gap-4" onSubmit={submit}>
        {isSignUp ? (
          <div className="auth-field">
            <label htmlFor="auth-name">Full name</label>
            <input
              autoComplete="name"
              className="auth-input"
              id="auth-name"
              onChange={(event) => setFullName(event.target.value)}
              disabled={!isConfigured}
              required
              value={fullName}
            />
          </div>
        ) : null}
        <div className="auth-field">
          <label htmlFor="auth-email">Email address</label>
          <input
            autoComplete="email"
            className="auth-input"
            id="auth-email"
            onChange={(event) => setEmail(event.target.value)}
            disabled={!isConfigured}
            required
            type="email"
            value={email}
          />
        </div>
        <div className="auth-field">
          <label htmlFor="auth-password">Password</label>
          <input
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="auth-input"
            id="auth-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            disabled={!isConfigured}
            required
            type="password"
            value={password}
          />
        </div>
        {!isSignUp ? (
          <Link className="auth-link justify-self-end text-sm" href="/forgot-password">
            Forgot password?
          </Link>
        ) : null}
        <Button
          className="w-full"
          disabled={isSubmitting || !isConfigured}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />
              {isSignUp ? "Creating account…" : "Signing in…"}
            </>
          ) : (
            <>
              {isSignUp ? "Create account" : "Sign in"}
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
