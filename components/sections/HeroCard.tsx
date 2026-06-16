"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface HeroCardData {
  index: string;
  title: string;
  text: string;
  accent: "red" | "blue";
}

/**
 * Premium holographic glass card for the hero. Tilts toward the cursor in 3D
 * with a neon bloom that tracks the pointer. Reveal/parallax is driven by the
 * scroll-controlled wrapper in Hero — this component is purely presentational.
 */
export function HeroCard({ data }: { data: HeroCardData }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [9, -9]);
  const rotateX = useTransform(sy, [0, 1], [-9, 9]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    el.style.setProperty("--hx", `${x * 100}%`);
    el.style.setProperty("--hy", `${y * 100}%`);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      className="holo-card group relative h-full overflow-hidden rounded-2xl p-5 md:p-6"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="scan-sweep absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span
          className={
            data.accent === "red"
              ? "font-mono text-[10px] uppercase tracking-[0.2em] text-red"
              : "font-mono text-[10px] uppercase tracking-[0.2em] text-blue"
          }
        >
          {data.index}
        </span>
        <span
          className={
            data.accent === "red"
              ? "h-2 w-2 rounded-full bg-red shadow-[0_0_10px_3px_rgba(255,31,31,0.6)]"
              : "h-2 w-2 rounded-full bg-blue-bright shadow-[0_0_10px_3px_rgba(96,165,250,0.6)]"
          }
        />
      </div>

      <h3
        className="relative z-10 mt-4 font-display text-xl uppercase leading-tight tracking-wide text-white md:text-2xl"
        style={{ transform: "translateZ(30px)" }}
      >
        {data.title}
      </h3>
      <p
        className="relative z-10 mt-2.5 text-[13px] leading-relaxed text-white/60"
        style={{ transform: "translateZ(18px)" }}
      >
        {data.text}
      </p>
    </motion.div>
  );
}
