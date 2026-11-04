import Link from "next/link";
import {
  ArrowUpRight,
  BrainCircuit,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Coffee,
  Cpu,
  Globe2,
  Shield,
  Smartphone,
  Clock3,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/lib/project-catalog";

const categoryIllustrations: Record<string, LucideIcon> = {
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

export function ProjectCard({ project }: { project: Project }) {
  const Illustration = categoryIllustrations[project.category.icon] ?? Code2;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e1d4] bg-[#faf7f0] shadow-[0_12px_30px_rgba(59,46,20,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(59,46,20,0.08)]">
      <div
        aria-hidden="true"
        className="relative grid h-36 place-items-center overflow-hidden border-b border-[#e8e1d4] bg-[radial-gradient(circle_at_30%_25%,#fffdf8_0,#f1e7cb_46%,#e8dcc0_100%)]"
      >
        <span className="absolute -left-7 -top-14 size-36 rounded-full border border-[#c7a64e]/30" />
        <span className="absolute -right-3 -bottom-20 size-48 rounded-full border border-[#c7a64e]/30" />
        <span className="relative grid size-16 place-items-center rounded-[1.4rem] border border-[#ddc687] bg-[#fffdf8] text-[#927016] shadow-[0_12px_30px_rgba(59,46,20,0.08)] transition-transform group-hover:scale-105">
          <Illustration size={29} strokeWidth={1.7} />
        </span>
        <span className="absolute bottom-3 left-4 rounded-full border border-[#dfd2b7] bg-[#fffdf8]/90 px-2.5 py-1 text-[0.68rem] font-semibold text-[#6e5d36]">
          {project.category.name}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f1e7cb] px-2.5 py-1 text-[0.68rem] font-semibold text-[#765b1a]">
            {project.project_type} project
          </span>
          <span className="rounded-full bg-[#ece9e1] px-2.5 py-1 text-[0.68rem] font-semibold text-[#625d54]">
            {project.difficulty}
          </span>
        </div>
        <h2 className="text-lg font-semibold leading-6 tracking-[-0.03em]">
          {project.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#77736a]">
          {project.short_description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#e8e1d4] pt-4">
          {project.technologies.slice(0, 4).map((technology) => (
            <span
              className="max-w-full break-words rounded-md border border-[#e8e1d4] bg-[#fffdf8] px-2.5 py-1.5 text-[0.68rem] leading-4 text-[#6c665b]"
              key={technology}
            >
              {technology}
            </span>
          ))}
        </div>
        <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg bg-[#f3eee3] px-3 py-2.5 text-xs leading-5 text-[#77736a]">
          <Clock3 className="shrink-0 text-[#927016]" size={14} />
          <span className="font-medium">Suggested duration:</span>
          <span className="break-words">{project.suggested_duration}</span>
        </div>
        <Link
          className="mt-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#d6a72c]/70 px-4 py-2.5 text-sm font-semibold text-[#765b1a] no-underline transition hover:bg-[#fff5db] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d6a72c]/25 sm:mt-5"
          href={`/projects/${project.slug}`}
        >
          View Details
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
