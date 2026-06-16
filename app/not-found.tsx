import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,31,0.25),rgba(59,130,246,0.15)_50%,transparent_70%)] blur-[90px]" />
      <div className="relative">
        <h1 className="font-display text-[clamp(6rem,22vw,16rem)] leading-none text-plasma">
          404
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
          Signal lost in the 9th dimension
        </p>
        <Link
          href="/"
          className="energy-border mt-10 inline-block rounded-full bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-white/10"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
