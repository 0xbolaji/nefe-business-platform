import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Portal | NEFE",
  description: "NEFE business partnership performance portal.",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
