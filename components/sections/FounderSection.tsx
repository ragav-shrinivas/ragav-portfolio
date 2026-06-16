"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { DepthSection } from "@/components/ui/DepthSection";
import { ParticleField } from "@/components/ui/ParticleField";
import { TiltCard } from "@/components/ui/TiltCard";
import { founder } from "@/data/founder";

export function FounderSection() {
  const { kicker, subtitle, venture } = founder;

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-28 md:py-40">
      <ParticleField className="opacity-70" density={52} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,31,0.18),rgba(59,130,246,0.16)_45%,transparent_72%)] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-blue-bright to-red" />
            <span className="text-label text-white/60">{kicker}</span>
          </div>
          <h2 className="mt-5 max-w-2xl font-display text-[clamp(2.4rem,5vw,4.5rem)] uppercase leading-[0.95] text-chrome">
            {subtitle}
          </h2>
        </Reveal>

        <DepthSection className="mt-14">
          <TiltCard className="group" max={8}>
            <a
              href={venture.link}
              target="_blank"
              rel="noopener noreferrer"
              className="energy-border glass-strong relative block overflow-hidden rounded-[2rem] p-8 md:p-14"
            >
              {/* sheen */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_70%_0%,rgba(96,165,250,0.18),transparent_55%)]" />

              <div className="relative grid items-center gap-10 md:grid-cols-[auto_1fr]">
                {/* Logo */}
                <div className="relative grid place-items-center" style={{ transform: "translateZ(60px)" }}>
                  <motion.div
                    className="absolute h-44 w-44 rounded-full opacity-60 blur-2xl"
                    style={{ background: "radial-gradient(circle,rgba(255,31,31,0.5),rgba(59,130,246,0.4) 50%,transparent 70%)" }}
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={venture.logo}
                    alt="EVO9"
                    className="relative h-32 w-auto drop-duo md:h-44"
                  />
                </div>

                {/* Copy */}
                <div style={{ transform: "translateZ(30px)" }}>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-5xl uppercase tracking-wide text-plasma md:text-7xl">
                      {venture.title}
                    </h3>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                      Startup
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/45">
                    {venture.descriptor}
                  </p>

                  <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                    {venture.description}
                  </p>

                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:text-blue">
                    Explore EVO9
                    <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                  </span>
                </div>
              </div>
            </a>
          </TiltCard>
        </DepthSection>
      </div>
    </section>
  );
}
