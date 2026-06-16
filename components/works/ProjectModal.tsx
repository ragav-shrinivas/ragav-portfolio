"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Project } from "@/data/projects";

const links = (p: Project) =>
  [
    p.websiteUrl && p.websiteUrl !== "#" ? { label: "Visit Site", href: p.websiteUrl } : null,
    p.researchUrl && p.researchUrl !== "#" ? { label: "Research Paper", href: p.researchUrl } : null,
    p.githubUrl && p.githubUrl !== "#" ? { label: "GitHub", href: p.githubUrl } : null,
  ].filter(Boolean) as { label: string; href: string }[];

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (project) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  const accent = project?.category === "ml" ? "blue" : "red";
  const projectLinks = project ? links(project) : [];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl md:p-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong energy-border relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl"
          >
            {/* Header media */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-3xl">
              <div
                className={cn(
                  "absolute inset-0",
                  accent === "blue"
                    ? "bg-[radial-gradient(circle_at_40%_30%,rgba(59,130,246,0.4),rgba(5,5,5,0.95))]"
                    : "bg-[radial-gradient(circle_at_40%_30%,rgba(255,31,31,0.35),rgba(5,5,5,0.95))]"
                )}
              />
              {project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : project.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.posterUrl}
                  alt={project.title}
                  className="absolute inset-0 h-full w-full object-contain p-14 opacity-90"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-label text-white/60">
                  {project.category === "ml" ? "AI / Machine Learning" : "Website"} · {project.year}
                </span>
                <h2 className="mt-2 font-display text-4xl uppercase text-chrome md:text-6xl">
                  {project.title}
                </h2>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 transition-colors hover:text-white"
            >
              ✕
            </button>

            {/* Body */}
            <div className="p-7 md:p-10">
              <p className="text-lg leading-relaxed text-white/70">{project.description}</p>

              <div className="mt-8">
                <p className="text-label text-white/40">Tech Stack</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {projectLinks.length > 0 && (
                <div className="mt-9 flex flex-wrap gap-3">
                  {projectLinks.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="energy-border rounded-full bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
