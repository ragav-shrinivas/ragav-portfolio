"use client";

import { useEffect, useState, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { uploadFile, logAction } from "@/lib/admin";
import { Btn, Card, Field, inputCls } from "./ui";

type DB = SupabaseClient<Database>;

const SLOTS = [
  { key: "hero_video", label: "Hero Background Video", desc: "Home page hero footage." },
  { key: "works_video", label: "Works Background Video", desc: "Works page header footage." },
] as const;

export function SettingsAdmin({ supabase }: { supabase: DB }) {
  const [values, setValues] = useState<Record<string, { url?: string }>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("settings").select("*");
    const map: Record<string, { url?: string }> = {};
    (data ?? []).forEach((row) => {
      map[row.key] = (row.value as { url?: string }) ?? {};
    });
    setValues(map);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const onUpload = async (key: string, file?: File) => {
    if (!file) return;
    setBusy(key);
    setMsg("");
    try {
      const url = await uploadFile(supabase, "background_videos", file);
      const value = { type: "video", url };
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
      await logAction(supabase, "update", "setting", { key });
      setValues((v) => ({ ...v, [key]: value }));
      setMsg(`${key} updated`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl uppercase text-white">Background Media</h2>
      {msg && <p className="text-sm text-blue">{msg}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {SLOTS.map((slot) => (
          <Card key={slot.key} className="energy-border">
            <h3 className="font-semibold text-white">{slot.label}</h3>
            <p className="mt-1 text-xs text-white/40">{slot.desc}</p>

            {values[slot.key]?.url ? (
              <video
                src={values[slot.key].url}
                muted
                loop
                autoPlay
                playsInline
                className="mt-4 aspect-video w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mt-4 grid aspect-video w-full place-items-center rounded-xl border border-dashed border-white/10 text-xs text-white/30">
                Using frame sequence
              </div>
            )}

            <Field label="Replace (mp4)" className="mt-4">
              <input
                type="file"
                accept="video/*"
                disabled={busy === slot.key}
                className={inputCls}
                onChange={(e) => onUpload(slot.key, e.target.files?.[0])}
              />
            </Field>
            {busy === slot.key && (
              <p className="mt-2 text-xs text-white/50">Uploading…</p>
            )}
          </Card>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/30">
        Uploaded videos are stored in the background_videos bucket and saved to the
        settings table. The hero consumes the setting when a video URL is present.
      </p>
    </div>
  );
}
