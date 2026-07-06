import type { Metadata } from "next";
import AdminCommandCenter from "./admin-command-center";

export const metadata: Metadata = {
  title: "Admin Command Center | NEFE",
  description: "NEFE ecosystem operations, moderation, health, and growth intelligence.",
};

export default function AdminPage() {
  return <AdminCommandCenter />;
}
