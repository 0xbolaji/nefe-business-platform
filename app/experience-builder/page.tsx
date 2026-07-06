import type { Metadata } from "next";
import ExperienceBuilder from "./experience-builder";

export const metadata: Metadata = {
  title: "Experience Builder | NEFE",
  description: "Create premium bundled experiences with partner businesses.",
};

export default function ExperienceBuilderPage() {
  return <ExperienceBuilder />;
}
