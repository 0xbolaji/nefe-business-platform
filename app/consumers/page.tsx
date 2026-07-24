import type { Metadata } from "next";
import { MarketingCta, MarketingHero, MarketingPage, ProcessSection } from "../components/marketing-page";

export const metadata: Metadata = {
  title: "Consumers | NEFE Business Network",
  description: "A connected consumer experience for discovering, earning, redeeming, and returning across participating businesses.",
  alternates: { canonical: "/consumers" },
  openGraph: { title: "The NEFE Consumer Experience", description: "Connected discovery and value across trusted businesses.", url: "/consumers" },
};

export default function ConsumersPage() {
  return <MarketingPage>
    <MarketingHero eyebrow="Consumer experience" title="A more connected way to" accent="discover local value." description="NEFE-enabled experiences help customers move between relevant participating businesses with clear offers, transparent terms, and meaningful choice." primary={{label:"Explore the journey",href:"#journey"}} secondary={{label:"Consumer documentation",href:"/docs/consumers"}} visualLabel="Customer journey"/>
    <div id="journey"><ProcessSection eyebrow="The experience loop" title="Simple moments. Connected value." steps={[
      {title:"Discover",description:"Find a relevant participating business or experience."},
      {title:"Earn",description:"Receive clearly explained value through an eligible interaction."},
      {title:"Redeem",description:"Use the offer under transparent merchant terms."},
      {title:"Explore",description:"Continue into a complementary customer moment."},
      {title:"Repeat",description:"Return when the network remains useful and relevant."},
    ]}/></div>
    <section className="marketing-section marketing-shell"><header className="marketing-section-heading"><span>Trust by design</span><h2>Customer value without hidden mechanics.</h2><p>Participation should explain who operates the experience, why it is relevant, what information is needed, and how customers can manage applicable preferences.</p></header></section>
    <MarketingCta title="Understand the customer experience in detail." description="The documentation explains onboarding, offer journeys, support expectations, and privacy principles." primary={{label:"View consumer guide",href:"/docs/consumers/app-guide"}} secondary={{label:"Privacy principles",href:"/docs/security/privacy-data-protection"}}/>
  </MarketingPage>;
}

