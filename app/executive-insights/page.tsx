import type { Metadata } from "next";
import ExecutiveInsights from "./executive-insights";

export const metadata: Metadata = {
  title: "Executive Insights | NEFE",
  description: "A modeled view of ecosystem growth, partner activity, and commercial impact.",
};

export default function ExecutiveInsightsPage() {
  return <ExecutiveInsights />;
}
