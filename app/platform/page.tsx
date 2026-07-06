import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform | NEFE",
  description: "The operating system for connected business growth.",
};

const capabilities = [
  ["Partner Discovery","Find compatible businesses using industry fit, audience overlap, and commercial potential."],
  ["Campaign Studio","Design joint campaigns and premium experiences with measurable goals."],
  ["Referral Exchange","Route high-intent customers between trusted businesses and attribute every outcome."],
  ["Business Intelligence","Understand revenue, customers, campaigns, and network performance in one place."],
  ["Connected Rewards","Recognize valuable customer behavior across multiple partner businesses."],
  ["Experience Builder","Turn complementary products and services into one coherent customer journey."],
];

export default function PlatformPage() {
  return (
    <main className="overflow-hidden bg-white text-[#19152A]">
      <section className="hero-bg relative px-5 py-24 sm:px-8 sm:py-32">
        <div className="relative z-10 mx-auto max-w-[1180px] text-center"><div className="eyebrow mx-auto">The NEFE Platform</div><h1 className="mx-auto mt-7 max-w-4xl text-[46px] font-semibold leading-[1.06] tracking-[-.055em] sm:text-[68px]">Coordinate customer value <span className="gradient-text">across businesses.</span></h1><p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#6F6877]">Discover partners, launch joint offers, attribute referrals and manage rewards from one commercial workspace.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/onboarding" className="button-primary">Join the network →</Link><Link href="/commerce-graph" className="button-secondary">View Commerce Graph</Link></div></div>
      </section>
      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><div className="eyebrow">Core capabilities</div><h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">Six tools.<br/>One operating rhythm.</h2><p className="mt-5 text-[12px] leading-6 text-[#7B7481]">Move from partner discovery to performance analysis without stitching together separate systems.</p></div><div className="grid gap-3 sm:grid-cols-2">{capabilities.map(([title,detail],i)=><article key={title} className="rounded-[22px] border border-[#E8E3EB] p-5 transition hover:-translate-y-1 hover:border-[#CEC1F6] hover:shadow-[0_14px_35px_rgba(53,36,96,.07)]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F0ECFF] text-[9px] font-bold text-[#5E3BEE]">0{i+1}</span><h3 className="mt-5 text-[15px] font-semibold">{title}</h3><p className="mt-2 text-[9px] leading-5 text-[#837C88]">{detail}</p></article>)}</div></div></section>
      <section className="bg-[#171122] px-5 py-24 text-white sm:px-8 sm:py-32"><div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-2"><div><div className="eyebrow eyebrow-dark">Business value</div><h2 className="mt-6 text-4xl font-semibold tracking-[-.05em]">Growth without growing alone.</h2><div className="mt-8 space-y-4">{["Acquire customers through trusted partners","Create new revenue from bundled experiences","Improve retention through connected rewards","Measure partnership ROI in real time"].map(item=><div key={item} className="flex items-center gap-3 text-[11px] text-white/65"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#5E3BEE]/30 text-[#C9B8FF]">✓</span>{item}</div>)}</div></div><div><div className="eyebrow eyebrow-dark">Customer value</div><h2 className="mt-6 text-4xl font-semibold tracking-[-.05em]">One connected world of experiences.</h2><div className="mt-8 space-y-4">{["Discover trusted businesses through relevance","Access premium multi-business packages","Earn recognition across the ecosystem","Move seamlessly between complementary brands"].map(item=><div key={item} className="flex items-center gap-3 text-[11px] text-white/65"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#D0A348]/20 text-[#E0BF70]">✓</span>{item}</div>)}</div></div></div></section>
      <section className="px-5 py-24 text-center sm:px-8 sm:py-32"><div className="mx-auto max-w-3xl"><div className="eyebrow mx-auto">Choose a product view</div><h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">See the workflow from both sides.</h2><p className="mx-auto mt-5 max-w-xl text-[12px] leading-6 text-[#7B7481]">Open the merchant workspace, customer application or bundle-building experience.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/business-portal" className="button-primary">View Business Portal →</Link><Link href="/consumer" className="button-secondary">View Consumer App</Link><Link href="/experience-builder" className="button-secondary">Open Experience Builder</Link></div></div></section>
    </main>
  );
}
