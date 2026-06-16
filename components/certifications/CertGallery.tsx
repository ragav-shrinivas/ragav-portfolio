"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { ParticleField } from "@/components/ui/ParticleField";
import type { Certification } from "@/data/certifications";

export function CertGallery({ certs }: { certs: Certification[] }) {
  const cert = certs[0];

  return (
    <>
      <header className="relative overflow-hidden pt-40 pb-10 text-center md:pt-48">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.3),rgba(255,31,31,0.15)_50%,transparent_70%)] blur-[90px]" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-label relative text-blue"
        >
          Verified Credential
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-4 font-display text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] text-chrome"
        >
          Certifications
        </motion.h1>
        <p className="relative mx-auto mt-5 max-w-xl px-6 text-white/55">
          Enterprise engineering on the SAP stack, independently verifiable.
        </p>
      </header>

      {cert && (
        <section className="relative mx-auto max-w-4xl overflow-hidden px-6 py-16 md:px-10 md:py-24">
          <ParticleField className="opacity-50" density={36} />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1600 }}
          >
            <TiltCard className="group" max={6}>
              <div className="glass-strong energy-border relative overflow-hidden rounded-[2.5rem] p-10 md:p-16">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_0%,rgba(96,165,250,0.2),transparent_55%)]" />

                <div className="relative grid items-center gap-12 md:grid-cols-[auto_1fr]">
                  {/* Badge / image */}
                  <div className="relative grid place-items-center" style={{ transform: "translateZ(50px)" }}>
                    <motion.div
                      className="absolute h-48 w-48 rounded-full opacity-60 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(circle,rgba(59,130,246,0.5),rgba(255,31,31,0.3) 50%,transparent 70%)",
                      }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative grid h-40 w-40 place-items-center rounded-3xl border border-white/10 bg-white/5 md:h-48 md:w-48">
                      <span className="font-display text-3xl uppercase tracking-wide text-plasma md:text-4xl">
                        SAP
                      </span>
                    </div>
                    <span className="absolute -right-2 -top-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                      {cert.year}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ transform: "translateZ(30px)" }}>
                    <p className="text-label text-red">{cert.issuer}</p>
                    <h2 className="mt-3 font-display text-2xl uppercase leading-tight text-chrome md:text-4xl">
                      {cert.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
                      {cert.description}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                      {cert.credentialId && (
                        <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/40">
                          ID · {cert.credentialId}
                        </span>
                      )}
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-blue transition-colors hover:text-white"
                        >
                          Verify credential
                          <span className="transition-transform duration-500 group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </section>
      )}
    </>
  );
}
