"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";

const sites = projects.filter((p) => p.category === "website");

export function ProductionProjects() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-28 md:py-36">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_70%)] blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-red to-blue-bright" />
            <span className="text-label text-white/60">In Production</span>
          </div>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,4.8vw,4rem)] uppercase leading-[0.95] text-chrome">
            Client Websites Shipped To Production
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {sites.map((site, i) => {
            const hasLink = !!site.websiteUrl && site.websiteUrl !== "#";
            const category = site.tech.find((t) =>
              ["Boutique", "Platform"].includes(t)
            );
            return (
              <Reveal key={site.id} delay={(i % 2) * 0.1}>
                <motion.a
                  href={hasLink ? site.websiteUrl : undefined}
                  target={hasLink ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.025 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="energy-border glass group relative block overflow-hidden rounded-3xl p-7 md:p-8"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_80%_0%,rgba(255,31,31,0.16),transparent_55%)]" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <span className="text-label text-red">
                        {category ?? "Website"}
                      </span>
                      <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-white md:text-4xl">
                        {site.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/55">{site.tagline}</p>
                    </div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-lg text-white/70 transition-all duration-500 group-hover:border-blue group-hover:text-blue group-hover:rotate-45">
                      ↗
                    </span>
                  </div>

                  <div className="relative mt-6 flex flex-wrap gap-2">
                    {site.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-white/45 transition-colors group-hover:text-white">
                    {hasLink ? "Visit live site" : "Live · link coming soon"}
                  </div>
                </motion.a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
