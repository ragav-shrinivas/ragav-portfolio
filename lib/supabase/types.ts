/**
 * Database types — kept in sync with the Supabase schema.
 * Regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
 * (or via the Supabase MCP `generate_typescript_types`).
 *
 * This hand-written version mirrors the migration in supabase/migrations
 * so the app type-checks before the project is provisioned.
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: "ml" | "website";
          tagline: string | null;
          description: string | null;
          tech: string[] | null;
          video_url: string | null;
          poster_url: string | null;
          research_url: string | null;
          website_url: string | null;
          github_url: string | null;
          year: string | null;
          featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          title: string;
          category: "ml" | "website";
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string | null;
          description: string | null;
          credential_id: string | null;
          verify_url: string | null;
          image_url: string | null;
          year: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["certificates"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Row"]>;
        Relationships: [];
      };
      reels: {
        Row: {
          id: string;
          title: string;
          tag: string | null;
          description: string | null;
          instagram_url: string | null;
          video_url: string | null;
          accent: "red" | "blue" | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reels"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["reels"]["Row"]>;
        Relationships: [];
      };
      settings: {
        Row: {
          key: string;
          value: Json | null;
          updated_at: string;
        };
        Insert: { key: string; value?: Json | null };
        Update: Partial<Database["public"]["Tables"]["settings"]["Row"]>;
        Relationships: [];
      };
      admin_logs: {
        Row: {
          id: string;
          action: string;
          entity: string | null;
          detail: Json | null;
          actor: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_logs"]["Row"]> & {
          action: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_logs"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { project_category: "ml" | "website" };
  };
}
