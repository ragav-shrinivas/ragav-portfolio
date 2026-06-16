"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const reels = [
  { label: "REEL_01", accent: "red" as const },
  { label: "REEL_02", accent: "blue" as const },
  { label: "REEL_03", accent: "red" as const },
  { label: "REEL_04", accent: "blue" as const },
];

const markers = ["00:00", "00:08", "00:15", "00:23", "00:31", "00:40"];

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
                Coming Soon
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

        {/* Reel strip — floating video-thumbnail placeholders */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {reels.map((reel, i) => (
            <motion.div
              key={reel.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="animate-float"
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <div
                className={cn(
                  "energy-border glass relative aspect-[9/13] overflow-hidden rounded-2xl"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0",
                    reel.accent === "red"
                      ? "bg-[radial-gradient(circle_at_50%_30%,rgba(255,31,31,0.22),rgba(5,5,5,0.92))]"
                      : "bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.22),rgba(5,5,5,0.92))]"
                  )}
                />
                <div className="absolute inset-0 grid place-items-center">
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-full border backdrop-blur-sm",
                      reel.accent === "red"
                        ? "border-red/40 bg-red/10 text-red"
                        : "border-blue/40 bg-blue/10 text-blue"
                    )}
                  >
                    ▶
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {reel.label}
                </span>
              </div>
            </motion.div>
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
