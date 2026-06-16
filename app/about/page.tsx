import type { Metadata } from "next";
import { Journey } from "@/components/about/Journey";

export const metadata: Metadata = {
  title: "About",
  description:
    "The journey of Ragav — Computer Science at SRM, freelance development, AI research, SAP certification, and creative technology.",
};

export default function AboutPage() {
  return <Journey />;
}
