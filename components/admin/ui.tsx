"use client";

import { cn } from "@/lib/cn";

export const inputCls =
  "mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-blue placeholder:text-white/25";

export function Field({
  label,
  children,
  className,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-label text-white/45">
        {label}
        {required && <span className="ml-1 text-red">*</span>}
      </span>
      {hint && (
        <span className="mt-1 block text-[11px] leading-snug text-white/35">
          {hint}
        </span>
      )}
      {children}
    </label>
  );
}

/**
 * Guidance banner shown at the top of each admin panel: explains what this
 * content type is and exactly where it appears on the live site.
 */
export function Guide({
  title,
  where,
  points,
}: {
  title: string;
  where: string;
  points?: string[];
}) {
  return (
    <div className="rounded-2xl border border-blue/20 bg-blue/[0.06] p-4 md:p-5">
      <p className="flex items-center gap-2 font-semibold text-white">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-blue/20 text-[11px] text-blue">
          i
        </span>
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        <span className="font-medium text-white/75">Where it shows: </span>
        {where}
      </p>
      {points && points.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {points.map((p) => (
            <li key={p} className="flex gap-2 text-[13px] leading-relaxed text-white/55">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue" />
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Section divider inside the editor form. */
export function FormSection({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-white/8 pb-2">
        <p className="font-display text-sm uppercase tracking-[0.14em] text-white/80">
          {title}
        </p>
        {desc && <p className="mt-1 text-[12px] text-white/40">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function Btn({
  children,
  variant = "ghost",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue to-red text-white hover:brightness-110",
    ghost: "border border-white/10 bg-white/5 text-white/70 hover:text-white",
    danger: "border border-red/30 bg-red/10 text-red hover:bg-red/20",
  }[variant];
  return (
    <button
      {...rest}
      className={cn(
        "rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all disabled:opacity-50",
        styles,
        className
      )}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl border border-white/8 p-5", className)}>
      {children}
    </div>
  );
}
