"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Live inline-editing layer.
 *
 * Every editable piece of copy on the site has a stable string `id`. This
 * provider loads any overrides saved in the `site_content` table and exposes:
 *   - get(id, fallback)  → the override, or the hard-coded default
 *   - editMode           → whether the admin has turned editing on
 *   - save(id, value)    → persist an edit (optimistic) to Supabase
 *
 * When Supabase is not configured, everything gracefully no-ops and the site
 * renders its default copy.
 */

type SaveState = "idle" | "saving" | "saved" | "error";

interface EditCtx {
  ready: boolean;
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  get: (id: string, fallback: string) => string;
  save: (id: string, value: string) => void;
  saveState: SaveState;
}

const Ctx = createContext<EditCtx | null>(null);

export function useEdit() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe fallback so <Editable> works even outside a provider (e.g. tests).
    return {
      ready: false,
      isAdmin: false,
      editMode: false,
      setEditMode: () => {},
      get: (_id: string, fallback: string) => fallback,
      save: () => {},
      saveState: "idle" as SaveState,
    };
  }
  return ctx;
}

export function EditProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const emailRef = useRef<string | null>(null);
  const [editMode, setEditModeState] = useState(false);
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist edit mode across full page loads so editing spans every page.
  useEffect(() => {
    try {
      if (localStorage.getItem("rp_edit_mode") === "1") setEditModeState(true);
    } catch {}
  }, []);

  const setEditMode = useCallback((v: boolean) => {
    setEditModeState(v);
    try {
      localStorage.setItem("rp_edit_mode", v ? "1" : "0");
    } catch {}
  }, []);

  // Load overrides + auth state once on mount.
  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    let active = true;

    supabase
      .from("site_content")
      .select("key,value")
      .then(({ data }) => {
        if (!active || !data) return;
        const map: Record<string, string> = {};
        for (const row of data) map[row.key] = row.value;
        setOverrides(map);
        setReady(true);
      });

    supabase.auth.getUser().then(({ data }) => {
      if (active) {
        setIsAdmin(!!data.user);
        emailRef.current = data.user?.email ?? null;
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAdmin(!!session?.user);
      emailRef.current = session?.user?.email ?? null;
      if (!session?.user) setEditMode(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const get = useCallback(
    (id: string, fallback: string) => overrides[id] ?? fallback,
    [overrides]
  );

  const save = useCallback(
    (id: string, value: string) => {
      // Optimistic local update so the UI never flickers.
      setOverrides((prev) => ({ ...prev, [id]: value }));
      if (!supabase) return;
      setSaveState("saving");
      supabase
        .from("site_content")
        .upsert(
          { key: id, value, updated_by: emailRef.current },
          { onConflict: "key" }
        )
        .then(({ error }) => {
          setSaveState(error ? "error" : "saved");
          if (savedTimer.current) clearTimeout(savedTimer.current);
          savedTimer.current = setTimeout(() => setSaveState("idle"), 1600);
        });
    },
    [supabase]
  );

  const value: EditCtx = {
    ready,
    isAdmin,
    editMode,
    setEditMode,
    get,
    save,
    saveState,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
