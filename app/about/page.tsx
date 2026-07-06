import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | NEFE Business Network",
  description: "The mission, vision, and principles guiding NEFE Business Network.",
};

const principles = [
  ["Commercial Intelligence","Turn business signals into practical decisions and valuable introductions."],
  ["Connected Businesses","Create durable relationships between complementary merchants and industries."],
  ["Shared Customer Growth","Help every participant increase customer value through relevant next experiences."],
  ["Experience Economy","Coordinate hospitality, mobility, retail, wellness, and services around real customer journeys."],
  ["Data-Driven Decisions","Measure referrals, campaigns, customer movement, and commercial outcomes clearly."],
];

export default function AboutPage() {
  return <main className="about-page company-page contrast-audit-page overflow-hidden bg-[#FAF9FB] text-[#191424]">
    <section className="relative border-b border-[#E8E3EB] px-5 py-24 sm:px-8 sm:py-32">
      <div className="company-grid absolute inset-0"/><div className="relative mx-auto max-w-[1240px]">
        <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#6747D7]">About NEFE</p>
        <h1 className="mt-7 max-w-5xl text-[46px] font-semibold leading-[1.04] tracking-[-.058em] sm:text-[70px] lg:text-[84px]">Building the Future of <span className="gradient-text">Connected Commerce</span></h1>
        <p className="mt-8 max-w-3xl text-base leading-8 text-[#625B68] sm:text-lg">NEFE Business Network is a commercial intelligence platform that helps businesses discover partnerships, share customers, launch joint campaigns and build measurable commercial growth through one connected ecosystem.</p>
      </div>
    </section>

    <section className="mx-auto grid max-w-[1240px] gap-5 px-5 py-24 sm:px-8 lg:grid-cols-2">
      {[["Mission","Helping businesses grow together instead of operating in isolation."],["Vision","To become the commercial operating system connecting thousands of businesses across hospitality, retail, tourism, mobility, real estate and services."]].map(([title,copy],index)=><article key={title} className={`mission-vision-card rounded-[28px] border p-8 sm:p-10 ${index===0?"mission-card border-[#D9CFF7] bg-white shadow-[0_20px_55px_rgba(51,34,89,.08)]":"vision-card border-[#342754] bg-[#171123] text-white shadow-[0_22px_60px_rgba(22,15,35,.18)]"}`}><p className={`text-[8px] font-bold uppercase tracking-[.18em] ${index===0?"text-[#6747D7]":"text-[#D7B85E]"}`}>0{index+1} · {title}</p><p className={`mt-12 text-2xl font-medium leading-10 tracking-[-.03em] sm:text-3xl ${index===0?"text-[#241D2B]":"text-white"}`}>{copy}</p></article>)}
    </section>

    <section className="border-y border-[#E8E3EB] bg-white/70 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1240px]"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#6747D7]">Core Principles</p><div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h2 className="max-w-2xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">The standards behind every connection.</h2><p className="max-w-sm text-[11px] leading-6 text-[#77707D]">Commercial value first, supported by intelligent infrastructure and accountable outcomes.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{principles.map(([title,copy],index)=><article key={title} className="rounded-[22px] border border-[#E8E3EB] bg-white p-6 shadow-[0_8px_25px_rgba(45,30,70,.04)] transition hover:-translate-y-1 hover:border-[#CCBEF5]"><span className="text-[8px] font-bold text-[#B0A9B5]">0{index+1}</span><h3 className="mt-10 text-[15px] font-semibold leading-6">{title}</h3><p className="mt-3 text-[9px] leading-5 text-[#7B7481]">{copy}</p></article>)}</div></div>
    </section>

    <section id="contact" className="scroll-mt-24 px-5 py-24 text-center sm:px-8"><div className="mx-auto max-w-3xl rounded-[30px] border border-[#D8CDF7] bg-gradient-to-br from-[#F4F0FF] to-[#FFF9EB] p-9 sm:p-14"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#6747D7]">Start a conversation</p><h2 className="mt-5 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Build the network with us.</h2><p className="mx-auto mt-4 max-w-xl text-[11px] leading-6 text-[#6F6876]">For pilot participation, strategic partnerships, or investor conversations, begin with the guided NEFE onboarding experience.</p><Link href="/onboarding" className="button-primary mt-8">Join the Network →</Link></div></section>
  </main>;
}
