"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin/dashboard");
    });
  }, [supabase, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError(error.message);
    router.replace("/admin/dashboard");
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,31,31,0.25),rgba(59,130,246,0.15)_50%,transparent_70%)] blur-[90px]" />

      <div className="glass-strong energy-border relative w-full max-w-md rounded-3xl p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/evo9.png" alt="EVO9" className="h-14 w-auto drop-duo" />
          <h1 className="mt-5 font-display text-3xl uppercase tracking-wide text-chrome">
            Admin Console
          </h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Evolution&apos;s 9th Dimension
          </p>
        </div>

        {!supabase ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
            <p className="font-semibold text-white">Supabase not configured yet.</p>
            <p className="mt-2 leading-relaxed">
              Add <code className="text-blue">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-blue">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
              <code className="text-blue">.env.local</code>, run the migrations in{" "}
              <code className="text-blue">supabase/migrations</code>, then create an
              admin user in Supabase Auth.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-label text-white/45">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-blue"
              />
            </div>
            <div>
              <label className="text-label text-white/45">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-blue"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red/30 bg-red/10 px-4 py-2 text-sm text-red">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-blue to-red px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:brightness-110 disabled:opacity-50"
            >
              {busy ? "Authenticating…" : "Enter Console"}
            </button>
          </form>
        )}

        <Link
          href="/"
          className="mt-6 block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-white/70"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
