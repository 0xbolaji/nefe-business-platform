import type { Metadata } from "next";
import BusinessModel from "./business-model";

export const metadata: Metadata = {
  title: "Financial Intelligence & Business Model | NEFE",
  description: "Explore NEFE revenue streams, pricing, unit economics, financial projections and expansion scenarios.",
};

export default function BusinessModelPage() {
  return <BusinessModel />;
}

