import type { Metadata } from "next";
import FounderRoom from "./founder-room";

export const metadata: Metadata = {
  title: "Founder Room | NEFE",
  description: "The strategic vision, commercial model, and roadmap behind NEFE.",
};

export default function FounderRoomPage() {
  return <FounderRoom />;
}
