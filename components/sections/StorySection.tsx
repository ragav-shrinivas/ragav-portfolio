"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { StorySection as Story } from "@/data/story";

export function StorySection({ data }: { data: Story }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yCards = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const glowX = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const right = data.align === "right";

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-white/5 py-28 md:py-40"
    >
      {/* drifting ambient glow */}
      <motion.div
        style={{ x: glowX }}
        className={cn(
          "pointer-events-none absolute top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full opacity-30 blur-[120px]",
          right
            ? "right-0 bg-[radial-gradient(circle,rgba(255,31,31,0.5),transparent_70%)]"
            : "left-0 bg-[radial-gradient(circle,rgba(59,130,246,0.5),transparent_70%)]"
        )}
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 md:px-10 lg:grid-cols-2 lg:items-center">
        {/* Copy */}
        <div className={cn(right && "lg:order-2")}>
          <Reveal from={right ? "left" : "right"}>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-white/30">{data.index}</span>
              <span className="h-px w-10 bg-gradient-to-r from-blue-bright to-red" />
              <span className="text-label text-white/60">{data.kicker}</span>
            </div>
            <h2 className="mt-6 max-w-xl font-display text-[clamp(2.2rem,4.5vw,4rem)] uppercase leading-[0.95] text-chrome">
              {data.title}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
              {data.description}
            </p>
          </Reveal>
        </div>

        {/* Floating cards */}
        <motion.div
          style={{ y: yCards }}
          className={cn("flex flex-col gap-5", right && "lg:order-1")}
        >
          {data.cards.map((card, i) => (
            <Reveal key={card.title} from={right ? "right" : "left"} delay={i * 0.1}>
              <div className="energy-border hover-lift glass group rounded-2xl p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white md:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-white/40">
                      {card.meta}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      card.accent === "red"
                        ? "bg-red shadow-[0_0_14px_4px_rgba(255,31,31,0.6)]"
                        : "bg-blue-bright shadow-[0_0_14px_4px_rgba(96,165,250,0.6)]"
                    )}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
