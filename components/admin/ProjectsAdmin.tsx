"use client";

import { useEffect, useState, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { uploadFile, logAction, slugify } from "@/lib/admin";
import { Btn, Card, Field, inputCls } from "./ui";

type DB = SupabaseClient<Database>;
type Row = Database["public"]["Tables"]["projects"]["Row"];

const blank = (): Partial<Row> => ({
  title: "",
  slug: "",
  category: "ml",
  tagline: "",
  description: "",
  tech: [],
  year: new Date().getFullYear().toString(),
  featured: true,
  sort_order: 0,
  website_url: "",
  github_url: "",
  research_url: "",
});

export function ProjectsAdmin({ supabase }: { supabase: DB }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [techStr, setTechStr] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order");
    setRows(data ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (r: Partial<Row>) => {
    setEditing(r);
    setTechStr((r.tech ?? []).join(", "));
    setMsg("");
  };

  const save = async () => {
    if (!editing?.title) return setMsg("Title is required");
    setBusy(true);
    try {
      const payload = {
        ...editing,
        slug: editing.slug || slugify(editing.title),
        tech: techStr.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const { error } = await supabase
        .from("projects")
        .upsert(payload as Row, { onConflict: "id" });
      if (error) throw error;
      await logAction(supabase, editing.id ? "update" : "create", "project", {
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
    await supabase.from("projects").delete().eq("id", r.id);
    await logAction(supabase, "delete", "project", { title: r.title });
    await load();
  };

  const onUpload = async (
    bucket: "project_videos" | "certificate_images",
    field: "poster_url" | "video_url",
    file?: File
  ) => {
    if (!file || !editing) return;
    setBusy(true);
    try {
      const url = await uploadFile(supabase, bucket, file);
      setEditing({ ...editing, [field]: url });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase text-white">Projects</h2>
        <Btn variant="primary" onClick={() => startEdit(blank())}>
          + New Project
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
            <Field label="Category">
              <select
                className={inputCls}
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value as Row["category"] })
                }
              >
                <option value="ml">AI / ML</option>
                <option value="website">Website</option>
              </select>
            </Field>
            <Field label="Tagline" className="md:col-span-2">
              <input
                className={inputCls}
                value={editing.tagline ?? ""}
                onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
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
            <Field label="Tech (comma separated)" className="md:col-span-2">
              <input
                className={inputCls}
                value={techStr}
                onChange={(e) => setTechStr(e.target.value)}
              />
            </Field>
            <Field label="Website URL">
              <input
                className={inputCls}
                value={editing.website_url ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, website_url: e.target.value })
                }
              />
            </Field>
            <Field label="GitHub URL">
              <input
                className={inputCls}
                value={editing.github_url ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, github_url: e.target.value })
                }
              />
            </Field>
            <Field label="Research URL">
              <input
                className={inputCls}
                value={editing.research_url ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, research_url: e.target.value })
                }
              />
            </Field>
            <Field label="Year">
              <input
                className={inputCls}
                value={editing.year ?? ""}
                onChange={(e) => setEditing({ ...editing, year: e.target.value })}
              />
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
            <label className="mt-7 flex items-center gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={!!editing.featured}
                onChange={(e) =>
                  setEditing({ ...editing, featured: e.target.checked })
                }
              />
              Featured
            </label>
            <Field label="Poster image">
              <input
                type="file"
                accept="image/*"
                className={inputCls}
                onChange={(e) =>
                  onUpload("certificate_images", "poster_url", e.target.files?.[0])
                }
              />
            </Field>
            <Field label="Preview video (mp4)">
              <input
                type="file"
                accept="video/*"
                className={inputCls}
                onChange={(e) =>
                  onUpload("project_videos", "video_url", e.target.files?.[0])
                }
              />
            </Field>
          </div>

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
                    r.category === "ml"
                      ? "h-2 w-2 rounded-full bg-blue-bright"
                      : "h-2 w-2 rounded-full bg-red"
                  }
                />
                <span className="truncate font-semibold text-white">{r.title}</span>
                <span className="font-mono text-[10px] uppercase text-white/35">
                  #{r.sort_order}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-white/40">{r.tagline}</p>
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
            No projects yet
          </p>
        )}
      </div>
    </div>
  );
}
