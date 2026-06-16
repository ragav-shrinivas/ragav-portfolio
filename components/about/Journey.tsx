"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { journey, stats, creativeRoles, creativeSummary } from "@/data/about";
import { siteConfig } from "@/lib/config";

export function Journey() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start center", "end center"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* Intro */}
      <header className="relative overflow-hidden pt-40 pb-16 md:pt-48">
        <div className="pointer-events-none absolute right-0 top-20 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,31,31,0.22),transparent_70%)] blur-[110px]" />
        <div className="pointer-events-none absolute left-0 top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_70%)] blur-[110px]" />
        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          <Reveal>
            <p className="text-label text-blue">The Journey</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] text-chrome">
              One mind,
              <br />
              <span className="text-plasma">six disciplines</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
              Ragav engineers across the full spectrum — from neural networks and
              enterprise SAP systems to cinematic interfaces and 3D motion. Every
              layer of the stack, unified by a single obsession: building software
              that feels alive.
            </p>
          </Reveal>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="glass rounded-2xl p-5 text-center">
                  <div className="font-display text-4xl text-plasma">{s.value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </header>

      {/* Creative & marketing disciplines */}
      <section className="relative mx-auto max-w-5xl px-6 py-12 md:px-10">
        <Reveal>
          <div className="glass energy-border rounded-3xl p-8 md:p-10">
            <p className="text-label text-red">Beyond Engineering</p>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/70">
              {creativeSummary}
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {creativeRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/65"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Timeline */}
      <section ref={lineRef} className="relative mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
        {/* Energy spine */}
        <div className="absolute bottom-0 left-6 top-0 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
          <motion.div
            style={{ height: fill }}
            className="w-full bg-gradient-to-b from-blue-bright via-red to-red shadow-[0_0_14px_2px_rgba(255,31,31,0.5)]"
          />
        </div>

        <div className="space-y-16 md:space-y-24">
          {journey.map((node, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={node.id}
                className={cn(
                  "relative pl-16 md:w-1/2 md:pl-0",
                  left ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                )}
              >
                {/* Node dot */}
                <span
                  className={cn(
                    "absolute top-1.5 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-base",
                    "left-[9px] md:left-auto",
                    left ? "md:-right-[14px]" : "md:-left-[14px]"
                  )}
                >
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      node.accent === "red"
                        ? "bg-red shadow-[0_0_12px_3px_rgba(255,31,31,0.7)]"
                        : "bg-blue-bright shadow-[0_0_12px_3px_rgba(96,165,250,0.7)]"
                    )}
                  />
                </span>

                <Reveal from={left ? "right" : "left"}>
                  <div className="glass energy-border hover-lift rounded-2xl p-6 md:p-7">
                    <span className="text-label text-white/45">{node.period}</span>
                    <h3 className="mt-3 font-display text-2xl uppercase text-white md:text-3xl">
                      {node.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 font-mono text-xs uppercase tracking-[0.14em]",
                        node.accent === "red" ? "text-red" : "text-blue"
                      )}
                    >
                      {node.org}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/55">
                      {node.description}
                    </p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-24 text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] uppercase text-chrome">
            Let&apos;s build something alive
          </h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className="energy-border mt-8 inline-block rounded-full bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-white/10"
          >
            {siteConfig.email}
          </a>
        </Reveal>
      </section>
    </>
  );
}
