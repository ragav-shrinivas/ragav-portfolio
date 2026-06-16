"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FrameVideo } from "@/components/ui/FrameVideo";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { cn } from "@/lib/cn";
import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

export function WorksClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects]
  );

  return (
    <>
      {/* Header with workframe footage */}
      <header className="relative flex h-[70vh] min-h-[520px] items-end overflow-hidden">
        <div className="absolute inset-0">
          <FrameVideo path="/frames/works/" count={240} fps={20} />
          <div className="absolute inset-0 bg-gradient-to-b from-base/70 via-base/40 to-base" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(circle_at_15%_70%,rgba(255,31,31,0.15),transparent_45%)]" />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-label text-blue"
          >
            Selected Work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] text-chrome"
          >
            The Works
          </motion.h1>
          <p className="mt-5 max-w-xl text-white/55">
            Machine-learning systems and production websites — engineered,
            shipped, and monitored in the real world.
          </p>
        </div>
      </header>

      {/* Filters + grid */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-12 flex flex-wrap gap-2">
          {projectCategories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                filter === c.key
                  ? "bg-white text-base"
                  : "border border-white/10 bg-white/5 text-white/55 hover:text-white"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={setSelected} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-20 text-center font-mono text-sm uppercase tracking-[0.2em] text-white/40">
            No projects in this category yet.
          </p>
        )}
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
