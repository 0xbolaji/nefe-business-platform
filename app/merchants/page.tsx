import type { Metadata } from "next";
import { FeatureSection, MarketingCta, MarketingHero, MarketingPage, ProcessSection } from "../components/marketing-page";

export const metadata: Metadata = {
  title: "Merchants | NEFE Business Network",
  description: "Discover how merchants join, operate, launch campaigns, and measure connected commercial growth with NEFE.",
  alternates: { canonical: "/merchants" },
  openGraph: { title: "NEFE for Merchants", description: "Operate connected growth from one merchant workspace.", url: "/merchants" },
};

const features = [
  { title: "Merchant Portal", description: "Manage approved business information, current activity, partner participation, and priority operational actions.", href: "/docs/merchants/portal-guide" },
  { title: "Campaign Builder", description: "Define the objective, audience, offer, timing, participants, approvals, and measurement plan for joint activity.", href: "/docs/merchants/campaign-builder" },
  { title: "Customer Rewards", description: "Support clear, governed value exchanges across complementary customer journeys without hidden terms.", href: "/docs/consumers/app-guide" },
  { title: "Analytics", description: "Review engagement, referral progression, conversion, attributable value, and exceptions against an agreed baseline.", href: "/docs/platform/analytics" },
  { title: "Verification", description: "Establish trusted participation through an operator-controlled review of business identity and representatives.", href: "/docs/merchants/verification" },
];

export default function MerchantsPage() {
  return <MarketingPage>
    <MarketingHero eyebrow="For merchants" title="Grow through a network of" accent="complementary businesses." description="NEFE gives merchants an operating workspace for trusted participation, governed campaigns, customer value, and measurable partner growth." primary={{label:"Explore merchant tools",href:"#merchant-tools"}} secondary={{label:"Merchant documentation",href:"/docs/merchants"}} visualLabel="Merchant workspace"/>
    <div id="merchant-tools"><FeatureSection eyebrow="Merchant platform" title="Everything needed to participate with confidence." description="Operate the commercial relationship from onboarding through measurement, with a clear path into detailed guidance." features={features}/></div>
    <ProcessSection eyebrow="Merchant onboarding" title="A controlled path into the network." steps={[
      {title:"Discover",description:"Confirm commercial fit and the network purpose."},
      {title:"Verify",description:"Provide the required business and representative information."},
      {title:"Configure",description:"Set the profile, locations, team roles, and categories."},
      {title:"Activate",description:"Test and approve the first bounded commercial journey."},
      {title:"Measure",description:"Review outcomes and decide what should change or scale."},
    ]}/>
    <MarketingCta title="Prepare your business for connected growth." description="Review the onboarding and verification requirements before beginning a pilot conversation." primary={{label:"Merchant enquiry",href:"/contact"}} secondary={{label:"Read onboarding guide",href:"/docs/merchants/onboarding"}}/>
  </MarketingPage>;
}

