"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleField } from "@/components/ui/ParticleField";
import { cn } from "@/lib/cn";
import type { Certification } from "@/data/certifications";

// Sequential entry: card 1 from left, card 2 up, card 3 from right.
const entry = (i: number) => {
  const from =
    i % 3 === 0
      ? { x: -90, y: 0 }
      : i % 3 === 1
        ? { x: 0, y: 70 }
        : { x: 90, y: 0 };
  return {
    initial: { opacity: 0, ...from },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 14,
      delay: i * 0.12,
    },
  };
};

function CertCard({
  cert,
  index,
  onOpen,
}: {
  cert: Certification;
  index: number;
  onOpen: (c: Certification) => void;
}) {
  const red = index % 2 === 1; // alternate red / blue accents

  return (
    <motion.div {...entry(index)}>
      <button
        type="button"
        onClick={() => onOpen(cert)}
        className={cn(
          "group glass energy-border relative block w-full overflow-hidden rounded-3xl text-left transition-shadow duration-500",
          red
            ? "hover:shadow-[0_0_55px_-8px_rgba(255,31,31,0.5)]"
            : "hover:shadow-[0_0_55px_-8px_rgba(59,130,246,0.5)]"
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cert.imageUrl}
            alt={cert.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* accent wash + readability */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0",
              red
                ? "bg-[radial-gradient(circle_at_50%_0%,rgba(255,31,31,0.16),transparent_55%)]"
                : "bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.16),transparent_55%)]"
            )}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/70 via-transparent to-transparent" />

          {/* glass reflection sweep on hover */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -inset-y-2 -left-3/4 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]" />
          </div>

          {/* category + year */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                red
                  ? "bg-red shadow-[0_0_10px_3px_rgba(255,31,31,0.7)]"
                  : "bg-blue-bright shadow-[0_0_10px_3px_rgba(96,165,250,0.7)]"
              )}
            />
            <span className="rounded-full border border-white/15 bg-base/45 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm">
              {cert.issuer}
            </span>
          </div>
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-base/45 px-2 py-1 font-mono text-[10px] text-white/55 backdrop-blur-sm">
            {cert.year}
          </span>

          {/* zoom hint */}
          <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-base/50 text-white/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            ⤢
          </span>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6">
          <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-white md:text-xl">
            {cert.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-white/55">
            {cert.description}
          </p>
          {cert.verifyUrl && (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                red
                  ? "border-red/40 bg-red/10 text-red hover:bg-red/20"
                  : "border-blue/40 bg-blue/10 text-blue-bright hover:bg-blue/20"
              )}
            >
              Verify Credential
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </a>
          )}
        </div>
      </button>
    </motion.div>
  );
}

function Lightbox({
  cert,
  onClose,
}: {
  cert: Certification | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!cert) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cert, onClose]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-md md:p-8"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong energy-border relative w-full max-w-3xl overflow-hidden rounded-3xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-base/60 text-white/80 backdrop-blur-sm transition-colors hover:text-white"
            >
              ✕
            </button>

            {/* Full certificate image */}
            <div className="relative max-h-[60vh] overflow-hidden bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.imageUrl}
                alt={cert.title}
                className="mx-auto max-h-[60vh] w-full object-contain"
              />
            </div>

            <div className="p-6 md:p-8">
              <p className="text-label text-blue">{cert.issuer}</p>
              <h2 className="mt-2 font-display text-xl uppercase leading-tight text-chrome md:text-2xl">
                {cert.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
                {cert.description}
              </p>
              {cert.verifyUrl && (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="energy-border mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-white/10"
                >
                  Verify Credential
                  <span>→</span>
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CertGallery({ certs }: { certs: Certification[] }) {
  const [preview, setPreview] = useState<Certification | null>(null);

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
          Verified Credentials
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
          Enterprise engineering, networking and AI — each credential
          independently verifiable.
        </p>
      </header>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-6 py-16 md:px-10 md:py-24">
        <ParticleField className="opacity-50" density={36} />
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} onOpen={setPreview} />
          ))}
        </div>

        {certs.length === 0 && (
          <p className="py-20 text-center font-mono text-sm uppercase tracking-[0.2em] text-white/40">
            No certifications published yet.
          </p>
        )}
      </section>

      <Lightbox cert={preview} onClose={() => setPreview(null)} />
    </>
  );
}
