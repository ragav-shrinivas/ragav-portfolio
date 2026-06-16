"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      router.replace("/admin");
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/admin");
        return;
      }
      setEmail(data.user.email ?? "admin");
      setReady(true);
    });
  }, [supabase, router]);

  if (!ready || !supabase) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
          Authenticating…
        </div>
      </div>
    );
  }

  return <AdminDashboard supabase={supabase} email={email ?? "admin"} />;
}
