import type { Metadata } from "next";
import { FeatureSection, MarketingCta, MarketingHero, MarketingPage, ProcessSection } from "../components/marketing-page";

export const metadata: Metadata = {
  title: "About | NEFE Business Network",
  description: "The mission, vision, platform philosophy, and roadmap behind NEFE Business Network.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About NEFE Business Network", description: "Building the commercial operating layer for connected business ecosystems.", url: "/about" },
};

const philosophy = [
  { title: "Business First", description: "Begin with a commercial problem, accountable owner, and measurable outcome before selecting technology.", href: "/docs/business/business-model" },
  { title: "Connected Businesses", description: "Help complementary organizations coordinate customer value without obscuring ownership or responsibility.", href: "/docs/platform/commerce-graph" },
  { title: "Customer Trust", description: "Make relevance, terms, participation, and data use understandable throughout the customer journey.", href: "/docs/security/privacy-data-protection" },
  { title: "Governed Intelligence", description: "Use network context and assisted analysis to support people who remain accountable for the decision.", href: "/docs/platform/opportunity-engine" },
];

export default function AboutPage() {
  return <MarketingPage>
    <MarketingHero eyebrow="About NEFE" title="Building the future of" accent="connected commerce." description="NEFE Business Network is creating a business-first commercial platform where complementary organizations can coordinate customer value, discover opportunities, and measure shared growth." primary={{label:"Explore the platform",href:"/platform"}} secondary={{label:"Read our documentation",href:"/docs"}} visualLabel="Commercial ecosystem"/>
    <FeatureSection eyebrow="Platform philosophy" title="Commercial value, supported by accountable infrastructure." description="NEFE is designed around clear ownership, governed participation, useful customer journeys, and evidence that decision-makers can evaluate." features={philosophy}/>
    <section className="marketing-process"><div className="marketing-shell"><header className="marketing-section-heading"><span>Mission and vision</span><h2>Help businesses grow together, not in isolation.</h2><p>Our vision is a trusted commercial operating layer connecting businesses across hospitality, retail, tourism, mobility, events, and services.</p></header></div></section>
    <ProcessSection eyebrow="Future roadmap" title="Progress through evidence, not promises." steps={[
      {title:"Foundation",description:"Establish the business model, governance, and participant experience."},
      {title:"Pilot",description:"Test bounded commercial journeys with measurable outcomes."},
      {title:"Learn",description:"Close operational, product, security, and integration gaps."},
      {title:"Expand",description:"Add participants and use cases when the evidence supports it."},
      {title:"Enterprise",description:"Develop deployment readiness through explicit controls and acceptance criteria."},
    ]}/>
    <MarketingCta title="Build the commercial ecosystem with us." description="Start a focused conversation about partnerships, merchant participation, or a controlled enterprise pilot." primary={{label:"Contact NEFE",href:"/contact"}} secondary={{label:"Our documentation system",href:"/docs/documentation-system"}}/>
  </MarketingPage>;
}
