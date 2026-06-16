export const siteConfig = {
  name: "H. Ragav Shrinivas",
  wordmark: "RAGAV",
  initials: "EVO9",
  role: "Software Developer • AI/ML Engineer • Full Stack Developer • Video Editor • Creative Technologist",
  tagline: "Engineering intelligence into experience.",
  description:
    "Cinematic portfolio of H. Ragav Shrinivas — Software Developer, AI/ML Engineer, Full Stack Developer, Video Editor & Creative Technologist.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ragav.dev",
  ogImage: "/evo9.png",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hragav.tech.07@gmail.com",
  phone: "+91 7338885335",
  phoneHref: "tel:+917338885335",
  whatsappNumber: "917338885335",
  // EVO9 founder venture — replace with the live URL when ready.
  evo9Link: "EVO9_LINK_PLACEHOLDER",
  socials: {
    github: "https://github.com/ragav-shrinivas",
    linkedin: "https://linkedin.com/in/",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Works", href: "/works" },
    { label: "Certifications", href: "/certifications" },
    { label: "About", href: "/about" },
    { label: "Connect", href: "/connect" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
