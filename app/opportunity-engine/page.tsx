import type { Metadata } from "next";
import OpportunityEngine from "./opportunity-engine";

export const metadata: Metadata = {
  title: "Opportunity Engine | NEFE",
  description: "Build, simulate and evaluate connected commercial ecosystems with NEFE intelligence.",
};

export default function OpportunityEnginePage() {
  return <OpportunityEngine />;
}

