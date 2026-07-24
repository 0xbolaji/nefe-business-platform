import type { Metadata } from "next";
import { FeatureSection, MarketingCta, MarketingHero, MarketingPage } from "../components/marketing-page";

export const metadata: Metadata = {
  title: "Solutions | NEFE Business Network",
  description: "Connected-commerce solutions for hospitality, retail, tourism, events, shopping, services, and future enterprise networks.",
  alternates: { canonical: "/solutions" },
  openGraph: { title: "NEFE Solutions", description: "Commercial solutions built around real customer journeys.", url: "/solutions" },
};

const solutions = [
  { title: "Restaurants", description: "Demand can be episodic and customer acquisition expensive. NEFE connects dining moments with relevant hotels, events, retail, and experiences.", outcome: "More qualified discovery and measurable partner referrals.", href: "/docs/business/pilot-program" },
  { title: "Hotels", description: "Guest value extends beyond the room. NEFE helps coordinate complementary dining, mobility, retail, wellness, and destination experiences.", outcome: "A richer stay and stronger local partner economics.", href: "/docs/platform/commerce-graph" },
  { title: "Retail", description: "Brands need relevance beyond broad promotion. NEFE connects offers to contextual customer journeys and approved partner audiences.", outcome: "Higher-quality reach and clearer campaign measurement.", href: "/docs/merchants/campaign-builder" },
  { title: "Tourism", description: "Destination experiences are fragmented across operators. NEFE provides a governed layer for coordinating participating businesses.", outcome: "More coherent visitor journeys and network-level insight.", href: "/docs/business/enterprise-deployment" },
  { title: "Events", description: "The customer journey starts before arrival and continues after departure. NEFE connects tickets, stays, dining, transport, and retail moments.", outcome: "Extended event value and cross-partner conversion.", href: "/docs/platform/opportunity-engine" },
  { title: "Shopping", description: "Shopping districts and destinations need a shared understanding of customer movement without creating an unrestricted data pool.", outcome: "Coordinated offers with purpose-limited measurement.", href: "/docs/security/privacy-data-protection" },
  { title: "Service Businesses", description: "Trusted services often grow through relationships that are difficult to coordinate or measure. NEFE structures referral activity and follow-through.", outcome: "More accountable introductions and repeatable growth.", href: "/docs/platform/analytics" },
  { title: "Future Enterprise", description: "Larger networks require explicit ownership, security, integration, support, and acceptance criteria before they scale.", outcome: "A phased path from bounded pilot to enterprise readiness.", href: "/docs/business/enterprise-deployment" },
];

export default function SolutionsPage() {
  return <MarketingPage>
    <MarketingHero eyebrow="Solutions" title="Commercial networks built around" accent="real customer moments." description="NEFE helps industries coordinate complementary value without losing sight of governance, customer trust, or measurable business outcomes." primary={{label:"Explore industries",href:"#industries"}} secondary={{label:"Plan a pilot",href:"/docs/business/pilot-program"}} visualLabel="Solution network"/>
    <div id="industries"><FeatureSection eyebrow="Industry solutions" title="One platform. Different commercial journeys." description="Every solution starts with the problem, connects the right businesses, and defines the outcome before activation." features={solutions}/></div>
    <MarketingCta title="Design a bounded commercial pilot." description="Choose one customer journey, a focused participant group, and a decision framework that makes the result useful." primary={{label:"Discuss a pilot",href:"/contact"}} secondary={{label:"Read the pilot guide",href:"/docs/business/pilot-program"}}/>
  </MarketingPage>;
}

