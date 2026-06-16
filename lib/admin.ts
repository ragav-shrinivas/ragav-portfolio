import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type DB = SupabaseClient<Database>;

/** Upload a file to a storage bucket and return its public URL. */
export async function uploadFile(
  supabase: DB,
  bucket: "project_videos" | "certificate_images" | "background_videos",
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Write an entry to admin_logs (best-effort). */
export async function logAction(
  supabase: DB,
  action: string,
  entity: string,
  detail?: Record<string, unknown>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("admin_logs").insert({
    action,
    entity,
    detail: (detail as never) ?? null,
    actor: user?.email ?? null,
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
