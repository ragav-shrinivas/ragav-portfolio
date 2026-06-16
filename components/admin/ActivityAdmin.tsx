"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { Card } from "./ui";

type DB = SupabaseClient<Database>;
type Row = Database["public"]["Tables"]["admin_logs"]["Row"];

export function ActivityAdmin({ supabase }: { supabase: DB }) {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase
      .from("admin_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setRows(data ?? []));
  }, [supabase]);

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl uppercase text-white">Activity Log</h2>
      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id} className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue">
                {r.action}
              </span>
              <span className="text-sm text-white/70">{r.entity}</span>
              {r.detail ? (
                <span className="truncate text-xs text-white/35">
                  {JSON.stringify(r.detail)}
                </span>
              ) : null}
            </div>
            <span className="shrink-0 font-mono text-[10px] text-white/30">
              {new Date(r.created_at).toLocaleString()}
            </span>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            No activity yet
          </p>
        )}
      </div>
    </div>
  );
}
