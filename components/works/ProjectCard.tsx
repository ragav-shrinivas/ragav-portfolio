"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const accent = project.category === "ml" ? "blue" : "red";

  const enter = () => {
    setHover(true);
    videoRef.current?.play().catch(() => {});
  };
  const leave = () => {
    setHover(false);
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      onMouseEnter={enter}
      onMouseLeave={leave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="energy-border hover-lift glass group relative block w-full overflow-hidden rounded-3xl text-left"
    >
      {/* Media */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {/* gradient base */}
        <div
          className={cn(
            "absolute inset-0",
            accent === "blue"
              ? "bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.35),rgba(5,5,5,0.9))]"
              : "bg-[radial-gradient(circle_at_30%_30%,rgba(255,31,31,0.3),rgba(5,5,5,0.9))]"
          )}
        />
        {project.posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.posterUrl}
            alt={project.title}
            className={cn(
              "absolute inset-0 h-full w-full object-contain p-10 transition-all duration-700",
              hover ? "scale-105 opacity-90" : "opacity-70"
            )}
          />
        )}
        {project.videoUrl && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              hover ? "opacity-100" : "opacity-0"
            )}
          />
        )}
        {/* scanline sweep on hover */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent transition-transform duration-700",
            hover ? "translate-y-full" : "-translate-y-full"
          )}
        />
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              accent === "blue"
                ? "bg-blue-bright shadow-[0_0_10px_3px_rgba(96,165,250,0.7)]"
                : "bg-red shadow-[0_0_10px_3px_rgba(255,31,31,0.7)]"
            )}
          />
          <span className="text-label text-white/60">
            {project.category === "ml" ? "AI / ML" : "Website"}
          </span>
        </div>
        <span className="absolute right-5 top-5 font-mono text-xs text-white/40">
          {project.year}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 md:p-7">
        <h3 className="font-display text-2xl uppercase tracking-wide text-white md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-white/50">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
          <span>Open case</span>
          <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </motion.button>
  );
}
