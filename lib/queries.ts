import { createClient } from "@/lib/supabase/server";
import { projects as staticProjects, type Project } from "@/data/projects";
import {
  certifications as staticCerts,
  type Certification,
} from "@/data/certifications";

/**
 * Data access with graceful fallback: if Supabase is configured, read from it;
 * otherwise serve the static seed data. The whole site works either way.
 */

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  if (!supabase) return staticProjects;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return staticProjects;

  return data.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    category: r.category,
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    tech: r.tech ?? [],
    videoUrl: r.video_url ?? undefined,
    posterUrl: r.poster_url ?? undefined,
    researchUrl: r.research_url ?? undefined,
    websiteUrl: r.website_url ?? undefined,
    githubUrl: r.github_url ?? undefined,
    year: r.year ?? "",
    featured: r.featured,
    order: r.sort_order,
  }));
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient();
  if (!supabase) return staticCerts;

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return staticCerts;

  return data.map((r) => ({
    id: r.id,
    title: r.title,
    issuer: r.issuer ?? "",
    description: r.description ?? "",
    credentialId: r.credential_id ?? undefined,
    verifyUrl: r.verify_url ?? undefined,
    imageUrl: r.image_url ?? undefined,
    year: r.year ?? "",
    order: r.sort_order,
  }));
}

export async function getSetting<T = string>(
  key: string,
  fallback: T
): Promise<T> {
  const supabase = await createClient();
  if (!supabase) return fallback;
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as T) ?? fallback;
}
