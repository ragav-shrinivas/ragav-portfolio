"use client";

import Link from "next/link";
import { Briefcase, BadgeCheck, User, Send, ArrowUpRight } from "lucide-react";
import { Editable } from "@/components/edit/Editable";
import { cn } from "@/lib/cn";

/**
 * Quick-access cards shown on the first screen, above the name. They let a
 * visitor jump straight to the important sections without scrolling, while the
 * scroll experience remains for those who want to explore. Lives inside the
 * hero greeting block so it fades out as the cinematic sequence begins.
 */
const LINKS = [
  {
    href: "/works",
    label: "Works",
    hint: "Projects & builds",
    icon: Briefcase,
    accent: "blue" as const,
  },
  {
    href: "/certifications",
    label: "Certifications",
    hint: "Credentials",
    icon: BadgeCheck,
    accent: "red" as const,
  },
  {
    href: "/about",
    label: "About",
    hint: "My journey",
    icon: User,
    accent: "blue" as const,
  },
  {
    href: "/connect",
    label: "Connect",
    hint: "Get in touch",
    icon: Send,
    accent: "red" as const,
  },
];

export function HeroQuickAccess() {
  return (
    <div className="pointer-events-auto mb-6 grid w-full max-w-md grid-cols-2 gap-2.5 md:mb-8 md:max-w-2xl md:grid-cols-4 md:gap-3">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const red = link.accent === "red";
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "holo-card group relative flex items-center gap-3 overflow-hidden rounded-2xl p-3.5 text-left transition-transform duration-300 hover:-translate-y-1 md:flex-col md:items-start md:gap-0 md:p-4"
            )}
          >
            {/* accent glow on hover */}
            <span
              className={cn(
                "pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                red ? "bg-red/40" : "bg-blue/40"
              )}
            />
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-xl border md:mb-3",
                red
                  ? "border-red/30 bg-red/10 text-red"
                  : "border-blue/30 bg-blue/10 text-blue"
              )}
            >
              <Icon size={16} />
            </span>
            <span className="relative z-10 min-w-0">
              <span className="flex items-center gap-1 font-display text-sm uppercase tracking-[0.08em] text-white md:text-base">
                <Editable id={`hero.quick.${link.href}.label`} as="span">
                  {link.label}
                </Editable>
                <ArrowUpRight
                  size={13}
                  className="shrink-0 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                />
              </span>
              <Editable
                id={`hero.quick.${link.href}.hint`}
                as="span"
                className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/45 md:text-[10px]"
              >
                {link.hint}
              </Editable>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
