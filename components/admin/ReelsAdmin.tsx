"use client";

import { useEffect, useState, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { uploadFile, logAction } from "@/lib/admin";
import { Btn, Card, Field, inputCls } from "./ui";

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
        <h2 className="font-display text-2xl uppercase text-white">Reels</h2>
        <Btn variant="primary" onClick={() => startEdit(blank())}>
          + New Reel
        </Btn>
      </div>

      {editing && (
        <Card className="energy-border">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <input
                className={inputCls}
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Category tag">
              <input
                className={inputCls}
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
            <Field label="Instagram link" className="md:col-span-2">
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
            <Field label="Upload preview video (mp4)" className="md:col-span-2">
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

      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span
                  className={
                    r.accent === "blue"
                      ? "h-2 w-2 rounded-full bg-blue-bright"
                      : "h-2 w-2 rounded-full bg-red"
                  }
                />
                <span className="truncate font-semibold text-white">
                  {r.title}
                </span>
                <span className="font-mono text-[10px] uppercase text-white/35">
                  #{r.sort_order}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-white/40">{r.tag}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Btn onClick={() => startEdit(r)}>Edit</Btn>
              <Btn variant="danger" onClick={() => remove(r)}>
                Delete
              </Btn>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            No reels yet
          </p>
        )}
      </div>
    </div>
  );
}
