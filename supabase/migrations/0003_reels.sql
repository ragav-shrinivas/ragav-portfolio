-- ============================================================
-- Ragav Portfolio — Videography & Content Creation reels
-- Table: reels  (preview video + Instagram Reel link)
-- Reuses the existing `project_videos` storage bucket for uploads.
-- ============================================================

create table if not exists public.reels (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  tag           text,
  description   text,
  instagram_url text,
  video_url     text,
  accent        text default 'red' check (accent in ('red', 'blue')),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.reels enable row level security;

create policy "public read reels" on public.reels for select using (true);
create policy "auth write reels"  on public.reels for all to authenticated using (true) with check (true);

-- ---------- Seed the six launch reels ----------
insert into public.reels (title, tag, description, instagram_url, video_url, accent, sort_order)
values
  ('Commercial Edit',          'Commercial', 'High-impact commercial edit with punchy pacing, sound design and brand-forward storytelling.', 'https://www.instagram.com/reel/DTA6cJ8jzMZ/', '/videos/video1.mp4', 'red',  1),
  ('Cinematic Storytelling',   'Cinematic',  'Cinematic storytelling piece — mood, motion and narrative crafted for emotional pull.',        'https://www.instagram.com/reel/DTLPTOYD52M/', '/videos/video2.mp4', 'blue', 2),
  ('Social Media Campaign',    'Social',     'Scroll-stopping social campaign content optimized for reach, retention and engagement.',       'https://www.instagram.com/reel/DTnZtT0CYOe/', '/videos/video3.mp4', 'red',  3),
  ('Promotional Content',      'Promo',      'Promotional content built to convert — clear hook, tight edit and a strong call to action.',    'https://www.instagram.com/reel/DLNDzKUzVRu/', '/videos/video4.mp4', 'blue', 4),
  ('Creative Brand Edit',      'Branding',   'Creative brand edit blending visual identity, rhythm and premium finishing.',                  'https://www.instagram.com/reel/DS40jwCk0b5/', '/videos/video5.mp4', 'red',  5),
  ('Motion Graphics Showcase', 'Motion',     'Motion graphics showcase — kinetic typography, transitions and animated brand assets.',        'https://www.instagram.com/reel/DPtbEUhE5r-/', '/videos/video6.mp4', 'blue', 6)
on conflict do nothing;
