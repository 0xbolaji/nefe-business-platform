import { permanentRedirect } from "next/navigation";

export default function LeadershipPage() {
  permanentRedirect("/about#founder");
}
