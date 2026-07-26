import type { Metadata } from "next";
import {
  FeatureSection,
  MarketingCta,
  MarketingHero,
  MarketingPage,
} from "../components/marketing-page";

export const metadata: Metadata = {
  title: "Platform | NEFE Business Network",
  description: "Explore the business-first commercial platform connecting businesses, customer journeys, campaigns, and measurable outcomes.",
  alternates: { canonical: "/platform" },
  openGraph: { title: "NEFE Platform", description: "The operating layer for connected commerce.", url: "/platform" },
};

const features = [
  { title: "Commerce Graph", description: "Understand participating businesses, commercial relationships, customer journeys, and permitted network signals in one governed model.", href: "/docs/platform/commerce-graph" },
  { title: "Opportunity Engine", description: "Surface explainable partnership and campaign opportunities for accountable teams to review, refine, and activate.", href: "/docs/platform/opportunity-engine" },
  { title: "Merchant Network", description: "Bring verified businesses into a shared operating environment with clear roles, profiles, and participation controls.", href: "/docs/merchants/onboarding" },
  { title: "Consumer Experience", description: "Create connected discovery and offer journeys that remain transparent, relevant, and governed by clear customer terms.", href: "/docs/consumers/app-guide" },
  { title: "Campaign System", description: "Plan joint commercial activity around an objective, audience, offer, approval process, and measurement plan.", href: "/docs/merchants/campaign-builder" },
  { title: "Analytics", description: "Evaluate reach, engagement, referrals, conversion, attributable value, and operational exceptions against a baseline.", href: "/docs/platform/analytics" },
  { title: "Business Intelligence", description: "Turn approved network context into practical commercial insight without replacing human judgment or accountability.", href: "/docs/platform/ai-layer" },
];

export default function PlatformPage() {
  return (
    <MarketingPage>
      <MarketingHero
        eyebrow="The NEFE platform"
        title="The operating layer for"
        accent="connected commerce."
        description="NEFE gives complementary businesses a shared commercial system for discovering opportunities, coordinating customer value, and measuring outcomes."
        primary={{ label: "Explore the platform", href: "#capabilities" }}
        secondary={{ label: "Read platform documentation", href: "/docs/platform" }}
        visualLabel="Network intelligence"
      />
      <div id="capabilities">
        <FeatureSection
          eyebrow="Platform capabilities"
          title="From network context to measurable action."
          description="Each layer is designed around a commercial decision, with governance and documentation close at hand."
          features={features}
        />
      </div>
      <MarketingCta
        title="Start with the business outcome."
        description="Define the commercial objective, participant group, governance model, and measurement plan before selecting the technology path."
        primary={{ label: "Explore solutions", href: "/solutions" }}
        secondary={{ label: "Platform overview", href: "/docs/platform/overview" }}
      />
    </MarketingPage>
  );
}
