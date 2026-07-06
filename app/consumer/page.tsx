import type { Metadata } from "next";
import ConsumerApp from "./consumer-app";

export const metadata: Metadata = {
  title: "Consumer App | NEFE",
  description: "Discover premium businesses, curated offers, and connected rewards with NEFE.",
};

export default function ConsumerPage() {
  return <ConsumerApp />;
}
