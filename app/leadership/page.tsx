import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Leadership | NEFE Business Network",
  description: "Executive leadership and the long-term vision behind NEFE Business Network.",
};

const focus = ["UAE Commercial Expansion","Business Partnership Network","Hospitality Ecosystem","Merchant Intelligence","Commercial AI","Experience Economy"];
const summaries = [["Region","United Arab Emirates"],["Focus","Commercial Ecosystems"],["Vision","Connected Business Economy"],["Company","Golden Rock Blockchain LTD"]];
const roles = [["Product Lead","PL"],["Growth Lead","GL"],["Technology Lead","TL"],["Commercial Partnerships Lead","CP"]];

export default function LeadershipPage() {
  return <main className="company-page overflow-hidden bg-[#FAF9FB] text-[#191424]">
    <section className="relative border-b border-[#E8E3EB] px-5 py-20 sm:px-8 sm:py-28"><div className="company-grid absolute inset-0"/><div className="relative mx-auto max-w-[1240px]"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#6747D7]">Executive Leadership</p><h1 className="mt-6 max-w-4xl text-[46px] font-semibold leading-[1.04] tracking-[-.058em] sm:text-[72px]">Leadership built around <span className="gradient-text">commercial outcomes.</span></h1></div></section>

    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
        <aside className="relative overflow-hidden rounded-[30px] border border-[#7658C8]/70 bg-gradient-to-br from-[#171021] via-[#241641] to-[#5837C5] text-white shadow-[0_34px_90px_rgba(41,27,72,.24),0_0_0_1px_rgba(205,166,76,.1)]">
          <div className="pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#E3C470] to-transparent"/>
          <div className="relative aspect-[4/4.75] overflow-hidden bg-[#27222B]">
            <Image
              src="/ali-ahmad-alsharif.png"
              alt="Ali Ahmad Alsharif, Founder and Chief Executive Officer"
              fill
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 70vw, calc(100vw - 40px)"
              className="object-cover object-[center_26%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171021]/55 via-transparent to-[#5E3BEE]/5"/>
          </div>
          <div className="border-t border-white/10 p-7"><h2 className="text-2xl font-semibold">Ali Ahmad Alsharif</h2><p className="mt-2 text-[10px] font-medium text-[#D5C8FA]">Founder &amp; Chief Executive Officer</p><div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5"><span className="h-1.5 w-1.5 rounded-full bg-[#DDBD63]"/><p className="text-[8px] font-semibold uppercase tracking-[.12em] text-white/55">Golden Rock Blockchain LTD</p></div></div>
        </aside>

        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#6747D7]">Professional Summary</p>
          <div className="mt-5 space-y-5 text-[13px] leading-7 text-[#625B68]"><p>Ali Ahmad Alsharif leads the vision behind NEFE Business Network, building a commercial ecosystem that enables businesses to grow through partnerships, customer sharing, bundled experiences and intelligent commerce.</p><p>His focus is creating practical business infrastructure that connects hospitality, retail, mobility, tourism, real estate and services into one commercial network powered by technology.</p><p>The objective is to help businesses generate measurable commercial growth through collaboration rather than operating independently.</p></div>
          <blockquote className="mt-9 rounded-[24px] border border-[#D9CDF8] bg-white p-7 text-xl font-medium leading-9 tracking-[-.025em] shadow-[0_16px_45px_rgba(48,32,85,.06)]"><span className="text-[#C3963D]">“</span>We believe businesses grow faster together than alone. NEFE exists to create measurable commercial relationships that benefit every participant in the network.<span className="text-[#C3963D]">”</span><footer className="mt-5 text-[8px] font-bold uppercase tracking-[.15em] text-[#766F7B]">Leadership Philosophy</footer></blockquote>
          <div className="mt-9"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#6747D7]">Current Focus</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{focus.map(item=><div key={item} className="flex items-center gap-3 rounded-[14px] border border-[#E6E1EA] bg-white px-4 py-3 text-[9px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-[#C69A43]"/>{item}</div>)}</div></div>
        </div>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{summaries.map(([label,value])=><article key={label} className="rounded-[20px] border border-[#E7E2EA] bg-white p-5 shadow-[0_7px_24px_rgba(45,30,70,.035)]"><p className="text-[7px] font-bold uppercase tracking-[.14em] text-[#98919D]">{label}</p><p className="mt-3 text-[12px] font-semibold leading-5">{value}</p></article>)}</div>
    </section>

    <section className="bg-[#171122] px-5 py-24 text-white sm:px-8 sm:py-28"><div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#D7B95F]">Long-term Direction</p><h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">A network designed to compound.</h2></div><p className="text-base leading-8 text-white/60">The leadership mandate is to turn fragmented customer journeys into coordinated economic activity—giving businesses clearer opportunities, cities stronger commercial participation, and customers more relevant experiences across every sector they use.</p></div></section>

    <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-28"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#6747D7]">Leadership Team</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em]">Building the executive bench.</h2></div><Link href="/about#contact" className="text-[10px] font-semibold text-[#5E3BEE]">Contact leadership →</Link></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{roles.map(([role,initials])=><article key={role} className="group overflow-hidden rounded-[22px] border border-[#E6E1E9] bg-white transition hover:-translate-y-1 hover:border-[#CCBEF5] hover:shadow-[0_18px_40px_rgba(48,32,85,.07)]"><div className="relative grid aspect-[1.45/1] place-items-center overflow-hidden border-b border-[#EAE5EE] bg-gradient-to-br from-[#F3F0F6] via-[#F9F7FA] to-[#EEE8FA]"><div className="absolute inset-0 opacity-40 company-grid"/><div className="relative grid h-20 w-20 place-items-center rounded-full border border-white bg-white/75 text-[17px] font-semibold tracking-[.08em] text-[#756A80] shadow-[0_14px_35px_rgba(48,32,85,.1)] backdrop-blur">{initials}</div><div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C99E48]/60 to-transparent"/></div><div className="p-6"><h3 className="text-[14px] font-semibold">{role}</h3><div className="mt-6 border-t border-[#EEEAF1] pt-4 text-[8px] font-bold uppercase tracking-[.14em] text-[#B08A39]">Position Available</div></div></article>)}</div></section>
  </main>;
}
