"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil, Check, Eye, LayoutDashboard, Loader2, AlertTriangle } from "lucide-react";
import { useEdit } from "./EditProvider";
import { cn } from "@/lib/cn";

/**
 * Floating control that only appears for a signed-in admin. Lets you flip the
 * whole site into inline-edit mode and shows the save status of edits.
 */
export function EditToolbar() {
  const { isAdmin, editMode, setEditMode, saveState } = useEdit();
  const pathname = usePathname();

  if (!isAdmin || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[90] flex items-center gap-2">
      <div className="glass-strong flex items-center gap-1.5 rounded-full border border-white/10 p-1.5 shadow-cine">
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all",
            editMode
              ? "bg-gradient-to-r from-blue to-red text-white"
              : "bg-white/5 text-white/70 hover:text-white"
          )}
        >
          {editMode ? <Eye size={14} /> : <Pencil size={14} />}
          {editMode ? "Editing" : "Edit page"}
        </button>

        <Link
          href="/admin/dashboard"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:text-white"
          title="Admin dashboard"
        >
          <LayoutDashboard size={15} />
        </Link>
      </div>

      {/* Save status pill */}
      {editMode && (
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all",
            saveState === "saving" && "border-blue/30 bg-blue/10 text-blue",
            saveState === "saved" && "border-green-400/30 bg-green-400/10 text-green-300",
            saveState === "error" && "border-red/30 bg-red/10 text-red",
            saveState === "idle" && "border-white/10 bg-white/5 text-white/40"
          )}
        >
          {saveState === "saving" && <Loader2 size={12} className="animate-spin" />}
          {saveState === "saved" && <Check size={12} />}
          {saveState === "error" && <AlertTriangle size={12} />}
          {saveState === "saving"
            ? "Saving"
            : saveState === "saved"
            ? "Saved"
            : saveState === "error"
            ? "Failed"
            : "Live edit"}
        </div>
      )}
    </div>
  );
}
