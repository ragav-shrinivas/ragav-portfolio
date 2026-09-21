"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Floating "back to home" control shown on every page except the home page
 * itself and the admin console (which has its own navigation).
 */
export function BackHome() {
  const pathname = usePathname();
  if (pathname === "/" || pathname?.startsWith("/admin")) return null;

  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="glass-strong group fixed left-4 top-20 z-40 flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 shadow-cine transition-all hover:border-white/25 hover:text-white md:left-6"
    >
      <ArrowLeft
        size={15}
        className="transition-transform duration-300 group-hover:-translate-x-0.5"
      />
      Home
    </Link>
  );
}
