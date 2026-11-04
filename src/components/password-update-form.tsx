"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PasswordUpdateForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("The passwords don’t match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      router.replace("/sign-in?password_updated=1");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t update your password. Request a new reset link.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form aria-busy={isSubmitting} className="auth-card" onSubmit={submit}>
      {error ? (
        <p className="auth-alert" role="alert">
          {error}
        </p>
      ) : null}
      <p className="auth-note">Choose a new password for your account.</p>
      <div className="auth-field">
        <label htmlFor="new-password">New password</label>
        <input
          autoComplete="new-password"
          className="auth-input"
          id="new-password"
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      <div className="auth-field">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          autoComplete="new-password"
          className="auth-input"
          id="confirm-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          type="password"
          value={confirmPassword}
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
            Updating password…
          </>
        ) : (
          <>
            Update password
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  );
}
