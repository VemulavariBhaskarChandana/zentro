import Link from "next/link";
import {
  BrainCircuit,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Coffee,
  Cpu,
  Globe2,
  Shield,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { ProjectCategory } from "@/lib/project-catalog";

const icons: Record<string, LucideIcon> = {
  globe: Globe2,
  brain: BrainCircuit,
  code: Code2,
  coffee: Coffee,
  chart: ChartNoAxesCombined,
  mobile: Smartphone,
  cloud: Cloud,
  shield: Shield,
  cpu: Cpu,
};

export function ProjectCategoryCard({
  category,
}: {
  category: ProjectCategory;
}) {
  const Icon = icons[category.icon] ?? Code2;
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#e4e4e2] bg-[#fcfcfb] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[#e5e5e3]/60 hover:shadow-[0_18px_38px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-[#ebebea] text-[#454545]">
          <Icon size={21} />
        </span>
        <span className="rounded-full bg-[#ffffff] px-3 py-1 text-xs font-semibold text-[#666666]">
          {category.project_count ?? 0}{" "}
          {(category.project_count ?? 0) === 1 ? "project" : "projects"}
        </span>
      </div>
      <h2 className="text-base font-semibold leading-6 tracking-[-0.02em]">
        {category.name}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#666666]">
        {category.description}
      </p>
      <div className="mt-4 border-t border-[#e4e4e2] pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#666666]">
          You could build
        </p>
        <p className="mt-1 text-xs leading-5 text-[#666666]">
          {category.build_examples}
        </p>
        <p className="mt-3 flex flex-wrap gap-1.5">
          {category.technologies.slice(0, 4).map((technology) => (
            <span
              className="rounded-md bg-[#ffffff] px-2 py-1 text-[0.68rem] font-medium text-[#666666]"
              key={technology}
            >
              {technology}
            </span>
          ))}
        </p>
      </div>
      <div className="mt-auto pt-5">
        <Link
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#e5e5e3] px-4 py-2.5 text-sm font-semibold text-[#1b1b1b] no-underline transition group-hover:bg-[#d8d8d5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e5e5e3]/30"
          href={`/categories/${category.slug}`}
        >
          Explore Projects
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
