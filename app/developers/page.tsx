import type { Metadata } from "next";
import { FeatureSection, MarketingCta, MarketingHero, MarketingPage } from "../components/marketing-page";

export const metadata: Metadata = {
  title: "Developers | NEFE Business Network",
  description: "Architecture, integration principles, future API readiness, and technical documentation for NEFE.",
  alternates: { canonical: "/developers" },
  openGraph: { title: "NEFE for Developers", description: "Business-first integration principles for connected commerce.", url: "/developers" },
};

const features = [
  { title: "Architecture", description: "Begin with the participant, trigger, permitted data, outcome, latency, failure behavior, and accountable owner.", href: "/docs/developers/overview" },
  { title: "Integration Concepts", description: "Evaluate bounded file exchange, assisted imports, service integrations, and event notifications against the real workflow.", href: "/docs/developers/integration-concepts" },
  { title: "Future APIs", description: "Use a clear readiness gate before specifying or publishing interfaces. NEFE does not present unimplemented public APIs as available.", href: "/docs/developers/api-readiness" },
  { title: "Security Boundaries", description: "Design least-privilege access, purpose-limited data exchange, safe retries, observability, support, and rollback.", href: "/docs/security/overview" },
  { title: "Technology Foundation", description: "Review the infrastructure principles, modular architecture, and future interoperability direction beneath the commercial platform.", href: "/technology" },
];

export default function DevelopersPage() {
  return <MarketingPage>
    <MarketingHero eyebrow="For developers" title="Integrate around the" accent="commercial journey." description="NEFE technical guidance starts with the approved business workflow, then defines the smallest reliable and secure exchange needed to support it." primary={{label:"View developer docs",href:"/docs/developers"}} secondary={{label:"Integration concepts",href:"/docs/developers/integration-concepts"}} visualLabel="Integration architecture"/>
    <FeatureSection eyebrow="Developer resources" title="Clear boundaries before implementation." description="Technical teams can evaluate architecture and readiness without mistaking a proposed interface for a production API." features={features}/>
    <MarketingCta title="Build only after the workflow is ready." description="Confirm ownership, authorization, data contracts, failure handling, observability, and support before publishing an integration." primary={{label:"View documentation",href:"/docs/developers"}} secondary={{label:"Discuss enterprise integration",href:"/contact"}}/>
  </MarketingPage>;
}
