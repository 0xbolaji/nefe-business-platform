import type { Metadata } from "next";
import OpportunityMap from "./opportunity-map";

export const metadata: Metadata = {
  title: "UAE Opportunity Map | NEFE",
  description: "Discover and prioritize high-fit UAE business partnerships.",
};

export default function UaeOpportunityMapPage() {
  return <OpportunityMap />;
}
