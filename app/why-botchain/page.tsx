import type { Metadata } from "next";
import WhyBotchain from "./why-botchain";

export const metadata: Metadata = {
  title: "Why Botchain | NEFE",
  description: "How NEFE turns blockchain infrastructure into real-world commercial activity.",
};

export default function WhyBotchainPage() {
  return <WhyBotchain />;
}
