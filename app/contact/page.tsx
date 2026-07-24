import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHero, MarketingPage } from "../components/marketing-page";

export const metadata: Metadata = {
  title: "Contact | NEFE Business Network",
  description: "Contact NEFE about business partnerships, merchant participation, enterprise pilots, and general enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact NEFE", description: "Start a conversation about connected commercial growth.", url: "/contact" },
};

const enquiries = [
  ["Business partnerships","Explore strategic participation, ecosystem design, and commercial collaboration.","/onboarding"],
  ["Merchant enquiries","Understand merchant onboarding, verification, campaigns, and operating expectations.","/docs/merchants/onboarding"],
  ["Enterprise pilots","Define a bounded pilot with clear governance, measures, and decision criteria.","/docs/business/pilot-program"],
  ["General enquiries","Learn about NEFE, the company mission, and the platform philosophy.","/about"],
];

export default function ContactPage() {
  return <MarketingPage>
    <MarketingHero eyebrow="Contact NEFE" title="Start a focused" accent="business conversation." description="Tell us which commercial outcome, participant group, or customer journey you want to explore. We will help direct the conversation to the right next step." primary={{label:"Begin guided onboarding",href:"/onboarding"}} secondary={{label:"Explore documentation",href:"/docs"}} visualLabel="Partnership conversation"/>
    <section className="marketing-section marketing-shell"><header className="marketing-section-heading"><span>Enquiries</span><h2>Choose the conversation that fits.</h2><p>Each path leads to the most relevant preparation material before a direct engagement.</p></header><div className="contact-options">{enquiries.map(([title,description,href],index)=><article key={title} className="contact-option"><span>0{index+1}</span><h2>{title}</h2><p>{description}</p><Link href={href}>Continue →</Link></article>)}</div></section>
  </MarketingPage>;
}
