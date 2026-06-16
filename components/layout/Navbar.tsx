"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/config";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled ? "py-2" : "py-4"
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-700",
            scrolled
              ? "glass-strong mx-4 max-w-5xl rounded-full px-6 shadow-cine md:mx-auto"
              : "max-w-7xl px-6 md:px-10"
          )}
        >
          {/* ── Wordmark ── */}
          <Link href="/" aria-label="Home" className="group flex items-center gap-2.5">
            <span
              className="h-2 w-2 rounded-full bg-red shadow-[0_0_10px_3px_rgba(255,31,31,0.6)] transition-all group-hover:bg-blue-bright group-hover:shadow-[0_0_10px_3px_rgba(96,165,250,0.6)]"
            />
            <span className="font-display text-2xl uppercase tracking-[0.12em] text-chrome transition-all group-hover:tracking-[0.2em] md:text-3xl">
              {siteConfig.wordmark}
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ letterSpacing: "0.18em" }}
                  className={cn(
                    "group relative px-4 py-2.5 text-[11px] font-semibold uppercase transition-colors",
                    active ? "text-white" : "text-white/50 hover:text-white"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-4 bottom-1 h-px origin-left bg-gradient-to-r from-blue-bright to-red transition-transform duration-500",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Hamburger (mobile) ── */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden"
          >
            <div className="space-y-1.5">
              <span className={cn("block h-px w-5 bg-white transition-all", open && "translate-y-[6px] rotate-45")} />
              <span className={cn("block h-px w-5 bg-white transition-all", open && "opacity-0")} />
              <span className={cn("block h-px w-5 bg-white transition-all", open && "-translate-y-[6px] -rotate-45")} />
            </div>
          </button>
        </div>
      </motion.header>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="glass-strong fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-7">
              {siteConfig.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl uppercase tracking-wide text-white transition-colors hover:text-red"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
