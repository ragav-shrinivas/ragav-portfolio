export type ProjectCategory = "ml" | "website";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  tech: string[];
  /** Optional looping preview video (mp4). Falls back to poster/frames. */
  videoUrl?: string;
  posterUrl?: string;
  researchUrl?: string;
  websiteUrl?: string;
  githubUrl?: string;
  year: string;
  featured: boolean;
  order: number;
}

/**
 * Static seed data — mirrors the Supabase `projects` table.
 * When Supabase is connected, this is used as the fallback / build-time data.
 */
export const projects: Project[] = [
  {
    id: "ml-monitor",
    slug: "ml-monitor",
    title: "ML Monitor",
    category: "ml",
    tagline: "Real-time LLM & model observability",
    description:
      "A production-grade monitoring platform for ML and LLM systems. Tracks entropy, prediction drift, and data distribution shifts in real time, surfacing degradation before it reaches users.",
    tech: ["Python", "PyTorch", "FastAPI", "Kubernetes", "Docker", "Grafana"],
    posterUrl: "/projects/modelpulse_logo.png",
    researchUrl: "#",
    githubUrl: "#",
    year: "2025",
    featured: true,
    order: 1,
  },
  {
    id: "entropy-tipping-point",
    slug: "entropy-tipping-point-prediction",
    title: "Entropy Tipping Point Prediction",
    category: "ml",
    tagline: "Predicting system collapse before it happens",
    description:
      "A predictive system that models entropy trajectories to forecast tipping points in complex systems — anticipating critical transitions and regime shifts ahead of failure.",
    tech: ["Python", "NumPy", "scikit-learn", "Time-Series", "Research"],
    researchUrl: "#",
    githubUrl: "#",
    year: "2025",
    featured: true,
    order: 2,
  },
  {
    id: "aviate-gym",
    slug: "aviate-gym",
    title: "Aviate Gym",
    category: "website",
    tagline: "High-energy fitness brand experience",
    description:
      "A production website for Aviate Gym — bold motion, membership flows, and a conversion-focused landing experience deployed for a live client.",
    tech: ["Next.js", "TailwindCSS", "Framer Motion", "Supabase"],
    websiteUrl: "https://aviate-gym-7x5z.vercel.app/",
    year: "2024",
    featured: true,
    order: 3,
  },
  {
    id: "geetham-silks",
    slug: "geetham-silks",
    title: "Geetham Silks",
    category: "website",
    tagline: "Boutique silk house, brought online",
    description:
      "A refined digital storefront for Geetham Silks — a boutique silk house. Elegant catalog browsing, brand storytelling, and a polished commerce experience shipped to production.",
    tech: ["Next.js", "Supabase", "TailwindCSS", "Boutique"],
    websiteUrl: "https://geetham-silk-6jrs.vercel.app",
    year: "2025",
    featured: true,
    order: 4,
  },
  {
    id: "alp-astrology",
    slug: "alp-astrology",
    title: "ALP Astrology",
    category: "website",
    tagline: "Astrology platform & consultations",
    description:
      "A full astrology platform — consultation booking, content, and a calm, premium interface. Production deployment with a Supabase backend.",
    tech: ["Next.js", "Supabase", "TailwindCSS", "Platform"],
    websiteUrl: "https://alpastrology.vercel.app/",
    year: "2025",
    featured: true,
    order: 5,
  },
];

export const projectCategories: { key: ProjectCategory | "all"; label: string }[] = [
  { key: "all", label: "All Work" },
  { key: "ml", label: "AI / Machine Learning" },
  { key: "website", label: "Websites" },
];
