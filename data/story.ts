export interface StoryCard {
  title: string;
  meta: string;
  accent: "red" | "blue";
}

export interface StorySection {
  id: string;
  index: string;
  kicker: string;
  title: string;
  description: string;
  align: "left" | "right";
  cards: StoryCard[];
}

export const story: StorySection[] = [
  {
    id: "engineer",
    index: "01",
    kicker: "The Engineer",
    title: "Software Developer, AI/ML Engineer & Full-Stack Builder",
    description:
      "Ragav builds at the intersection of intelligence and craft — production systems that think, and interfaces that feel alive. One mind across the full stack, from neural networks to pixels.",
    align: "left",
    cards: [
      { title: "AI / ML Engineering", meta: "Models · Monitoring · Research", accent: "blue" },
      { title: "Full-Stack Development", meta: "Next.js · APIs · Cloud", accent: "red" },
      { title: "Enterprise SAP", meta: "ABAP Cloud · RAP · CDS", accent: "blue" },
    ],
  },
  {
    id: "ai-ml",
    index: "02",
    kicker: "AI & Machine Learning",
    title: "Systems that perceive, predict and adapt",
    description:
      "Entropy analysis, drift detection, predictive systems, and LLM monitoring — engineering models that don't just run, but stay healthy in production.",
    align: "right",
    cards: [
      { title: "ML Monitor", meta: "LLM observability · drift detection", accent: "blue" },
      { title: "Entropy Tipping Point Prediction", meta: "Predictive collapse modeling", accent: "red" },
    ],
  },
  {
    id: "enterprise",
    index: "03",
    kicker: "Enterprise Development",
    title: "SAP ABAP Cloud · RAP · CDS · S/4HANA",
    description:
      "Certified enterprise engineering on the SAP stack — clean-core extensions and data models that scale to the largest organizations on earth.",
    align: "right",
    cards: [
      { title: "ABAP Cloud", meta: "Clean-core · BTP", accent: "blue" },
      { title: "RAP & CDS Views", meta: "Business objects · data modeling", accent: "red" },
    ],
  },
  {
    id: "creative",
    index: "04",
    kicker: "Creative Engineering",
    title: "Where motion design meets engineering",
    description:
      "Autodesk Maya, After Effects, Premiere Pro, and bespoke UI motion systems — the craft that makes every build feel cinematic and premium.",
    align: "left",
    cards: [
      { title: "3D & Motion", meta: "Maya · After Effects", accent: "red" },
      { title: "UI Motion Systems", meta: "Framer Motion · GSAP", accent: "blue" },
    ],
  },
];
