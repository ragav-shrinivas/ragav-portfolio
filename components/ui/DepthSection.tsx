"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Camera-style depth transition: as the section enters and leaves the viewport
 * it scales (zoom) and de-focuses (blur), giving the cinematic feeling of
 * moving between panels of an operating system rather than scrolling a page.
 */
export function DepthSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  // Transform + opacity only — GPU-cheap camera-zoom/depth, no per-frame blur.
  const scale = useTransform(p, [0, 0.5, 1], [0.93, 1, 0.95]);
  const opacity = useTransform(p, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.35]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, willChange: "transform, opacity" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
