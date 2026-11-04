import { z } from "zod";

export const qualifications = [
  "BCA",
  "BSc",
  "B.Tech",
  "BE",
  "MCA",
  "MSc",
  "Other",
] as const;

export const projectTypes = [
  "Basic Project",
  "Mini Project",
  "Major Project",
  "Not Sure Yet",
] as const;

export const technicalLevels = [
  "Complete Beginner",
  "Basic Knowledge",
  "Intermediate",
  "Advanced",
] as const;

export const interestAreas = [
  "Artificial Intelligence & Machine Learning",
  "Web Development",
  "Python",
  "Java",
  "Data Science",
  "Mobile App Development",
  "Cloud Computing",
  "Cybersecurity",
  "Internet of Things",
  "Other",
] as const;

export const projectGoals = [
  "College submission",
  "Learning new skills",
  "Resume building",
  "Real-world problem solving",
] as const;

export type StudentOnboardingFormData = Omit<
  StudentOnboardingData,
  | "qualification"
  | "projectType"
  | "technicalLevel"
  | "hasProjectIdea"
  | "projectGoal"
> & {
  qualification: (typeof qualifications)[number] | null;
  projectType: (typeof projectTypes)[number] | null;
  technicalLevel: (typeof technicalLevels)[number] | null;
  hasProjectIdea: boolean | null;
  projectGoal: (typeof projectGoals)[number] | null;
};

export const studentOnboardingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  collegeName: z.string().trim().min(2, "Enter your college name.").max(180),
  qualification: z.enum(qualifications, {
    error: "Choose your qualification.",
  }),
  department: z.string().trim().min(2, "Enter your department.").max(120),
  currentYear: z.string().trim().min(1, "Enter your current semester or year.").max(60),
  projectType: z.enum(projectTypes, {
    error: "Choose the type of project you are looking for.",
  }),
  technicalLevel: z.enum(technicalLevels, {
    error: "Choose your current technical knowledge level.",
  }),
  interests: z
    .array(z.enum(interestAreas))
    .min(1, "Choose at least one area of interest.")
    .max(interestAreas.length)
    .refine((values) => new Set(values).size === values.length, {
      error: "Remove duplicate interests.",
    }),
  hasProjectIdea: z.boolean({
    error: "Tell us whether you already have a project idea.",
  }),
  projectGoal: z.enum(projectGoals, {
    error: "Choose your main project goal.",
  }),
  additionalRequirements: z
    .string()
    .trim()
    .max(2000, "Keep additional requirements under 2,000 characters."),
});

export type StudentOnboardingData = z.infer<typeof studentOnboardingSchema>;

export function createEmptyOnboardingData(
  fullName = "",
): StudentOnboardingFormData {
  return {
    fullName,
    collegeName: "",
    qualification: null,
    department: "",
    currentYear: "",
    projectType: null,
    technicalLevel: null,
    interests: [],
    hasProjectIdea: null,
    projectGoal: null,
    additionalRequirements: "",
  };
}
