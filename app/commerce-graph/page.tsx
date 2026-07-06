import type { Metadata } from "next";
import CommerceGraph from "./commerce-graph";

export const metadata: Metadata = {
  title: "Commerce Graph | NEFE",
  description: "See the NEFE business ecosystem move in real time.",
};

export default function CommerceGraphPage() {
  return <CommerceGraph />;
}
