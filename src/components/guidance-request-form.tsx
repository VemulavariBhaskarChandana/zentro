"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestGuidance } from "@/app/guidance/actions";

type ContactDefaults = {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
};

export function GuidanceRequestForm({
  defaults,
  projectSlug,
}: {
  defaults: ContactDefaults;
  projectSlug: string;
}) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = await requestGuidance({
        name: formData.get("name"),
        phone: formData.get("phone"),
        college: formData.get("college"),
        department: formData.get("department"),
        message: formData.get("message"),
        projectSlug,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    } catch (requestError) {
      console.error("Unexpected guidance request failure:", requestError);
      setError("Something went wrong while sending your request. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="mt-6 rounded-xl border border-[#d7e5cd] bg-[#f5faef] p-5 text-sm leading-6 text-[#49643a]"
        role="status"
      >
        Your request was saved in ZENTRO with your contact details.
      </div>
    );
  }

  return (
    <form
      aria-busy={isSaving}
      className="mt-6 grid gap-4 sm:grid-cols-2"
      onSubmit={submit}
    >
      {error ? (
        <p
          className="rounded-xl border border-[#e8b6a7] bg-[#fff3ef] px-4 py-3 text-sm text-[#8a3320] sm:col-span-2"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Field label="Your name" name="name" defaultValue={defaults.name} required />
      <Field
        label="Email address"
        name="email"
        type="email"
        defaultValue={defaults.email}
        readOnly
        required
      />
      <Field
        label="College or university"
        name="college"
        defaultValue={defaults.college}
      />
      <Field
        label="Department or course"
        name="department"
        defaultValue={defaults.department}
      />
      <Field
        label="Phone number (optional)"
        name="phone"
        type="tel"
        defaultValue={defaults.phone}
      />

      <div className="sm:col-span-2">
        <label
          className="mb-2 block text-sm font-semibold text-[#4b473f]"
          htmlFor="guidance-message"
        >
          What would you like help with?
        </label>
        <textarea
          autoComplete="off"
          className="min-h-32 w-full resize-y rounded-xl border border-[#ded7c9] bg-[#fffefa] px-4 py-3 text-sm leading-6 outline-none focus:border-[#d6a72c] focus:ring-4 focus:ring-[#d6a72c]/15"
          id="guidance-message"
          maxLength={1200}
          name="message"
          onChange={(event) => setMessageLength(event.target.value.length)}
          placeholder="For example: I want to build a simple website but I’m not sure which tools to choose."
          required
        />
        <p className="mt-1.5 text-right text-xs text-[#8d887d]">
          {messageLength}/1,200
        </p>
      </div>

      <p className="text-xs leading-5 text-[#77736a] sm:col-span-2">
        Your request and contact details will be saved in ZENTRO when you submit
        this form.
      </p>
      <div className="sm:col-span-2">
        <Button aria-busy={isSaving} disabled={isSaving} type="submit">
          {isSaving ? (
            <>
              <LoaderCircle className="animate-spin" size={16} />
              Sending request…
            </>
          ) : (
            <>
              Send guidance request
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  readOnly = false,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  readOnly?: boolean;
  required?: boolean;
}) {
  const id = `guidance-${name}`;
  return (
    <div>
      <label
        className="mb-2 block text-sm font-semibold text-[#4b473f]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        autoComplete={name === "phone" ? "tel" : name}
        className="min-h-12 w-full rounded-xl border border-[#ded7c9] bg-[#fffefa] px-4 text-sm outline-none focus:border-[#d6a72c] focus:ring-4 focus:ring-[#d6a72c]/15 read-only:bg-[#f2eee5]"
        defaultValue={defaultValue}
        id={id}
        maxLength={name === "phone" ? 40 : name === "name" ? 120 : name === "college" ? 180 : 120}
        name={name}
        readOnly={readOnly}
        required={required}
        type={type}
      />
    </div>
  );
}
