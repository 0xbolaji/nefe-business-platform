import type { Metadata } from "next";
import OnboardingWizard from "./onboarding-wizard";

export const metadata: Metadata = {
  title: "Join the Ecosystem | NEFE",
  description: "Create your business profile and discover compatible NEFE partners.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
