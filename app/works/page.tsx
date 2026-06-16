import type { Metadata } from "next";
import { WorksClient } from "@/components/works/WorksClient";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Machine-learning systems and production websites by Ragav — ML Monitor, Entropy Tipping Point Prediction, Aviate Gym, Geetham Silks, ALP Astrology.",
};

export default async function WorksPage() {
  const projects = await getProjects();
  return <WorksClient projects={projects} />;
}
