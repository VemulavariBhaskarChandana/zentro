"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/project-catalog";

const controlClass =
  "min-h-11 rounded-xl border border-[#ded7c9] bg-[#fffdf8] px-3 text-sm text-[#3d3932] outline-none focus:border-[#d6a72c] focus:ring-4 focus:ring-[#d6a72c]/15";

export function ProjectBrowser({
  projects,
  initialProjectType = "",
  initialDifficulty = "",
}: {
  projects: Project[];
  initialProjectType?: string;
  initialDifficulty?: string;
}) {
  const [projectType, setProjectType] = useState(initialProjectType);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const hasFilters = Boolean(projectType || difficulty);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      return (
        (!projectType || project.project_type === projectType) &&
        (!difficulty || project.difficulty === difficulty)
      );
    });
  }, [difficulty, projectType, projects]);

  function clearFilters() {
    setProjectType("");
    setDifficulty("");
  }

  return (
    <>
      <section
        aria-label="Filter projects"
        className="mb-6 grid max-w-2xl gap-4 rounded-2xl border border-[#e8e1d4] bg-[#faf7f0] p-4 sm:grid-cols-2 sm:p-5"
      >
        <label>
          <span className="mb-2 block text-sm font-semibold text-[#4b473f]">
            Project level
          </span>
          <select
            className={`${controlClass} w-full`}
            onChange={(event) => setProjectType(event.target.value)}
            value={projectType}
          >
            <option value="">All project levels</option>
            <option value="Basic">Basic</option>
            <option value="Mini">Mini</option>
            <option value="Major">Major</option>
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-[#4b473f]">
            Difficulty
          </span>
          <select
            className={`${controlClass} w-full`}
            onChange={(event) => setDifficulty(event.target.value)}
            value={difficulty}
          >
            <option value="">All difficulty levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        {hasFilters ? (
          <button
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-[#e5dccb] bg-[#fffdf8] px-4 text-sm font-semibold text-[#6f685c] transition hover:border-[#d6a72c] hover:bg-[#f5f0e6] active:scale-[0.98] sm:col-span-2"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        ) : null}
      </section>

      <div className="mb-4 text-sm text-[#77736a]" aria-live="polite" aria-atomic="true">
        Showing {filteredProjects.length}{" "}
        {filteredProjects.length === 1 ? "project" : "projects"}
      </div>
      {filteredProjects.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d9cfba] bg-[#faf7f0] p-9 text-center">
          <h2 className="font-semibold">No projects match those filters</h2>
          <p className="mt-2 text-sm text-[#77736a]">
            Clear your filters to see more project ideas.
          </p>
          <button
            className="mt-4 rounded-lg bg-[#d6a72c] px-4 py-2 text-sm font-semibold text-[#24221e] transition-transform active:scale-[0.98] hover:bg-[#e0b53e]"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
