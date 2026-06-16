"use client";

import { useEffect, useState, useCallback } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { uploadFile, logAction } from "@/lib/admin";
import { Btn, Card, Field, inputCls } from "./ui";

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

      {editing && (
        <Card className="energy-border">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title" className="md:col-span-2">
              <input
                className={inputCls}
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Issuer">
              <input
                className={inputCls}
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
            <Field label="Verify URL">
              <input
                className={inputCls}
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
            <Field label="Certificate image">
              <input
                type="file"
                accept="image/*"
                className={inputCls}
                onChange={(e) => onUpload(e.target.files?.[0])}
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
              <span className="truncate font-semibold text-white">{r.title}</span>
              <p className="mt-1 truncate text-xs text-white/40">
                {r.issuer} · {r.year}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Btn onClick={() => { setEditing(r); setMsg(""); }}>Edit</Btn>
              <Btn variant="danger" onClick={() => remove(r)}>
                Delete
              </Btn>
            </div>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/35">
            No certificates yet
          </p>
        )}
      </div>
    </div>
  );
}
