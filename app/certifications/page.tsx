import type { Metadata } from "next";
import { CertGallery } from "@/components/certifications/CertGallery";
import { getCertifications } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Verified credentials — SAP Certified Associate (ABAP Cloud), Cisco Networking Basics, and Certified AI-Driven Professional.",
};

export default async function CertificationsPage() {
  const certs = await getCertifications();
  return <CertGallery certs={certs} />;
}
