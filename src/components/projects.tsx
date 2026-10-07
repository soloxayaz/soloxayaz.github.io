import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  categories,
  projects as fallbackProjects,
  type Category,
  type Project,
} from "@/lib/content";
import { fetchProjects } from "@/lib/portfolio-data";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProjectPattern } from "@/components/project-pattern";
import { SectionLabel } from "@/components/reveal";

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const inner = (
    <>
      <ProjectPattern pattern={project.pattern} />
      <div className="card-wash absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-5xl leading-none text-paper/15 tabular-nums sm:text-6xl">
            {project.index}
          </span>
          <span className="font-mono text-2xs tracking-[0.18em] text-dim uppercase">
            {project.category} · {project.year}
          </span>
        </div>
        <div>
          <h3 className="font-display text-3xl tracking-tight text-paper sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-dim md:hidden">
            {project.summary}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden md:block",
          "translate-y-full bg-ink/92 p-7",
          "transition-transform duration-300 ease-out",
          "group-hover:translate-y-0 group-focus-visible:translate-y-0",
        )}
      >
        <p className="max-w-md text-sm leading-relaxed text-paper">{project.summary}</p>
        <p className="mt-4 flex items-center gap-2 font-mono text-2xs tracking-[0.18em] text-accent uppercase">
          open
          <ArrowUpRight className="size-3.5" />
        </p>
      </div>
    </>
  );

  const cls = cn(
    "group relative block min-h-72 overflow-hidden rounded-lg bg-elevated shadow-border",
    "transition-[transform,box-shadow] duration-300 ease-out",
    "hover:-translate-y-1 hover:shadow-border-hover",
    "focus-visible:outline-offset-4",
    featured && "md:col-span-2 md:min-h-96",
  );

  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={project.href as "/"} className={cls}>
      {inner}
    </Link>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Category>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const reduced = useReducedMotion();

  // Published projects come from Supabase (the same rows the admin panel edits).
  // fetchProjects falls back to the built-in list if the database is unreachable.
  useEffect(() => {
    let active = true;

    fetchProjects()
      .then((rows) => {
        if (active) setProjects(rows);
      })
      .catch(() => {
        if (active) setProjects(fallbackProjects);
      });

    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <section id="work" className="relative z-10 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="01">projects</SectionLabel>

        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md font-display text-2xl text-paper italic sm:text-3xl">
            tools, utilities and web builds.
          </p>
          <LayoutGroup>
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {categories.map((cat) => {
                const on = filter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setFilter(cat)}
                    className={cn(
                      "relative h-11 min-w-11 overflow-hidden rounded-full px-4 font-mono text-2xs tracking-[0.16em] uppercase",
                      "transition-colors duration-200",
                      on ? "text-ink" : "text-dim hover:text-paper",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId={reduced ? undefined : "chip-pill"}
                        className="absolute inset-0 rounded-full bg-paper"
                        transition={{ duration: 0.28, ease: easeOut }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.04, ease: easeOut }}
                className={i === 0 && filter === "all" ? "md:col-span-2" : undefined}
              >
                <ProjectCard project={project} featured={i === 0 && filter === "all"} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
