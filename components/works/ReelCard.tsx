"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/cn";
import type { Reel } from "@/data/reels";

/** Inline Instagram glyph (no extra dependency). */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Videography reel card for the Works page. Autoplays a muted, looping preview
 * (only while on screen), tilts toward the cursor with a magnetic 3D feel, and
 * opens its Instagram Reel on click.
 */
export function ReelCard({ reel, index }: { reel: Reel; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const red = reel.accent === "red";

  // Cursor-reactive 3D tilt + magnetic shift (no-op on touch devices).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 16 });
  const sy = useSpring(py, { stiffness: 150, damping: 16 });
  const rotateY = useTransform(sx, [0, 1], [7, -7]);
  const rotateX = useTransform(sy, [0, 1], [-7, 7]);
  const tx = useTransform(sx, [0, 1], [-6, 6]);
  const ty = useTransform(sy, [0, 1], [-6, 6]);

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  // Play only while visible — keeps scrolling smooth on mobile.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <motion.a
      ref={cardRef}
      href={reel.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${reel.title} on Instagram`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, x: tx, y: ty, transformPerspective: 1000 }}
      className="group block"
    >
      <div
        className={cn(
          "energy-border glass relative overflow-hidden rounded-3xl transition-shadow duration-500",
          red
            ? "group-hover:shadow-[0_0_55px_-8px_rgba(255,31,31,0.55)]"
            : "group-hover:shadow-[0_0_55px_-8px_rgba(59,130,246,0.55)]"
        )}
      >
        {/* Media */}
        <div className="relative aspect-[9/13] w-full overflow-hidden">
          <video
            ref={videoRef}
            src={reel.videoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Accent wash + readability gradient */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0",
              red
                ? "bg-[radial-gradient(circle_at_50%_20%,rgba(255,31,31,0.16),transparent_60%)]"
                : "bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.16),transparent_60%)]"
            )}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/20 to-base/30" />

          {/* Glow-pulse ring */}
          <div
            className="pointer-events-none absolute inset-0 animate-pulse-glow rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              boxShadow: red
                ? "inset 0 0 60px -20px rgba(255,31,31,0.6)"
                : "inset 0 0 60px -20px rgba(59,130,246,0.6)",
            }}
          />

          {/* Holographic glass reflection sweep on hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -inset-y-2 -left-3/4 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[260%]" />
          </div>

          {/* Category tag */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                red
                  ? "bg-red shadow-[0_0_10px_3px_rgba(255,31,31,0.7)]"
                  : "bg-blue-bright shadow-[0_0_10px_3px_rgba(96,165,250,0.7)]"
              )}
            />
            <span className="rounded-full border border-white/15 bg-base/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm">
              {reel.tag}
            </span>
          </div>

          {/* Instagram icon */}
          <span
            className={cn(
              "absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border bg-base/40 backdrop-blur-sm transition-colors",
              red
                ? "border-red/40 text-red"
                : "border-blue/40 text-blue-bright"
            )}
          >
            <InstagramIcon className="h-4 w-4" />
          </span>

          {/* Center play badge */}
          <div className="absolute inset-0 grid place-items-center">
            <span
              className={cn(
                "grid h-12 w-12 place-items-center rounded-full border pl-0.5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110",
                red
                  ? "border-red/40 bg-red/15 text-red"
                  : "border-blue/40 bg-blue/15 text-blue"
              )}
            >
              ▶
            </span>
          </div>

          {/* Title + View Reel button (over the gradient base) */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
              {`Reel ${String(reel.order).padStart(2, "0")}`}
            </span>
            <h3 className="mt-1 font-display text-xl uppercase leading-tight tracking-wide text-white md:text-2xl">
              {reel.title}
            </h3>
            <span
              className={cn(
                "mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                red
                  ? "border-red/40 bg-red/10 text-red group-hover:bg-red/20"
                  : "border-blue/40 bg-blue/10 text-blue-bright group-hover:bg-blue/20"
              )}
            >
              View Reel
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                ↗
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
