export interface Certification {
  id: string;
  title: string;
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
    title: "SAP Certified Associate — Back-End Developer · ABAP Cloud",
    issuer: "SAP",
    description:
      "Enterprise development on SAP BTP & S/4HANA using ABAP Cloud, the RESTful Application Programming model (RAP), and CDS Views.",
    credentialId: "SAP-ABAP-CLOUD",
    verifyUrl: "#",
    imageUrl: "/certs/sap-abap-cloud.jpg",
    year: "2025",
    order: 1,
  },
];
