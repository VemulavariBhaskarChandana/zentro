import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock3,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { CatalogStatus } from "@/components/catalog-status";
import { PlatformShell } from "@/components/platform-shell";
import { getProjectBySlug } from "@/lib/project-catalog";
import { requireUser } from "@/lib/auth";

export const instant = false;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireUser();
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (result.status === "not-found") notFound();

  return (
    <PlatformShell>
      {result.status !== "ready" ? (
        <CatalogStatus result={result} itemName="project details" />
      ) : (
        <>
          <Link
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#796018] no-underline hover:underline"
            href={`/categories/${result.data.category.slug}`}
          >
            <ArrowLeft size={16} />
            {result.data.category.name} projects
          </Link>

          <article>
            <header className="rounded-[1.65rem] border border-[#e7d9b8] bg-[#f7edda] p-6 sm:p-9 lg:p-11">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#fff9ed] px-3 py-1 text-xs font-semibold text-[#765b1a]">
                  {result.data.project_type} project
                </span>
                <span className="rounded-full bg-[#e9e1d0] px-3 py-1 text-xs font-semibold text-[#625d54]">
                  {result.data.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff9ed] px-3 py-1 text-xs text-[#6f685c]">
                  <Clock3 size={13} />
                  {result.data.suggested_duration}
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#927016]">
                {result.data.category.name}
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
                {result.data.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6f685c] sm:text-base">
                {result.data.short_description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {result.data.technologies.map((technology) => (
                  <span
                    className="rounded-lg border border-[#dfd2b7] bg-[#fff9ed] px-3 py-1.5 text-xs font-medium text-[#6e5d36]"
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </header>

            <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,0.8fr)]">
              <div className="grid gap-4">
                <InfoSection title="What is this project?" icon={Sparkles}>
                  {result.data.overview}
                </InfoSection>
                <InfoSection title="What problem does it solve?" icon={Lightbulb}>
                  {result.data.problem_solved}
                </InfoSection>
                <InfoSection title="How does it work?" icon={ArrowRight}>
                  {result.data.how_it_works}
                </InfoSection>
                <InfoSection title="Where is it used in real life?" icon={BadgeCheck}>
                  {result.data.real_world_application}
                </InfoSection>
                <ListSection title="Main features" items={result.data.main_features} />
              </div>
              <aside className="grid content-start gap-4">
                <TechnologySection
                  title="Frontend technologies"
                  items={result.data.frontend_technologies}
                  explanations={result.data.technology_explanations}
                />
                <TechnologySection
                  title="Backend technologies"
                  items={result.data.backend_technologies}
                  explanations={result.data.technology_explanations}
                />
                <TechnologySection
                  title="Database"
                  items={result.data.database_technologies}
                  explanations={result.data.technology_explanations}
                />
                <TechnologySection
                  title="Other tools and APIs"
                  items={result.data.other_tools}
                  explanations={result.data.technology_explanations}
                />
                <ListSection
                  title="What you’ll learn"
                  items={result.data.learning_outcomes}
                />
              </aside>
            </div>
          </article>

          <section className="mt-8 rounded-[1.5rem] border border-[#ddc687] bg-[#f1e7cb] p-6 sm:p-8">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#886510]">
              <Lightbulb size={15} />
              Personal mentoring
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.045em]">
              Need Complete Project Guidance?
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f685c]">
              Book a free demo to understand this project, choose suitable
              technologies, plan your development, and receive personal
              mentoring from a guide.
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#d6a72c] px-5 text-sm font-semibold text-[#24221e] no-underline transition hover:bg-[#e0b53e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d6a72c]/30"
              href={`/guidance?project=${encodeURIComponent(result.data.slug)}`}
            >
              Book a Free Demo
              <ArrowRight size={16} />
            </Link>
          </section>
        </>
      )}
    </PlatformShell>
  );
}

function InfoSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Sparkles;
  children: string;
}) {
  return (
    <section className="rounded-2xl border border-[#e8e1d4] bg-[#faf7f0] p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <Icon className="text-[#9a741a]" size={17} />
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#77736a]">{children}</p>
    </section>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-2xl border border-[#e8e1d4] bg-[#faf7f0] p-5">
      <h2 className="font-semibold">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li
            className="flex gap-2 text-sm leading-6 text-[#77736a]"
            key={item}
          >
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#d6a72c]" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TechnologySection({
  title,
  items,
  explanations,
}: {
  title: string;
  items: string[];
  explanations: Record<string, string>;
}) {
  if (!items.length) return null;
  return (
    <section className="rounded-2xl border border-[#e8e1d4] bg-[#faf7f0] p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 grid gap-3">
        {items.map((technology) => (
          <li key={technology}>
            <p className="text-sm font-semibold text-[#4a453c]">
              {technology}
            </p>
            {explanations[technology] ? (
              <p className="mt-1 text-xs leading-5 text-[#77736a]">
                {explanations[technology]}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
