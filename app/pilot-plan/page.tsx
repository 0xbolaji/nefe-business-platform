import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UAE Pilot Plan | NEFE",
  description: "A focused 90-day pilot for real UAE businesses.",
};

const objectives = [
  ["Validate merchant interest", "Confirm that premium businesses see measurable value in structured collaboration."],
  ["Measure referral activity", "Track introductions, acceptance, conversion and attributed revenue."],
  ["Test bundled experience sales", "Launch customer-ready packages combining complementary businesses."],
  ["Track repeat customer behavior", "Measure whether connected journeys increase return visits and value."],
  ["Identify NEFE utility touchpoints", "Find where rewards, access, membership and infrastructure add value."],
];

const timeline = [
  ["Phase 1", "Partner selection", "Days 1–14", "Select complementary businesses and agree pilot criteria.", "Signed cohort"],
  ["Phase 2", "Business onboarding", "Days 15–28", "Create profiles, train teams and establish referral rules.", "Operational network"],
  ["Phase 3", "Bundle creation", "Days 29–42", "Create, price and approve premium multi-partner offers.", "Offer portfolio"],
  ["Phase 4", "Customer launch", "Days 43–76", "Launch referrals, bundles and rewards to controlled audiences.", "Measured activity"],
  ["Phase 5", "Performance review", "Days 77–90", "Evaluate economics, feedback, behavior and readiness for scale.", "Scale decision"],
];

const partners = [
  ["The Celeste Dubai", "Luxury Hotel", "Palm Jumeirah", "CD", "from-[#5E3BEE] to-[#9B7BF5]"],
  ["Maison D'Or", "Fine Dining", "DIFC", "MD", "from-[#9E6D26] to-[#D9B362]"],
  ["Aurum Drive", "Luxury Car Rental", "Downtown Dubai", "AD", "from-[#343B4B] to-[#7B8292]"],
  ["Azure Beach Society", "Beach Club", "JBR", "AB", "from-[#17899D] to-[#71C5D2]"],
  ["Serein Wellness", "Spa", "Jumeirah", "SW", "from-[#A8617F] to-[#DDA0B7]"],
  ["Lumé Joaillerie", "Luxury Retail", "Dubai Mall", "LJ", "from-[#7D6035] to-[#C7A45F]"],
  ["The Foundry", "Event Venue", "Al Quoz", "TF", "from-[#3F64B7] to-[#7698E5]"],
];

const metrics = [
  ["15+", "Businesses onboarded"], ["1,500+", "Referrals generated"],
  ["AED 450K", "Campaign revenue"], ["20%+", "Repeat purchases"],
  ["40%+", "Customer engagement"], ["30%+", "Reward redemptions"],
];

const outputs = [
  ["MVP requirements", "A prioritized product scope grounded in observed behavior."],
  ["Merchant feedback", "Evidence on onboarding, workflows, incentives and value."],
  ["Revenue data", "Attributed campaign, referral and bundle performance."],
  ["Customer behavior data", "Discovery, purchase, repeat and redemption signals."],
  ["Platform architecture case", "Infrastructure utility based on real commercial events."],
  ["Scale-up plan", "A city-by-city model for UAE and GCC expansion."],
];

export default function PilotPlanPage() {
  return <main className="overflow-hidden bg-[#FAF9FB] text-[#19152A]">
    <section className="pilot-hero relative px-5 py-24 text-center sm:px-8 sm:py-32">
      <div className="founder-grid absolute inset-0"/><div className="founder-glow one"/><div className="founder-glow two"/>
      <div className="relative z-10 mx-auto max-w-[980px]"><div className="eyebrow mx-auto">Controlled market validation</div><h1 className="mt-8 text-[50px] font-semibold leading-[1.04] tracking-[-.06em] sm:text-[74px]">UAE <span className="gradient-text">Pilot Plan</span></h1><p className="mx-auto mt-7 max-w-[760px] text-base leading-8 text-[#6F6876] sm:text-lg">A focused 90-day pilot to validate merchant adoption, customer referrals, bundled experiences, and NEFE-powered rewards.</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/onboarding" className="button-primary">Start pilot onboarding →</Link><Link href="/ceo-demo" className="button-secondary">Return to CEO Demo</Link></div></div>
    </section>

    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="eyebrow">Pilot scope</div><h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Focused enough to control.<br/><span className="text-[#9A93A0]">Large enough to prove value.</span></h2>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
        ["10–20","Businesses","A curated cohort with enough density to reveal network effects."],
        ["Dubai","First market","One concentrated commercial environment before expansion."],
        ["7","Industries","Hotels, restaurants, mobility, beach clubs, spas, retail and events."],
        ["90 days","Test period","Three focused months from selection to performance review."],
      ].map(([value,label,detail])=><article key={label} className="rounded-[23px] border border-[#E7E2EA] bg-white p-6 shadow-[0_7px_24px_rgba(43,30,66,.035)]"><p className=" text-3xl font-semibold">{value}</p><p className="mt-2 text-[10px] font-semibold text-[#5E3BEE]">{label}</p><p className="mt-3 text-[8px] leading-4 text-[#8B8490]">{detail}</p></article>)}</div>
    </section>

    <section className="bg-[#171122] px-5 py-24 text-white sm:px-8 sm:py-32"><div className="mx-auto max-w-[1240px]"><div className="eyebrow eyebrow-dark">Pilot objectives</div><h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Five questions the pilot must answer.</h2><div className="mt-12 grid gap-3 lg:grid-cols-5">{objectives.map(([title,detail])=><article key={title} className="rounded-[21px] border border-white/10 bg-white/[.055] p-5"><h3 className=" text-[13px] font-semibold">{title}</h3><p className="mt-3 text-[8px] leading-4 text-white/40">{detail}</p></article>)}</div></div></section>

    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32"><div className="eyebrow">90-day timeline</div><h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">From selection to scale decision.</h2><div className="mt-12 space-y-3">{timeline.map(([phase,title,period,detail,output])=><article key={phase} className="grid gap-4 rounded-[21px] border border-[#E7E2EA] bg-white p-5 sm:grid-cols-[120px_1fr_150px] sm:items-center"><div><p className="text-[8px] font-bold text-[#5E3BEE]">{phase}</p><p className="mt-1 text-[7px] text-[#99929E]">{period}</p></div><div><h3 className="text-[13px] font-semibold">{title}</h3><p className="mt-2 text-[8px] leading-4 text-[#817A86]">{detail}</p></div><div className="rounded-xl bg-[#F3EFFB] p-3 text-center"><p className="text-[6px] uppercase text-[#9388A3]">Output</p><p className="mt-1 text-[8px] font-semibold text-[#5E3BEE]">{output}</p></div></article>)}</div></section>

    <section className="bg-[#F1EEF4] px-5 py-24 sm:px-8 sm:py-32"><div className="mx-auto max-w-[1240px]"><div className="eyebrow">Success metrics</div><h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Evidence before expansion.</h2><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(([value,label],i)=><article key={label} className="rounded-[20px] border border-[#E3DEE7] bg-white p-5"><div className="flex justify-between"><div><p className="text-2xl font-semibold">{value}</p><p className="mt-2 text-[9px] font-semibold">{label}</p></div></div><div className="mt-5 h-1.5 rounded-full bg-[#EEEAF1]"><div className="pilot-metric-bar h-full rounded-full bg-gradient-to-r from-[#6342DD] to-[#C69A43]" style={{width:`${68+i*5}%`,animationDelay:`${i*90}ms`}}/></div></article>)}</div></div></section>

    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32"><div className="eyebrow">First partners</div><h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">A complementary UAE cohort.</h2><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{partners.map(([name,category,location,initials,tone])=><article key={name} className="rounded-[20px] border border-[#E7E2EA] bg-white p-4"><div className="flex justify-between"><span className={`grid h-11 w-11 place-items-center rounded-[13px] bg-gradient-to-br ${tone} text-[8px] font-bold text-white`}>{initials}</span><span className="h-fit rounded-full bg-[#EAF9F2] px-2 py-1 text-[7px] font-bold text-[#168F66]">Pilot ready</span></div><h3 className="mt-5 text-[11px] font-semibold">{name}</h3><p className="mt-1 text-[7px] text-[#958E9B]">{category} · {location}</p></article>)}<Link href="/onboarding" className="grid min-h-40 place-items-center rounded-[20px] border border-dashed border-[#C9BDF0] bg-[#F7F4FF] text-center text-[9px] font-semibold text-[#5E3BEE]">+ Add a pilot partner</Link></div></section>

    <section className="relative overflow-hidden bg-[#0D0914] px-5 py-24 text-white sm:px-8 sm:py-32"><div className="founder-dark-grid absolute inset-0"/><div className="relative z-10 mx-auto max-w-[1240px]"><div className="eyebrow eyebrow-dark">Pilot output</div><div className="mt-6 grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><h2 className="text-4xl font-semibold tracking-[-.05em] sm:text-5xl">A decision package, not just a demo.</h2><p className="mt-5 text-[10px] leading-5 text-white/40">Evidence for product scope, merchant economics, infrastructure utility and market expansion.</p></div><div className="grid gap-3 sm:grid-cols-2">{outputs.map(([title,detail])=><article key={title} className="rounded-[19px] border border-white/10 bg-white/[.055] p-5"><h3 className=" text-[12px] font-semibold">{title}</h3><p className="mt-2 text-[8px] leading-4 text-white/40">{detail}</p></article>)}</div></div><div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-[23px] bg-gradient-to-r from-[#241743] to-[#5030B8] p-6 sm:flex-row"><h3 className="text-xl font-semibold">Begin with the first UAE partner cohort.</h3><div className="flex gap-2"><Link href="/onboarding" className="rounded-xl bg-white px-5 py-3 text-[9px] font-semibold text-[#4F31C3]">Start onboarding →</Link><Link href="/business-portal" className="rounded-xl border border-white/15 px-5 py-3 text-[9px] font-semibold">View portal</Link></div></div></div></section>
  </main>;
}
