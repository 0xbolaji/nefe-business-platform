import type { Metadata } from "next";
import ExecutiveInsights from "./executive-insights";

export const metadata: Metadata = {
  title: "Executive Insights | NEFE",
  description: "A real-time view of ecosystem growth, partner activity, and revenue impact.",
};

export default function ExecutiveInsightsPage() {
  return <ExecutiveInsights />;
}
