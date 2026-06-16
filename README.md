# RAGAV — Portfolio v2 · *Evolution's 9th Dimension*

An award-winning cinematic portfolio: a hybrid of Apple-keynote motion design,
Tesla product storytelling, and a futuristic AI operating system. Dark
sci-fi theme, red/blue volumetric lighting, electrified glassmorphism,
scroll-scrubbed frame-sequence heroes, and a hidden admin CMS.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | TailwindCSS v4 (CSS-first `@theme`) |
| Motion | Framer Motion, GSAP, Lenis smooth scroll |
| 3D / Canvas | Frame-sequence canvas rendering, CSS 3D tilt (R3F/three installed) |
| Backend | Supabase (Postgres + Auth + Storage) |
| Forms | React Hook Form + Zod |

## Quick start

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:3000
npm run build        # production build
```

The site runs fully on **static seed data** (`data/*.ts`) with **no backend
required**. Supabase only powers the admin CMS and live content editing.

## Project structure

```
app/
  layout.tsx              fonts (Bebas + Syne + JetBrains Mono), Lenis, Navbar, Footer
  page.tsx                home — frame-sequence hero + 5 storytelling sections
  works/                  filterable project grid + cinematic modal
  certifications/         3D floating tilt gallery
  about/                  experience timeline + energy-spine journey
  admin/                  hidden CMS (login + dashboard)
  globals.css             red/blue sci-fi design system + tokens
components/
  layout/                 Navbar (5-tap admin trigger), Footer, SmoothScroll
  sections/               Hero, StorySection
  works/ certifications/ about/   page-specific UI
  ui/                     Reveal, LightningHeadline, TiltCard, FrameVideo
  admin/                  AdminDashboard + Projects/Certificates/Settings/Activity
data/                     typed seed data (mirrors the DB)
lib/                      cn, config, queries (DB→static fallback), supabase clients, admin helpers
public/
  evo9.png                logo
  frames/hero/            300 hero frames
  frames/works/           240 works frames
  projects/ certs/        media
supabase/migrations/      0001_init.sql (schema+RLS+storage), 0002_seed.sql
proxy.ts                  session refresh + /admin/dashboard guard
```

## Design system

Defined in `app/globals.css` (`@theme`):

- **Surfaces** `#050505 / #0b0b0b / #101820`
- **Red energy** `#8a0000 → #ff1f1f`
- **Blue intelligence** `#3b82f6 → #60a5fa`
- Utilities: `.glass`, `.glass-strong`, `.energy-border` (rotating conic),
  `.text-plasma`, `.text-chrome`, `.glow-red/blue`, `.grid-bg`, `.noise`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` everywhere

## Hidden admin

Tap the **EVO9 logo 5× quickly** → a red energy pulse fires and routes to
`/admin`. From there:

- **Projects** — add / edit / delete, upload preview video + poster
- **Certificates** — add / edit / delete, upload certificate image
- **Media** — replace hero & works background videos
- **Activity** — audit log of every admin action

## Supabase setup

1. **Create a project** at [supabase.com](https://supabase.com) (or via the MCP).
2. **Run the migrations** (SQL editor or CLI):
   ```bash
   supabase link --project-ref <ref>
   supabase db push          # applies supabase/migrations/*.sql
   ```
   Or paste `0001_init.sql` then `0002_seed.sql` into the SQL editor.
3. **Create the admin user** — Supabase → Authentication → Add user
   (email + password). This is the only login.
4. **Add env vars** to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   ```
5. (Optional) regenerate types:
   ```bash
   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
   ```

Once configured, the admin login activates and all pages read live data
(falling back to seed data on any error).

### Schema

- `projects` — slug, title, category(`ml`|`website`), tagline, description,
  tech[], video/poster/research/website/github urls, year, featured, sort_order
- `certificates` — title, issuer, description, credential_id, verify_url,
  image_url, year, sort_order
- `settings` — key/value (jsonb) for hero/works background media
- `admin_logs` — action audit trail

RLS: public **read** on content tables; **write** for authenticated admin only.
Storage buckets: `project_videos`, `certificate_images`, `background_videos`
(public read, authenticated write).

## Replacing assets

- **Hero / works footage** — drop new frames into `public/frames/hero` or
  `public/frames/works` (named `ezgif-frame-001.jpg …`) and update the count in
  `components/sections/Hero.tsx` / `WorksClient.tsx`; **or** upload an mp4 via
  the admin Media tab.
- **Logo** — replace `public/evo9.png`.

## Deployment (Vercel)

```bash
vercel
```

Set the four env vars from `.env.example` in the Vercel project settings.
Build command `next build`, output is auto-detected. Frames (~8MB total) ship
as static assets.

## Performance

- Frame sequences preload then scrub via canvas (capped at DPR 2)
- `prefers-reduced-motion` fully honored
- Static-rendered routes; lazy media; `next/font` for zero-CLS fonts
