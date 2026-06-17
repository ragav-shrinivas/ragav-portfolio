import type { Metadata } from "next";
import { WorksClient } from "@/components/works/WorksClient";
import { getProjects, getReels } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Machine-learning systems, production websites and videography by Ragav — ML Monitor, Entropy Tipping Point Prediction, Aviate Gym, Geetham Silks, ALP Astrology, and creative reels.",
};

export default async function WorksPage() {
  const [projects, reels] = await Promise.all([getProjects(), getReels()]);
  return <WorksClient projects={projects} reels={reels} />;
}
