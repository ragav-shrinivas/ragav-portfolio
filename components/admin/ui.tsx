"use client";

import { cn } from "@/lib/cn";

export const inputCls =
  "mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-blue placeholder:text-white/25";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-label text-white/45">{label}</span>
      {children}
    </label>
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
