import type { Metadata } from "next";
import Image from "next/image";
import { FeatureSection, MarketingCta, MarketingHero, MarketingPage, ProcessSection } from "../components/marketing-page";
import UAEFlag from "../components/uae-flag";

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
    <section id="founder" className="border-y border-[#E8E3EB] bg-[#F8F6FA] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[.62fr_1.38fr] lg:items-center">
        <div className="relative mx-auto aspect-[4/4.6] w-full max-w-[390px] overflow-hidden rounded-[28px] border border-[#DED7E6] bg-[#27222B] shadow-[0_28px_70px_rgba(41,27,72,.16)]">
          <Image src="/ali-ahmad-alsharif.png" alt="Ali Ahmad Alsharif, Founder and Chief Executive Officer" fill sizes="(min-width: 1024px) 390px, 80vw" className="object-cover object-[center_26%]"/>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#6747D7]">Founder and Chief Executive Officer</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Ali Ahmad Alsharif</h2>
          <p className="mt-6 max-w-2xl text-[13px] leading-7 text-[#625B68]">Ali leads NEFE’s vision for practical commercial infrastructure that connects hospitality, retail, mobility, tourism, real estate, and services. The mandate is simple: help businesses create measurable growth through accountable collaboration rather than operating in isolation.</p>
          <blockquote className="mt-7 max-w-2xl border-l-2 border-[#C3963D] pl-6 text-lg font-medium leading-8 text-[#393140]">Businesses grow faster together than alone. NEFE exists to create measurable commercial relationships that benefit every participant.</blockquote>
          <div className="mt-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E1DCE5] bg-white px-3 py-2 text-[8px] font-semibold text-[#6D6574]"><UAEFlag className="h-3.5 w-auto" title="United Arab Emirates flag"/>United Arab Emirates</span>
            <span className="rounded-full border border-[#E1DCE5] bg-white px-3 py-2 text-[8px] font-semibold text-[#6D6574]">Commercial ecosystems</span>
            <span className="rounded-full border border-[#E1DCE5] bg-white px-3 py-2 text-[8px] font-semibold text-[#6D6574]">Golden Rock Blockchain LTD</span>
          </div>
        </div>
      </div>
    </section>
    <div id="roadmap">
      <ProcessSection eyebrow="Future roadmap" title="Progress through evidence, not promises." numbered={false} steps={[
        {title:"Foundation",description:"Establish the business model, governance, and participant experience."},
        {title:"Pilot",description:"Test bounded commercial journeys with measurable outcomes."},
        {title:"Learn",description:"Close operational, product, security, and integration gaps."},
        {title:"Expand",description:"Add participants and use cases when the evidence supports it."},
        {title:"Enterprise",description:"Develop deployment readiness through explicit controls and acceptance criteria."},
      ]}/>
    </div>
    <MarketingCta title="Build the commercial ecosystem with us." description="Start a focused conversation about partnerships, merchant participation, or a controlled enterprise pilot." primary={{label:"Contact NEFE",href:"/contact"}} secondary={{label:"Our documentation system",href:"/docs/documentation-system"}}/>
  </MarketingPage>;
}
