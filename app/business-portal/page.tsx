import type { Metadata } from "next";
import PortalPage from "../portal/page";

export const metadata: Metadata = {
  title: "Business Portal | NEFE",
  description: "Manage partnerships, campaigns, referrals, rewards, and business growth.",
};

export default function BusinessPortalPage() {
  return <PortalPage />;
}
