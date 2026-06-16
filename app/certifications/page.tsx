import type { Metadata } from "next";
import { CertGallery } from "@/components/certifications/CertGallery";
import { getCertifications } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Verified credential — SAP Certified Associate, Back-End Developer (ABAP Cloud).",
};

export default async function CertificationsPage() {
  const certs = await getCertifications();
  return <CertGallery certs={certs} />;
}
