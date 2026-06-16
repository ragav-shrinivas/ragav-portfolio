export interface TimelineNode {
  id: string;
  period: string;
  title: string;
  org: string;
  description: string;
  accent: "red" | "blue";
}

export const journey: TimelineNode[] = [
  {
    id: "srm",
    period: "Education",
    title: "B.Tech, Computer Science",
    org: "SRM Institute of Science & Technology",
    description:
      "Foundations in algorithms, systems, and software engineering — where the obsession with building intelligent, beautiful software began.",
    accent: "blue",
  },
  {
    id: "freelance",
    period: "Freelance",
    title: "Freelance Full-Stack Developer",
    org: "Independent · Client Work",
    description:
      "Designed and shipped production websites for real clients — from high-energy brand sites to premium commerce storefronts.",
    accent: "red",
  },
  {
    id: "ai-research",
    period: "Research",
    title: "AI / ML Engineering & Research",
    org: "Entropy Systems · LLM Observability",
    description:
      "Built monitoring systems for ML & LLMs, and researched entropy-based tipping-point prediction for complex systems.",
    accent: "blue",
  },
  {
    id: "sap",
    period: "Enterprise",
    title: "SAP Certified ABAP Cloud Developer",
    org: "SAP BTP · S/4HANA · RAP · CDS",
    description:
      "Enterprise-grade development on the SAP stack — clean-core extensions, RAP business objects, and CDS data modeling.",
    accent: "red",
  },
  {
    id: "creative",
    period: "Creative",
    title: "Creative Technologist",
    org: "Autodesk Maya · After Effects · Premiere Pro",
    description:
      "3D, motion design, and UI motion systems — the craft that gives every product its cinematic, alive feeling.",
    accent: "blue",
  },
];

export const creativeRoles = [
  "Software Developer",
  "AI/ML Engineer",
  "Full Stack Developer",
  "Video Editor",
  "Content Creator",
  "Poster Designer",
  "Meta Ads Specialist",
  "Creative Technologist",
];

export const creativeSummary =
  "Beyond software engineering and AI, I create cinematic video content, social media creatives, poster designs and performance marketing campaigns — blending engineering precision with creative direction.";

export const stats = [
  { label: "Disciplines", value: "06" },
  { label: "Client Sites Shipped", value: "10+" },
  { label: "ML Systems Built", value: "02" },
  { label: "SAP Certified", value: "YES" },
];
