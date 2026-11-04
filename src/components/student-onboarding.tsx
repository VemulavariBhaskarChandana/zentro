"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  Cloud,
  Code2,
  Cpu,
  Database,
  FolderKanban,
  Lightbulb,
  LoaderCircle,
  Shield,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  interestAreas,
  projectGoals,
  projectTypes,
  qualifications,
  technicalLevels,
  type StudentOnboardingFormData,
} from "@/lib/student-onboarding-schema";
import { saveStudentOnboarding } from "@/app/onboarding/actions";

type Props = {
  databaseConfigured: boolean;
  initialData: StudentOnboardingFormData;
  initialLoadError?: string;
};

const steps = [
  "Personal information",
  "Project type",
  "Technical knowledge",
  "Areas of interest",
  "Project goals",
] as const;

const projectDescriptions: Record<(typeof projectTypes)[number], string> = {
  "Basic Project": "A first hands-on build to put the fundamentals into practice.",
  "Mini Project": "A focused idea that helps you explore a topic in more depth.",
  "Major Project": "A substantial build for a capstone or final-year submission.",
  "Not Sure Yet": "Let’s explore your interests and figure it out together.",
};

const interestIcons: Record<(typeof interestAreas)[number], LucideIcon> = {
  "Artificial Intelligence & Machine Learning": BrainCircuit,
  "Web Development": Code2,
  Python: Code2,
  Java: Code2,
  "Data Science": Database,
  "Mobile App Development": Smartphone,
  "Cloud Computing": Cloud,
  Cybersecurity: Shield,
  "Internet of Things": Cpu,
  Other: Sparkles,
};

const fieldClass =
  "min-h-12 w-full rounded-xl border border-[#e2e2e0] bg-[#ffffff] px-4 text-sm text-[#1b1b1b] outline-none transition focus:border-[#e5e5e3] focus:ring-4 focus:ring-[#e5e5e3]/15";

const fieldLabelClass =
  "mb-2 block text-sm font-semibold text-[#404040]";

const optionCardClass =
  "flex h-full cursor-pointer items-start gap-3 rounded-2xl border border-[#e4e4e2] bg-[#ffffff] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#e5e5e3]/70 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] active:scale-[0.99]";
const optionFocusClass =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e5e5e3]/25";

function ChoiceIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
        selected
          ? "border-[#e5e5e3] bg-[#e5e5e3] text-[#1b1b1b]"
          : "border-[#d8d8d6] bg-white"
      }`}
    >
      {selected ? <Check size={13} strokeWidth={3} /> : null}
    </span>
  );
}

export function StudentOnboarding({
  databaseConfigured,
  initialData,
  initialLoadError,
}: Props) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  function update<K extends keyof StudentOnboardingFormData>(
    key: K,
    value: StudentOnboardingFormData[K],
  ) {
    if (isSaving) return;
    setData((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function validateCurrentStep() {
    if (step === 0) {
      if (data.fullName.trim().length < 2) return "Enter your full name.";
      if (data.collegeName.trim().length < 2) return "Enter your college name.";
      if (!data.qualification) return "Choose your qualification.";
      if (data.department.trim().length < 2) return "Enter your department.";
      if (!data.currentYear.trim()) return "Enter your current semester or year.";
    }
    if (step === 1 && !data.projectType) {
      return "Choose the type of project you are looking for.";
    }
    if (step === 2 && !data.technicalLevel) {
      return "Choose your current technical knowledge level.";
    }
    if (step === 3 && data.interests.length === 0) {
      return "Choose at least one area of interest.";
    }
    if (step === 4 && data.hasProjectIdea === null) {
      return "Tell us whether you already have a project idea.";
    }
    if (step === 4 && !data.projectGoal) {
      return "Choose your main project goal.";
    }
    return "";
  }

  function goNext() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function finishOnboarding() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      const result = await saveStudentOnboarding(data);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setIsComplete(true);
    } catch (saveError) {
      console.error("Unexpected onboarding save failure:", saveError);
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const inputId = (name: string) => `onboarding-${name}`;

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-6 text-[#1b1b1b] sm:px-7 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-7 flex flex-col items-start justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center">
          <Link
            aria-label="ZENTRO home"
            className="inline-flex items-center gap-3 text-sm font-extrabold tracking-[0.2em] text-[#1b1b1b] no-underline"
            href="/"
          >
            ZENTRO
          </Link>
          <span className="rounded-full border border-[#e4e4e2] bg-[#fcfcfb] px-3 py-1.5 text-xs font-medium text-[#666666] sm:px-4 sm:text-sm">
            Student onboarding
          </span>
        </header>

        <section
          aria-busy={isSaving}
          className="rounded-[1.65rem] border border-[#e4e4e2] bg-[#fcfcfb] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-9 md:p-11"
        >
          {isComplete ? (
            <div className="mx-auto max-w-xl py-8 text-center sm:py-12">
              <span className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-[#e5e5e3]/20 text-[#454545]">
                <CheckCircle2 size={32} />
              </span>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#454545]">
                Your profile is ready
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
                You&apos;re all set!
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#666666] sm:text-base">
                Let&apos;s find the right project for you.
              </p>
              <Button
                aria-busy={isNavigating}
                className="mt-8 min-w-48"
                disabled={isNavigating}
                onClick={() => {
                  setIsNavigating(true);
                  router.push("/dashboard");
                }}
                type="button"
              >
                {isNavigating ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
                    Opening dashboard…
                  </>
                ) : (
                  <>
                    Explore Projects
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-2 flex flex-col items-start gap-1 text-xs font-semibold text-[#666666] sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                  <span>
                    Step {step + 1} of {steps.length}
                  </span>
                  <span>{steps[step]}</span>
                </div>
                <div
                  aria-label={`Step ${step + 1} of ${steps.length}`}
                  className="grid grid-cols-5 gap-2"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={steps.length}
                  aria-valuenow={step + 1}
                  aria-valuetext={`${steps[step]}, step ${step + 1} of ${steps.length}`}
                >
                  {steps.map((label, index) => (
                    <span
                      aria-label={label}
                      className={`h-1.5 rounded-full transition-colors ${
                        index <= step ? "bg-[#e5e5e3]" : "bg-[#e4e4e2]"
                      }`}
                      key={label}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-7">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#454545]">
                  <Sparkles size={14} />
                  Build your path
                </p>
                <h1
                  className="text-2xl font-semibold tracking-[-0.05em] sm:text-[2rem]"
                  id="onboarding-step-title"
                >
                  {step === 0 && "A little about you"}
                  {step === 1 && "Find your project fit"}
                  {step === 2 && "Where are you starting from?"}
                  {step === 3 && "Follow your curiosity"}
                  {step === 4 && "Make it yours"}
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#666666] sm:text-base">
                  {step === 0 &&
                    "Tell us a bit about your studies so we can tailor your experience."}
                  {step === 1 && "What type of project are you looking for?"}
                  {step === 2 &&
                    "How would you describe your technical knowledge?"}
                  {step === 3 &&
                    "Choose all the technologies and topics you’d like to explore."}
                  {step === 4 &&
                    "Share what you’re hoping to get out of your next project."}
                </p>
              </div>

              {(!databaseConfigured || initialLoadError) && (
                <div
                  className="mb-6 rounded-xl border border-[#e4e4e2] bg-[#f7f7f6] px-4 py-3 text-sm leading-6 text-[#555555]"
                  role="status"
                >
                  {initialLoadError ??
                    "Preview mode: profile saving is unavailable until Supabase is configured. Your answers will not be marked saved."}
                </div>
              )}
              {error ? (
                <div
                  id="onboarding-step-error"
                  className="mb-6 rounded-xl border border-[#e8b6a7] bg-[#fff3ef] px-4 py-3 text-sm leading-6 text-[#8a3320]"
                  role="alert"
                >
                  {error}
                </div>
              ) : null}

              <div
                aria-labelledby="onboarding-step-title"
                className="min-h-[270px]"
                key={step}
              >
                {step === 0 && (
                  <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={fieldLabelClass} htmlFor={inputId("name")}>
                        Full name
                      </label>
                      <input
                        autoComplete="name"
                        className={fieldClass}
                        id={inputId("name")}
                        aria-describedby={error ? "onboarding-step-error" : undefined}
                        aria-invalid={Boolean(error)}
                        maxLength={120}
                        required
                        onChange={(event) => update("fullName", event.target.value)}
                        placeholder="Your name"
                        value={data.fullName}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={fieldLabelClass} htmlFor={inputId("college")}>
                        College name
                      </label>
                      <input
                        autoComplete="organization"
                        className={fieldClass}
                        id={inputId("college")}
                        aria-describedby={error ? "onboarding-step-error" : undefined}
                        aria-invalid={Boolean(error)}
                        maxLength={180}
                        required
                        onChange={(event) =>
                          update("collegeName", event.target.value)
                        }
                        placeholder="Your college or university"
                        value={data.collegeName}
                      />
                    </div>
                    <div>
                      <label
                        className={fieldLabelClass}
                        htmlFor={inputId("qualification")}
                      >
                        Qualification
                      </label>
                      <select
                        className={fieldClass}
                        id={inputId("qualification")}
                        aria-describedby={error ? "onboarding-step-error" : undefined}
                        aria-invalid={Boolean(error)}
                        onChange={(event) =>
                          update(
                            "qualification",
                            (event.target.value || null) as StudentOnboardingFormData["qualification"],
                          )
                        }
                        value={data.qualification ?? ""}
                        required
                      >
                        <option disabled value="">
                          Choose a qualification
                        </option>
                        {qualifications.map((qualification) => (
                          <option key={qualification} value={qualification}>
                            {qualification}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className={fieldLabelClass}
                        htmlFor={inputId("department")}
                      >
                        Department
                      </label>
                      <input
                        className={fieldClass}
                        id={inputId("department")}
                        aria-describedby={error ? "onboarding-step-error" : undefined}
                        aria-invalid={Boolean(error)}
                        maxLength={120}
                        onChange={(event) =>
                          update("department", event.target.value)
                        }
                        placeholder="e.g. Computer Science"
                        required
                        value={data.department}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        className={fieldLabelClass}
                        htmlFor={inputId("year")}
                      >
                        Current semester / year
                      </label>
                      <input
                        className={fieldClass}
                        id={inputId("year")}
                        aria-describedby={error ? "onboarding-step-error" : undefined}
                        aria-invalid={Boolean(error)}
                        maxLength={60}
                        onChange={(event) =>
                          update("currentYear", event.target.value)
                        }
                        placeholder="e.g. 3rd year or Semester 5"
                        required
                        value={data.currentYear}
                      />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {projectTypes.map((option) => (
                      <button
                        aria-pressed={data.projectType === option}
                        className={`${optionCardClass} ${optionFocusClass} ${
                          data.projectType === option
                            ? "border-[#e5e5e3] bg-[#f1f1ef] ring-2 ring-[#e5e5e3]/20"
                            : ""
                        }`}
                        key={option}
                        onClick={() => update("projectType", option)}
                        type="button"
                      >
                        <ChoiceIndicator selected={data.projectType === option} />
                        <span>
                          <span className="block text-sm font-semibold text-[#1b1b1b]">
                            {option}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#666666] sm:text-sm">
                            {projectDescriptions[option]}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {technicalLevels.map((option) => (
                      <button
                        aria-pressed={data.technicalLevel === option}
                        className={`${optionCardClass} ${optionFocusClass} ${
                          data.technicalLevel === option
                            ? "border-[#e5e5e3] bg-[#f1f1ef] ring-2 ring-[#e5e5e3]/20"
                            : ""
                        }`}
                        key={option}
                        onClick={() => update("technicalLevel", option)}
                        type="button"
                      >
                        <ChoiceIndicator
                          selected={data.technicalLevel === option}
                        />
                        <span className="pt-0.5 text-sm font-semibold text-[#1b1b1b]">
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p className="mb-3 text-xs font-medium text-[#666666]">
                      Select all that apply
                      {data.interests.length
                        ? ` · ${data.interests.length} selected`
                        : ""}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {interestAreas.map((option) => {
                        const Icon = interestIcons[option];
                        const selected = data.interests.includes(option);
                        return (
                          <button
                            aria-pressed={selected}
                            className={`${optionCardClass} ${optionFocusClass} items-center ${
                              selected
                                ? "border-[#e5e5e3] bg-[#f1f1ef] ring-2 ring-[#e5e5e3]/20"
                                : ""
                            }`}
                            key={option}
                            onClick={() => {
                              const next = selected
                                ? data.interests.filter((item) => item !== option)
                                : [...data.interests, option];
                              update("interests", next);
                            }}
                            type="button"
                          >
                            <Icon className="shrink-0 text-[#454545]" size={18} />
                            <span className="flex-1 text-left text-sm font-medium leading-5 text-[#333333]">
                              {option}
                            </span>
                            <ChoiceIndicator selected={selected} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <fieldset>
                      <legend className={fieldLabelClass}>
                        Do you already have a project idea?
                      </legend>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Yes, I do", value: true },
                          { label: "Not yet", value: false },
                        ].map((option) => (
                          <button
                            aria-pressed={data.hasProjectIdea === option.value}
                            className={`${optionCardClass} ${optionFocusClass} items-center ${
                              data.hasProjectIdea === option.value
                                ? "border-[#e5e5e3] bg-[#f1f1ef] ring-2 ring-[#e5e5e3]/20"
                                : ""
                            }`}
                            key={option.label}
                            onClick={() =>
                              update("hasProjectIdea", option.value)
                            }
                            type="button"
                          >
                            <ChoiceIndicator
                              selected={data.hasProjectIdea === option.value}
                            />
                            <span className="text-sm font-semibold">
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className={fieldLabelClass}>
                        What is your main goal?
                      </legend>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {projectGoals.map((goal) => (
                          <button
                            aria-pressed={data.projectGoal === goal}
                            className={`${optionCardClass} ${optionFocusClass} items-center py-3 ${
                              data.projectGoal === goal
                                ? "border-[#e5e5e3] bg-[#f1f1ef] ring-2 ring-[#e5e5e3]/20"
                                : ""
                            }`}
                            key={goal}
                            onClick={() => update("projectGoal", goal)}
                            type="button"
                          >
                            <ChoiceIndicator
                              selected={data.projectGoal === goal}
                            />
                            <span className="text-sm font-medium">{goal}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div>
                      <label
                        className={fieldLabelClass}
                        htmlFor={inputId("requirements")}
                      >
                        Any additional requirements?{" "}
                        <span className="font-normal text-[#777777]">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        className={`${fieldClass} min-h-24 resize-y py-3`}
                        id={inputId("requirements")}
                        aria-describedby={`onboarding-requirements-count${error ? " onboarding-step-error" : ""}`}
                        maxLength={2000}
                        onChange={(event) =>
                          update("additionalRequirements", event.target.value)
                        }
                        placeholder="Anything else you’d like us to know?"
                        value={data.additionalRequirements}
                      />
                      <p
                        className="mt-1.5 text-right text-xs text-[#777777]"
                        id="onboarding-requirements-count"
                      >
                        {data.additionalRequirements.length}/2,000
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <footer className="mt-9 flex items-center justify-between gap-3 border-t border-[#e4e4e2] pt-5">
                {step > 0 ? (
                  <Button
                    className="min-h-11"
                    disabled={isSaving}
                    onClick={() => {
                      setError("");
                      setStep((current) => Math.max(current - 1, 0));
                    }}
                    type="button"
                    variant="outline"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                ) : (
                  <span className="text-xs text-[#777777]">
                    You can go back and change your answers
                  </span>
                )}
                {step < steps.length - 1 ? (
                  <Button
                    className="min-h-11 min-w-32"
                    disabled={isSaving}
                    onClick={goNext}
                    type="button"
                  >
                    Continue
                    <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button
                    aria-busy={isSaving}
                    className="min-h-11 min-w-40"
                    disabled={isSaving}
                    onClick={finishOnboarding}
                    type="button"
                  >
                    {isSaving ? (
                      <>
                        <LoaderCircle className="animate-spin" size={16} />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Lightbulb size={16} />
                        Finish onboarding
                      </>
                    )}
                  </Button>
                )}
              </footer>
            </>
          )}
        </section>

        <p className="mx-auto mt-5 flex max-w-2xl items-center justify-center gap-2 text-center text-xs leading-5 text-[#777777]">
          <FolderKanban className="shrink-0 text-[#454545]" size={15} />
          Your answers help us recommend projects that fit your goals and
          experience.
        </p>
      </div>
    </main>
  );
}
