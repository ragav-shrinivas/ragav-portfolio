"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/cn";
import { ProjectsAdmin } from "./ProjectsAdmin";
import { ReelsAdmin } from "./ReelsAdmin";
import { CertificatesAdmin } from "./CertificatesAdmin";
import { SettingsAdmin } from "./SettingsAdmin";
import { ActivityAdmin } from "./ActivityAdmin";

type DB = SupabaseClient<Database>;
type Tab = "projects" | "reels" | "certificates" | "settings" | "activity";

const TABS: { key: Tab; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "reels", label: "Reels" },
  { key: "certificates", label: "Certificates" },
  { key: "settings", label: "Media" },
  { key: "activity", label: "Activity" },
];

export function AdminDashboard({
  supabase,
  email,
}: {
  supabase: DB;
  email: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("projects");

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin");
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-5 py-8 md:px-8 md:py-12">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-white/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/evo9.png" alt="EVO9" className="h-10 w-auto drop-duo" />
          <div>
            <h1 className="font-display text-xl uppercase tracking-wide text-chrome">
              Admin Console
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
              {email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
          >
            View Site ↗
          </a>
          <button
            onClick={signOut}
            className="rounded-xl border border-red/30 bg-red/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-red transition-colors hover:bg-red/20"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
              tab === t.key
                ? "bg-white text-base"
                : "border border-white/10 bg-white/5 text-white/55 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {tab === "projects" && <ProjectsAdmin supabase={supabase} />}
        {tab === "reels" && <ReelsAdmin supabase={supabase} />}
        {tab === "certificates" && <CertificatesAdmin supabase={supabase} />}
        {tab === "settings" && <SettingsAdmin supabase={supabase} />}
        {tab === "activity" && <ActivityAdmin supabase={supabase} />}
      </div>
    </div>
  );
}
