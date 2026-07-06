import type { Metadata } from "next";
import BusinessModelOverview from "./business-model-overview";

export const metadata: Metadata = {
  title: "Financial Intelligence & Business Model | NEFE",
  description: "Explore NEFE revenue streams, pricing, unit economics, financial projections and expansion scenarios.",
};

export default function BusinessModelPage() {
  return <BusinessModelOverview />;
}
