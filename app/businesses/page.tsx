import type { Metadata } from "next";
import { FeatureSection, MarketingCta, MarketingHero, MarketingPage } from "../components/marketing-page";

export const metadata: Metadata = {
  title: "Businesses | NEFE Business Network",
  description: "Why businesses join NEFE to acquire customers, coordinate cross-promotion, and build measurable network effects.",
  alternates: { canonical: "/businesses" },
  openGraph: { title: "NEFE for Businesses", description: "A business-first system for shared commercial growth.", url: "/businesses" },
};

const reasons = [
  { title: "Business Growth", description: "Create new commercial paths through relevant partners rather than relying on isolated acquisition channels.", href: "/docs/business/business-model" },
  { title: "Customer Acquisition", description: "Reach customers in a trusted, contextual journey with the contribution of each participant made visible.", href: "/docs/platform/analytics" },
  { title: "Cross Promotion", description: "Coordinate complementary offers around clear customer terms, operational capacity, and agreed measurement.", href: "/docs/merchants/campaign-builder" },
  { title: "Network Effects", description: "Increase the usefulness of the ecosystem as approved businesses, relationships, and journeys become more connected.", href: "/docs/platform/commerce-graph" },
  { title: "Commerce Graph", description: "See the governed commercial structure behind participants, relationships, offers, and outcome signals.", href: "/docs/platform/commerce-graph" },
  { title: "Opportunity Engine", description: "Review explainable partnership and campaign candidates without handing accountability to an automated system.", href: "/docs/platform/opportunity-engine" },
  { title: "Analytics", description: "Evaluate performance against a baseline and distinguish activity, attribution, and incrementality.", href: "/docs/platform/analytics" },
];

export default function BusinessesPage() {
  return <MarketingPage>
    <MarketingHero eyebrow="For business leaders" title="Build growth that becomes" accent="stronger through connection." description="NEFE helps businesses coordinate customer value, commercial relationships, and measurable outcomes across a governed network." primary={{label:"Why NEFE",href:"#business-value"}} secondary={{label:"Business documentation",href:"/docs/business"}} visualLabel="Commercial growth"/>
    <div id="business-value"><FeatureSection eyebrow="Business value" title="A shared commercial system with accountable outcomes." description="Move from disconnected partnerships to a repeatable operating model for network-led growth." features={reasons}/></div>
    <MarketingCta title="Test the business case before you scale." description="A focused pilot makes commercial value, operating effort, and deployment gaps visible to decision-makers." primary={{label:"Explore enterprise pilots",href:"/contact"}} secondary={{label:"Read revenue architecture",href:"/docs/business/revenue-architecture"}}/>
  </MarketingPage>;
}

