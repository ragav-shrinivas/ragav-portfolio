-- ============================================================
-- Seed data — mirrors data/*.ts so the DB matches the static fallback.
-- ============================================================

insert into public.projects
  (slug, title, category, tagline, description, tech, poster_url, research_url, website_url, github_url, year, featured, sort_order)
values
  ('ml-monitor', 'ML Monitor', 'ml',
   'Real-time LLM & model observability',
   'A production-grade monitoring platform for ML and LLM systems. Tracks entropy, prediction drift, and data distribution shifts in real time, surfacing degradation before it reaches users.',
   array['Python','PyTorch','FastAPI','Kubernetes','Docker','Grafana'],
   '/projects/modelpulse_logo.png', '#', null, '#', '2025', true, 1),

  ('entropy-tipping-point-prediction', 'Entropy Tipping Point Prediction', 'ml',
   'Predicting system collapse before it happens',
   'A predictive system that models entropy trajectories to forecast tipping points in complex systems — anticipating critical transitions and regime shifts ahead of failure.',
   array['Python','NumPy','scikit-learn','Time-Series','Research'],
   null, '#', null, '#', '2025', true, 2),

  ('aviate-gym', 'Aviate Gym', 'website',
   'High-energy fitness brand experience',
   'A production website for Aviate Gym — bold motion, membership flows, and a conversion-focused landing experience deployed for a live client.',
   array['Next.js','TailwindCSS','Framer Motion','Supabase'],
   null, null, 'https://aviate-gym-7x5z.vercel.app/', null, '2024', true, 3),

  ('geetham-silks', 'Geetham Silks', 'website',
   'Boutique silk house, brought online',
   'A refined digital storefront for Geetham Silks — a boutique silk house. Elegant catalog browsing, brand storytelling, and a polished commerce experience shipped to production.',
   array['Next.js','Supabase','TailwindCSS','Boutique'],
   null, null, 'https://geetham-silk-6jrs.vercel.app', null, '2025', true, 4),

  ('alp-astrology', 'ALP Astrology', 'website',
   'Astrology platform & consultations',
   'A full astrology platform — consultation booking, content, and a calm, premium interface. Production deployment with a Supabase backend.',
   array['Next.js','Supabase','TailwindCSS','Platform'],
   null, null, 'https://alpastrology.vercel.app/', null, '2025', true, 5)
on conflict (slug) do nothing;

insert into public.certificates
  (title, issuer, description, credential_id, verify_url, image_url, year, sort_order)
values
  ('SAP Certified Associate — Back-End Developer · ABAP Cloud', 'SAP',
   'Enterprise development on SAP BTP & S/4HANA using ABAP Cloud, the RESTful Application Programming model (RAP), and CDS Views.',
   'SAP-ABAP-CLOUD', '#', '/certs/sap-abap-cloud.jpg', '2025', 1)
on conflict do nothing;

insert into public.settings (key, value)
values
  ('hero_video',  '{"type":"frames","path":"/frames/hero/","count":300}'::jsonb),
  ('works_video', '{"type":"frames","path":"/frames/works/","count":240}'::jsonb)
on conflict (key) do nothing;
