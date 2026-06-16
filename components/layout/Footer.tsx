"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [pulse, setPulse] = useState(false);
  const taps = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hidden admin trigger — tap the subtle EVO9 mark 5× quickly.
  const onTap = () => {
    taps.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => (taps.current = 0), 1200);
    if (taps.current >= 5) {
      taps.current = 0;
      setPulse(true);
      setTimeout(() => setPulse(false), 700);
      setTimeout(() => router.push("/admin"), 450);
    }
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-base">
      <AnimatePresence>
        {pulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[100]"
            style={{
              background:
                "radial-gradient(circle at 50% 100%, rgba(255,31,31,0.35), transparent 45%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Ambient giant wordmark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-3vw] select-none text-center">
        <span className="font-display text-[24vw] leading-none text-white/[0.03]">
          {siteConfig.wordmark}
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="text-label text-blue">Let&apos;s build the future</p>
            <h2 className="mt-4 font-display text-5xl uppercase text-chrome md:text-6xl">
              Start a project
            </h2>
            <div className="mt-6 space-y-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-lg text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.phoneHref}
                className="block text-lg text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {siteConfig.phone}
              </a>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/5 pt-8 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
          <p className="font-mono uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>

          {/* Extremely subtle hidden admin trigger */}
          <button
            type="button"
            onClick={onTap}
            aria-label="."
            className="group grid h-7 w-7 place-items-center opacity-20 transition-opacity hover:opacity-40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/evo9.png" alt="" className="h-5 w-auto grayscale" />
          </button>

          <p className="font-mono uppercase tracking-[0.2em]">
            Engineered with intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
