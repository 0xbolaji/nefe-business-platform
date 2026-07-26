import type { Metadata } from "next";
import OpportunityEngine from "./opportunity-engine";

export const metadata: Metadata = {
  title: "Opportunity Engine | NEFE",
  description: "Identify commercial opportunities, model connected ecosystems, predict outcomes and prepare coordinated pilots with NEFE.",
};

export default function OpportunityEnginePage() {
  return <OpportunityEngine />;
}
