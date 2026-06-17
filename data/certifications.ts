export interface Certification {
  id: string;
  title: string;
  /** Stored in the `issuer` column — displayed as the card Category. */
  issuer: string;
  description: string;
  credentialId?: string;
  verifyUrl?: string;
  imageUrl?: string;
  year: string;
  order: number;
}

/** Static seed — mirrors the Supabase `certificates` table. */
export const certifications: Certification[] = [
  {
    id: "sap-abap-cloud",
    title: "SAP Certified Associate – Back-End Developer – ABAP Cloud",
    issuer: "SAP Enterprise Engineering",
    description:
      "Enterprise development using SAP BTP, S/4HANA, ABAP Cloud, RAP and CDS Views.",
    verifyUrl:
      "https://www.credly.com/badges/da0b1125-fa14-4365-b176-cdf8e2115394",
    imageUrl: "/certificates/abap.jpeg",
    year: "2025",
    order: 1,
  },
  {
    id: "cisco-networking-basics",
    title: "Cisco Networking Basics",
    issuer: "Computer Networking",
    description:
      "Fundamentals of networking, protocols, routing, switching, connectivity and network architecture.",
    verifyUrl:
      "https://www.credly.com/badges/a82bc6dd-f671-4009-8258-877152cf7c95/public_url",
    imageUrl: "/certificates/network.jpeg",
    year: "2025",
    order: 2,
  },
  {
    id: "ai-driven-professional",
    title: "Certified AI-Driven Professional",
    issuer: "Artificial Intelligence & Machine Learning",
    description:
      "AI Career Accelerator program covering practical AI workflows, prompt engineering, automation and AI-driven solutions.",
    verifyUrl:
      "https://certx.in/certificate/f5fff47f-02d5-4de0-bcc8-584460628dde862711",
    imageUrl: "/certificates/aiml.jpeg",
    year: "2025",
    order: 3,
  },
];
