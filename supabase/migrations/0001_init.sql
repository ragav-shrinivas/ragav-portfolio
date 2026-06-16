-- ============================================================
-- Ragav Portfolio — initial schema
-- Tables: projects, certificates, settings, admin_logs
-- Storage: project_videos, certificate_images, background_videos
-- ============================================================

-- ---------- Tables ----------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  category     text not null check (category in ('ml', 'website')),
  tagline      text,
  description  text,
  tech         text[] default '{}',
  video_url    text,
  poster_url   text,
  research_url text,
  website_url  text,
  github_url   text,
  year         text,
  featured     boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.certificates (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  issuer        text,
  description   text,
  credential_id text,
  verify_url    text,
  image_url     text,
  year          text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.settings (
  key        text primary key,
  value      jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_logs (
  id         uuid primary key default gen_random_uuid(),
  action     text not null,
  entity     text,
  detail     jsonb,
  actor      text,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.projects     enable row level security;
alter table public.certificates enable row level security;
alter table public.settings     enable row level security;
alter table public.admin_logs   enable row level security;

-- Public read for content tables
create policy "public read projects"     on public.projects     for select using (true);
create policy "public read certificates" on public.certificates for select using (true);
create policy "public read settings"     on public.settings     for select using (true);

-- Authenticated (admin) full write
create policy "auth write projects"     on public.projects     for all to authenticated using (true) with check (true);
create policy "auth write certificates" on public.certificates for all to authenticated using (true) with check (true);
create policy "auth write settings"     on public.settings     for all to authenticated using (true) with check (true);

-- admin_logs: only authenticated can read/insert
create policy "auth read logs"   on public.admin_logs for select to authenticated using (true);
create policy "auth insert logs" on public.admin_logs for insert to authenticated with check (true);

-- ---------- Storage buckets ----------
insert into storage.buckets (id, name, public)
values
  ('project_videos',     'project_videos',     true),
  ('certificate_images', 'certificate_images', true),
  ('background_videos',  'background_videos',  true)
on conflict (id) do nothing;

-- Public read of all three buckets
create policy "public read media"
  on storage.objects for select
  using (bucket_id in ('project_videos', 'certificate_images', 'background_videos'));

-- Authenticated upload / update / delete
create policy "auth upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('project_videos', 'certificate_images', 'background_videos'));

create policy "auth update media"
  on storage.objects for update to authenticated
  using (bucket_id in ('project_videos', 'certificate_images', 'background_videos'));

create policy "auth delete media"
  on storage.objects for delete to authenticated
  using (bucket_id in ('project_videos', 'certificate_images', 'background_videos'));
