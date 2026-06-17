"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type Accent = "red" | "blue";

interface Reel {
  src: string;
  link: string;
  label: string;
  accent: Accent;
}

const reels: Reel[] = [
  {
    src: "/videos/video1.mp4",
    link: "https://www.instagram.com/reel/DTA6cJ8jzMZ/?igsh=MW5xNHJ0ZHZybnhneQ==",
    label: "REEL_01",
    accent: "red",
  },
  {
    src: "/videos/video2.mp4",
    link: "https://www.instagram.com/reel/DTLPTOYD52M/?igsh=eXJqOXVsYWQ0b3ow",
    label: "REEL_02",
    accent: "blue",
  },
  {
    src: "/videos/video3.mp4",
    link: "https://www.instagram.com/reel/DTnZtT0CYOe/?igsh=YWZzZGVwMzhicDQ=",
    label: "REEL_03",
    accent: "red",
  },
  {
    src: "/videos/video4.mp4",
    link: "https://www.instagram.com/reel/DLNDzKUzVRu/?igsh=MTBuMGRxczZiaDF4ag==",
    label: "REEL_04",
    accent: "blue",
  },
  {
    src: "/videos/video5.mp4",
    link: "https://www.instagram.com/reel/DS40jwCk0b5/?igsh=b29maGh1NHB1Nm5r",
    label: "REEL_05",
    accent: "red",
  },
  {
    src: "/videos/video6.mp4",
    link: "https://www.instagram.com/reel/DPtbEUhE5r-/?igsh=MWZ1MTBlbXZibzY1bQ==",
    label: "REEL_06",
    accent: "blue",
  },
];

const markers = ["00:00", "00:08", "00:15", "00:23", "00:31", "00:40"];

/**
 * A single Creative Work reel card. Plays a muted, looping preview only while
 * on screen (IntersectionObserver → mobile-friendly, no off-screen decoding),
 * tilts toward the cursor in 3D, and opens its Instagram Reel on click.
 */
function ReelCard({ reel, index }: { reel: Reel; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cursor-reactive 3D tilt (no-op on touch — there's no mousemove).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [6, -6]);
  const rotateX = useTransform(sy, [0, 1], [-6, 6]);

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

  // Play only while visible — keeps scrolling smooth and avoids decoding all
  // six clips at once on mobile.
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
      href={reel.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${reel.label} on Instagram`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group block animate-float"
    >
      <div
        className={cn(
          "energy-border glass relative aspect-[9/13] overflow-hidden rounded-2xl transition-shadow duration-500",
          reel.accent === "red"
            ? "group-hover:shadow-[0_0_45px_-6px_rgba(255,31,31,0.55)]"
            : "group-hover:shadow-[0_0_45px_-6px_rgba(59,130,246,0.55)]"
        )}
      >
        {/* Preview video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={reel.src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
        />

        {/* Accent wash + readability gradient */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            reel.accent === "red"
              ? "bg-[radial-gradient(circle_at_50%_25%,rgba(255,31,31,0.18),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_50%_25%,rgba(59,130,246,0.18),transparent_60%)]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/80 via-transparent to-base/20" />

        {/* Holographic glow sweep / glass reflection pass on hover */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -inset-y-2 -left-3/4 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[260%]" />
        </div>

        {/* Play icon overlay */}
        <div className="absolute inset-0 grid place-items-center">
          <span
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full border pl-0.5 backdrop-blur-sm transition-all duration-300 group-hover:scale-110",
              reel.accent === "red"
                ? "border-red/40 bg-red/15 text-red"
                : "border-blue/40 bg-blue/15 text-blue"
            )}
          >
            ▶
          </span>
        </div>

        {/* Label + Instagram hint */}
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
          {reel.label}
        </span>
        <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Instagram ↗
        </span>
      </div>
    </motion.a>
  );
}

export function ComingSoon() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-28 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,31,0.14),rgba(59,130,246,0.12)_50%,transparent_72%)] blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-red to-blue-bright" />
            <span className="text-label text-white/60">Creative Work</span>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-red/30 bg-red/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red shadow-[0_0_8px_2px_rgba(255,31,31,0.7)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red">
                Featured Reels
              </span>
            </span>
          </div>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,4.8vw,4rem)] uppercase leading-[0.95] text-chrome">
            Video Editing &amp; Content Creation
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Professional video editing, cinematic storytelling, social media
            content creation, advertising creatives, motion graphics and
            branded content.
          </p>
        </Reveal>

        {/* Reel strip — live preview videos linking to Instagram */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {reels.map((reel, i) => (
            <ReelCard key={reel.label} reel={reel} index={i} />
          ))}
        </div>

        {/* Floating timeline markers */}
        <div className="relative mt-12 h-14 overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
          {markers.map((m, i) => (
            <motion.div
              key={m}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
              className="absolute top-1/2 flex -translate-y-1/2 flex-col items-center gap-2"
              style={{ left: `${(i / (markers.length - 1)) * 100}%` }}
            >
              <span className="h-3 w-px bg-gradient-to-b from-blue-bright to-red" />
              <span className="font-mono text-[10px] text-white/35">{m}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
