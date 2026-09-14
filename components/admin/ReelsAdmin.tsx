"use client";

import { useEffect, useState, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { uploadFile, logAction } from "@/lib/admin";
import { cn } from "@/lib/cn";
import { Btn, Card, Field, inputCls, Guide } from "./ui";

type DB = SupabaseClient<Database>;
type Row = Database["public"]["Tables"]["reels"]["Row"];

const blank = (): Partial<Row> => ({
  title: "",
  tag: "",
  description: "",
  instagram_url: "",
  video_url: "",
  accent: "red",
  sort_order: 0,
});

export function ReelsAdmin({ supabase }: { supabase: DB }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase.from("reels").select("*").order("sort_order");
    setRows(data ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (r: Partial<Row>) => {
    setEditing(r);
    setMsg("");
  };

  const save = async () => {
    if (!editing?.title) return setMsg("Title is required");
    setBusy(true);
    try {
      const { error } = await supabase
        .from("reels")
        .upsert(editing as Row, { onConflict: "id" });
      if (error) throw error;
      await logAction(supabase, editing.id ? "update" : "create", "reel", {
        title: editing.title,
      });
      setEditing(null);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r: Row) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    await supabase.from("reels").delete().eq("id", r.id);
    await logAction(supabase, "delete", "reel", { title: r.title });
    await load();
  };

  const onUpload = async (file?: File) => {
    if (!file || !editing) return;
    setBusy(true);
    try {
      const url = await uploadFile(supabase, "project_videos", file);
      setEditing({ ...editing, video_url: url });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase text-white">
          Videography &amp; Reels
        </h2>
        <Btn variant="primary" onClick={() => startEdit(blank())}>
          + New Reel
        </Btn>
      </div>

      <Guide
        title="Add a videography reel"
        where="The Works page (/works) under the “Videography & Content Creation” filter — a video card that plays your preview and links out to the Instagram Reel."
        points={[
          "Upload a short preview video (mp4) — it plays inline on the card. Vertical/portrait works great.",
          "Instagram link is where “View on Instagram” sends viewers (the full reel).",
          "Category tag is the small label (e.g. “Commercial”, “Cinematic”, “Motion”).",
          "Accent sets the card's glow colour — red or blue.",
        ]}
      />

      {editing && (
        <Card className="energy-border">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" required hint="Reel name shown on the card.">
              <input
                className={inputCls}
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Category tag" hint="Small label, e.g. “Commercial”, “Motion”.">
              <input
                className={inputCls}
                placeholder="Cinematic"
                value={editing.tag ?? ""}
                onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
              />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea
                rows={3}
                className={inputCls}
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </Field>
            <Field
              label="Instagram link"
              hint="The full reel — “View on Instagram” links here."
              className="md:col-span-2"
            >
              <input
                className={inputCls}
                placeholder="https://www.instagram.com/reel/..."
                value={editing.instagram_url ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, instagram_url: e.target.value })
                }
              />
            </Field>
            <Field label="Preview video URL" className="md:col-span-2">
              <input
                className={inputCls}
                placeholder="/videos/video1.mp4 or uploaded URL"
                value={editing.video_url ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, video_url: e.target.value })
                }
              />
            </Field>
            <Field
              label="Upload preview video (mp4)"
              hint="Plays inline on the card. Keep it short (a few seconds)."
              className="md:col-span-2"
            >
              <input
                type="file"
                accept="video/*"
                className={inputCls}
                onChange={(e) => onUpload(e.target.files?.[0])}
              />
            </Field>
            <Field label="Accent">
              <select
                className={inputCls}
                value={editing.accent ?? "red"}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    accent: e.target.value as Row["accent"],
                  })
                }
              >
                <option value="red">Red</option>
                <option value="blue">Blue</option>
              </select>
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                className={inputCls}
                value={editing.sort_order ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, sort_order: Number(e.target.value) })
                }
              />
            </Field>
          </div>

          {editing.video_url && (
            <p className="mt-3 truncate font-mono text-[10px] text-white/40">
              video: {editing.video_url}
            </p>
          )}
          {msg && <p className="mt-4 text-sm text-red">{msg}</p>}
          <div className="mt-5 flex gap-3">
            <Btn variant="primary" onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Btn>
            <Btn onClick={() => setEditing(null)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          {rows.length} live on your site
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="group glass overflow-hidden rounded-2xl border border-white/8"
            >
              <div className="relative aspect-[9/12] overflow-hidden bg-black/40">
                {r.video_url ? (
                  <video
                    src={r.video_url}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : (
                  <div className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                    No video
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                  <Btn onClick={() => startEdit(r)}>Edit</Btn>
                  <Btn variant="danger" onClick={() => remove(r)}>Delete</Btn>
                </div>
                <span
                  className={cn(
                    "absolute left-2 top-2 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase text-white",
                    r.accent === "blue" ? "bg-blue/70" : "bg-red/70"
                  )}
                >
                  {r.tag || "Reel"}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-white">{r.title}</p>
                <p className="mt-0.5 truncate text-[11px] text-white/40">
                  {r.instagram_url ? "Instagram linked" : "No IG link"}
                </p>
              </div>
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            No reels yet — click “+ New Reel” to add your first.
          </p>
        )}
      </div>
    </div>
  );
}
