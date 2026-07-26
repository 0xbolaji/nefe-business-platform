import type { Metadata } from "next";
import CommerceGraph from "./commerce-graph";

export const metadata: Metadata = {
  title: "Commerce Graph | NEFE",
  description: "Explore how businesses, modeled referral paths, and opportunity gaps connect across a sample NEFE commercial ecosystem.",
};

export default function CommerceGraphPage() {
  return <CommerceGraph />;
}
