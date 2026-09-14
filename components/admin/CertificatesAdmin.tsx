"use client";

import { useEffect, useState, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { uploadFile, logAction } from "@/lib/admin";
import { Btn, Card, Field, inputCls, Guide } from "./ui";

type DB = SupabaseClient<Database>;
type Row = Database["public"]["Tables"]["certificates"]["Row"];

const blank = (): Partial<Row> => ({
  title: "",
  issuer: "",
  description: "",
  credential_id: "",
  verify_url: "",
  year: new Date().getFullYear().toString(),
  sort_order: 0,
});

export function CertificatesAdmin({ supabase }: { supabase: DB }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order");
    setRows(data ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing?.title) return setMsg("Title is required");
    setBusy(true);
    try {
      const { error } = await supabase
        .from("certificates")
        .upsert(editing as Row, { onConflict: "id" });
      if (error) throw error;
      await logAction(supabase, editing.id ? "update" : "create", "certificate", {
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
    await supabase.from("certificates").delete().eq("id", r.id);
    await logAction(supabase, "delete", "certificate", { title: r.title });
    await load();
  };

  const onUpload = async (file?: File) => {
    if (!file || !editing) return;
    setBusy(true);
    try {
      const url = await uploadFile(supabase, "certificate_images", file);
      setEditing({ ...editing, image_url: url });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl uppercase text-white">Certificates</h2>
        <Btn variant="primary" onClick={() => { setEditing(blank()); setMsg(""); }}>
          + New Certificate
        </Btn>
      </div>

      <Guide
        title="Add a certification or credential"
        where="The Certifications page (/certifications) — shown as a verifiable credential card with your certificate image, title, issuer and a “Verify credential” button."
        points={[
          "Upload the certificate image — it becomes the card's preview. Landscape scans look best.",
          "Category is the small label on top of the card (e.g. “SAP Enterprise Engineering”).",
          "Verify URL is where the “Verify credential” button links (Credly, CertX, etc.).",
          "Sort order controls position — lower numbers appear first.",
        ]}
      />

      {editing && (
        <Card className="energy-border">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Title"
              required
              hint="The certification name, e.g. “SAP Certified Associate – ABAP Cloud”."
              className="md:col-span-2"
            >
              <input
                className={inputCls}
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Category" hint="Small label on the card, e.g. issuer or field.">
              <input
                className={inputCls}
                placeholder="SAP Enterprise Engineering"
                value={editing.issuer ?? ""}
                onChange={(e) => setEditing({ ...editing, issuer: e.target.value })}
              />
            </Field>
            <Field label="Year">
              <input
                className={inputCls}
                value={editing.year ?? ""}
                onChange={(e) => setEditing({ ...editing, year: e.target.value })}
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
            <Field label="Credential ID">
              <input
                className={inputCls}
                value={editing.credential_id ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, credential_id: e.target.value })
                }
              />
            </Field>
            <Field label="Verify URL" hint="Where the “Verify credential” button links.">
              <input
                className={inputCls}
                placeholder="https://www.credly.com/badges/…"
                value={editing.verify_url ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, verify_url: e.target.value })
                }
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
            <Field label="Image URL" className="md:col-span-2">
              <input
                className={inputCls}
                placeholder="/certificates/abap.jpeg or uploaded URL"
                value={editing.image_url ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, image_url: e.target.value })
                }
              />
            </Field>
            <Field
              label="Upload new image"
              hint="Recommended: a clear scan/photo of the certificate. Replaces the URL above."
              className="md:col-span-2"
            >
              <input
                type="file"
                accept="image/*"
                className={inputCls}
                onChange={(e) => onUpload(e.target.files?.[0])}
              />
            </Field>
          </div>

          {editing.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={editing.image_url}
              alt="certificate preview"
              className="mt-4 max-h-40 rounded-xl border border-white/10 object-contain"
            />
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
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                {r.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.image_url}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                  <Btn onClick={() => { setEditing(r); setMsg(""); }}>Edit</Btn>
                  <Btn variant="danger" onClick={() => remove(r)}>Delete</Btn>
                </div>
                <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[9px] text-white/70">
                  #{r.sort_order}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-white">{r.title}</p>
                <p className="mt-0.5 truncate text-[11px] text-white/40">
                  {r.issuer} · {r.year}
                </p>
              </div>
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            No certificates yet — click “+ New Certificate” to add your first.
          </p>
        )}
      </div>
    </div>
  );
}
