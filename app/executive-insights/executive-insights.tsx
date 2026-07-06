"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PrototypeAssistant from "../components/prototype-assistant";
import BrandLogo from "../components/brand-logo";

type IconName = "business" | "referral" | "revenue" | "campaign" | "customer" | "reward" | "arrow" | "calendar" | "download" | "spark" | "trend";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    business: <><path d="M4 21V5h11v16M15 10h5v11M8 9h3M8 13h3M8 17h3M2 21h20" /></>,
    referral: <><path d="M8 7h12M16 3l4 4-4 4M16 17H4M8 13l-4 4 4 4" /></>,
    revenue: <><path d="M4 19V9M10 19V5M16 19v-7M3 19h18M18 9l3-3M21 6h-4M21 6v4" /></>,
    campaign: <><path d="m4 13 11-5v10L4 13ZM4 13v5M15 11h3a2 2 0 0 1 0 4h-3M7 17l1 4h4" /></>,
    customer: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6" /></>,
    reward: <><path d="M12 21s7-3.5 7-10V5l-7-2-7 2v6c0 6.5 7 10 7 10Z" /><path d="m9 12 2 2 4-5" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const kpis: { label: string; end: number; prefix?: string; suffix?: string; decimals?: number; change: string; icon: IconName; tone: string }[] = [
  { label: "Businesses Onboarded", end: 1247, change: "+84 this month", icon: "business", tone: "purple" },
  { label: "Monthly Referrals", end: 48392, change: "+18.7%", icon: "referral", tone: "blue" },
  { label: "Revenue Created", end: 12.8, prefix: "AED ", suffix: "M", decimals: 1, change: "+22.0%", icon: "revenue", tone: "gold" },
  { label: "Active Campaigns", end: 618, change: "+46 this month", icon: "campaign", tone: "mint" },
  { label: "Average Customer Value", end: 2410, prefix: "AED ", change: "+12.4%", icon: "customer", tone: "pink" },
  { label: "Rewards Distributed", end: 1.4, suffix: "M", decimals: 1, change: "+28.2%", icon: "reward", tone: "orange" },
];

const industries = [
  { name: "Hotels", revenue: "AED 3.42M", share: 27, growth: "+31.4%", color: "#5E3BEE" },
  { name: "Restaurants", revenue: "AED 2.61M", share: 21, growth: "+24.8%", color: "#C5963E" },
  { name: "Car Rentals", revenue: "AED 1.86M", share: 15, growth: "+28.1%", color: "#4F78C9" },
  { name: "Beach Clubs", revenue: "AED 1.54M", share: 12, growth: "+36.7%", color: "#36A1A7" },
  { name: "Retail", revenue: "AED 1.33M", share: 10, growth: "+17.2%", color: "#C56F93" },
  { name: "Healthcare", revenue: "AED 1.08M", share: 8, growth: "+14.6%", color: "#4A9A7D" },
  { name: "Events", revenue: "AED 0.96M", share: 7, growth: "+22.9%", color: "#8B70D6" },
];

const campaigns = [
  { name: "Dubai Weekend Escape", partners: "Celeste × Aurum × Maison D'Or", revenue: "AED 842,600", conversion: "14.8%", lift: "+32%" },
  { name: "Coast to Calm", partners: "Azure Beach × Serein Wellness", revenue: "AED 618,240", conversion: "13.2%", lift: "+28%" },
  { name: "Executive Arrival", partners: "Aurum Drive × One&Only", revenue: "AED 486,900", conversion: "11.7%", lift: "+21%" },
  { name: "Dinner & Culture", partners: "Maison D'Or × The Foundry", revenue: "AED 392,480", conversion: "10.9%", lift: "+19%" },
];

const recommendations = [
  { title: "Expand hotel and luxury transport bundles", detail: "Hospitality-to-mobility referrals convert 2.3× above the network average.", impact: "AED 1.8M opportunity", confidence: "96%" },
  { title: "Increase beach club partnerships before holiday season", detail: "Forward demand signals show a 34% increase in premium coastal experiences.", impact: "+8 priority partners", confidence: "93%" },
  { title: "Target premium tourists with weekend experience packages", detail: "Multi-partner weekend bundles deliver the strongest customer value and repeat rate.", impact: "+22% customer value", confidence: "91%" },
  { title: "Launch rewards tiers for repeat customers", detail: "Gold and Platinum progression could lift the 90-day repeat rate by 8.4 points.", impact: "AED 940K retained", confidence: "89%" },
];

function Counter({ end, prefix = "", suffix = "", decimals = 0 }: { end: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      setValue(end * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [end]);
  return <>{prefix}{value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

export default function ExecutiveInsights() {
  const [period, setPeriod] = useState("This month");
  const [toast, setToast] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return <main className="min-h-screen bg-[#F6F5F8] text-[#19152A]">
    <header className="sticky top-0 z-30 border-b border-[#E7E3EB] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <div className="flex items-center gap-5"><BrandLogo priority /><span className="hidden h-6 w-px bg-[#E7E2EB] sm:block" /><div className="hidden sm:block"><p className="text-[10px] text-[#99939F]">Leadership Workspace</p><p className="text-xs font-semibold">Executive Insights</p></div></div>
        <div className="flex items-center gap-2"><Link href="/business-model" className="hidden rounded-xl bg-[#FFF6E1] px-3 py-2.5 text-[10px] font-semibold text-[#8E681E] transition hover:bg-[#FCEEC9] md:block">Business Model</Link><Link href="/opportunity-engine" className="hidden rounded-xl bg-[#F0ECFF] px-3 py-2.5 text-[10px] font-semibold text-[#5E3BEE] transition hover:bg-[#E8E1FF] lg:block">Opportunity Engine</Link><Link href="/business-portal" className="rounded-xl border border-[#E4DFE9] bg-white px-4 py-2.5 text-[10px] font-semibold text-[#5C5564] shadow-sm transition hover:border-[#C6B8F5] hover:text-[#5E3BEE]">← Business Portal</Link></div>
      </div>
    </header>

    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="flex w-fit items-center gap-2 rounded-full border border-[#DDD4F8] bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#5E3BEE]"><span className="relative flex h-2 w-2"><i className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#35A779] opacity-50" /><i className="relative h-2 w-2 rounded-full bg-[#35A779]" /></span> Live ecosystem data</div><h1 className="mt-4 text-3xl font-semibold tracking-[-.05em] sm:text-[40px]">Executive Insights</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#827B89]">A real-time view of ecosystem growth, partner activity, and revenue impact.</p></div>
        <div className="flex flex-wrap gap-2"><div className="flex rounded-xl border border-[#E5E0E8] bg-white p-1">{["This month","Quarter","Year"].map(item => <button key={item} onClick={() => { setPeriod(item); notify(`Insights updated: ${item}`); }} className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${period === item ? "bg-[#F0ECFF] text-[#5E3BEE]" : "text-[#8B8491] hover:text-[#5E3BEE]"}`}>{item}</button>)}</div><button onClick={() => notify("Executive report downloaded")} className="flex items-center gap-2 rounded-xl bg-[#211831] px-4 py-2.5 text-[9px] font-semibold text-white shadow-[0_9px_22px_rgba(33,24,49,.16)]"><Icon name="download" className="h-3.5 w-3.5" />Export report</button></div>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map(kpi => <article key={kpi.label} className="group rounded-[19px] border border-[#E8E4EC] bg-white p-4 shadow-[0_4px_18px_rgba(37,28,60,.025)] transition hover:-translate-y-1 hover:border-[#D6CBF8] hover:shadow-[0_14px_35px_rgba(55,37,100,.07)]"><div className="flex items-start justify-between"><span className={`portal-icon ${kpi.tone}`}><Icon name={kpi.icon} className="h-[17px] w-[17px]" /></span><span className="rounded-full bg-[#EAF9F2] px-2 py-1 text-[8px] font-bold text-[#159166]">{kpi.change}</span></div><p className="mt-5 text-[9px] font-medium text-[#8A8491]">{kpi.label}</p><p className="mt-1.5 text-xl font-bold tracking-[-.03em]"><Counter end={kpi.end} prefix={kpi.prefix} suffix={kpi.suffix} decimals={kpi.decimals} /></p><div className="mt-3 h-1 overflow-hidden rounded-full bg-[#F0EDF3]"><div className="executive-kpi-line h-full rounded-full bg-gradient-to-r from-[#5E3BEE] to-[#B7A2F8]" /></div></article>)}
      </section>

      <section className="mt-5 overflow-hidden rounded-[26px] bg-gradient-to-br from-[#1D1437] via-[#2C1C5C] to-[#5835CA] p-6 text-white shadow-[0_24px_60px_rgba(49,29,112,.18)] sm:p-8">
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#CCBEFF]"><Icon name="spark" className="h-4 w-4 text-[#E4C573]" /> Growth summary</div><h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-tight tracking-[-.04em] sm:text-[32px]">This month, partner businesses generated <span className="text-[#E5C772]">22% more revenue</span> through cross-business campaigns.</h2><p className="mt-4 max-w-xl text-[11px] leading-5 text-white/50">Growth was led by hospitality, transport and coastal lifestyle partnerships, with customer referrals reaching a new network high.</p></div><div className="rounded-[20px] border border-white/10 bg-white/[.07] p-5 backdrop-blur"><div className="flex items-end justify-between"><div><p className="text-[8px] text-white/40">ECOSYSTEM REVENUE</p><p className="mt-1 text-2xl font-semibold">AED 12.8M</p></div><span className="rounded-full bg-[#38A97D]/20 px-2.5 py-1.5 text-[8px] font-bold text-[#79DCB5]">↗ 22.0%</span></div><div className="mt-6 flex h-24 items-end gap-2">{[30,38,35,48,53,47,65,69,78,74,88,100].map((height,i) => <i key={i} className="chart-bar flex-1 rounded-t bg-gradient-to-t from-[#7655E8] to-[#C2B1FA]" style={{height:`${height}%`,animationDelay:`${i*55}ms`,opacity:.55+i*.035}} />)}</div><div className="mt-3 flex justify-between text-[7px] text-white/30"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div></div></div>
      </section>

      <section className="mt-10 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-[24px] border border-[#E7E3EB] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#7359D8]">Industry breakdown</p><h2 className="mt-1.5 text-xl font-semibold tracking-[-.03em]">Revenue contribution</h2><p className="mt-1 text-[9px] text-[#99939F]">Performance across the NEFE business ecosystem.</p></div><span className="hidden text-[8px] font-semibold text-[#8D8693] sm:block">AED 12.8M total</span></div>
          <div className="mt-6 space-y-4">{industries.map((industry,i) => <div key={industry.name} className="grid grid-cols-[90px_1fr_70px] items-center gap-3 sm:grid-cols-[120px_1fr_90px_70px]"><div className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{background:industry.color}} /><span className="text-[9px] font-semibold">{industry.name}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#F0EDF3]"><div className="executive-industry-bar h-full rounded-full" style={{width:`${industry.share*3.2}%`,background:industry.color,animationDelay:`${i*80}ms`}} /></div><span className="hidden text-right text-[9px] font-semibold sm:block">{industry.revenue}</span><span className="text-right text-[8px] font-bold text-[#159166]">{industry.growth}</span></div>)}</div>
        </article>
        <article className="rounded-[24px] border border-[#E7E3EB] bg-white p-5 sm:p-6">
          <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#7359D8]">Network momentum</p><h2 className="mt-1.5 text-xl font-semibold tracking-[-.03em]">Referral growth</h2><div className="relative mx-auto mt-7 grid h-44 w-44 place-items-center rounded-full" style={{background:"conic-gradient(#5E3BEE 0 64%,#D6A84F 64% 82%,#4AAE90 82% 94%,#ECE8F2 94% 100%)"}}><div className="grid h-[112px] w-[112px] place-items-center rounded-full bg-white text-center"><div><p className="text-[8px] text-[#9C96A1]">Successful</p><p className="mt-1 text-2xl font-bold">94%</p><p className="text-[7px] text-[#159166]">+8.2 pts</p></div></div></div><div className="mt-7 grid grid-cols-3 text-center">{[["48,392","Referrals"],["1,247","Businesses"],["38.8","Avg. each"]].map(([value,label],i) => <div key={label} className={i ? "border-l border-[#EDE9F0]" : ""}><p className="text-xs font-bold">{value}</p><p className="mt-1 text-[7px] text-[#9A94A0]">{label}</p></div>)}</div>
        </article>
      </section>

      <section className="mt-10">
        <div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#7359D8]">Commercial leaders</p><h2 className="mt-1.5 text-xl font-semibold tracking-[-.03em]">Top performing campaigns</h2><p className="mt-1 text-[9px] text-[#99939F]">Highest revenue-generating cross-business campaigns this period.</p></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{campaigns.map((campaign,i) => <article key={campaign.name} className="group rounded-[20px] border border-[#E8E4EC] bg-white p-4 transition hover:-translate-y-1 hover:border-[#D5CAF8] hover:shadow-[0_14px_35px_rgba(54,37,99,.07)]"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#F0ECFF] text-[9px] font-bold text-[#5E3BEE]">0{i+1}</span><span className="rounded-full bg-[#EAF9F2] px-2 py-1 text-[8px] font-bold text-[#159166]">{campaign.lift}</span></div><h3 className="mt-5 text-[12px] font-semibold">{campaign.name}</h3><p className="mt-1.5 truncate text-[8px] text-[#99939F]">{campaign.partners}</p><div className="mt-4 flex items-end justify-between border-t border-[#F0EDF3] pt-3"><div><p className="text-[7px] text-[#A29CA7]">Revenue</p><p className="mt-1 text-xs font-bold">{campaign.revenue}</p></div><div className="text-right"><p className="text-[7px] text-[#A29CA7]">Conversion</p><p className="mt-1 text-xs font-bold text-[#5E3BEE]">{campaign.conversion}</p></div></div></article>)}</div>
      </section>

      <section className="mt-10 pb-10">
        <div className="flex items-end justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#7359D8]">NEFE Intelligence</p><h2 className="mt-1.5 text-xl font-semibold tracking-[-.03em]">Strategic recommendations</h2><p className="mt-1 text-[9px] text-[#99939F]">Priority actions identified from current network performance.</p></div><span className="hidden rounded-full border border-[#DED5FA] bg-white px-3 py-2 text-[8px] font-bold text-[#5E3BEE] sm:block">Updated 4 min ago</span></div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">{recommendations.map((item,i) => <article key={item.title} className={`rounded-[20px] border p-5 transition ${expanded === item.title ? "border-[#C8BAF5] bg-gradient-to-r from-[#F5F1FF] to-[#FFF9EC]" : "border-[#E8E4EC] bg-white hover:border-[#D5CAF8]"}`}><button onClick={() => setExpanded(expanded === item.title ? null : item.title)} className="flex w-full items-start gap-4 text-left"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-gradient-to-br from-[#5E3BEE] to-[#8F70EB] text-[#E9D07A] shadow-[0_8px_18px_rgba(94,59,238,.18)]"><Icon name={i === 0 ? "trend" : "spark"} className="h-[18px] w-[18px]" /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h3 className="text-[11px] font-semibold">{item.title}</h3><span className="shrink-0 rounded-full bg-[#F0ECFF] px-2 py-1 text-[7px] font-bold text-[#5E3BEE]">{item.confidence} confidence</span></div><p className="mt-2 text-[9px] leading-4 text-[#847D89]">{item.detail}</p><div className="mt-3 flex items-center justify-between"><span className="text-[8px] font-bold text-[#159166]">{item.impact}</span><span className="text-[8px] font-semibold text-[#5E3BEE]">{expanded === item.title ? "Hide action ↑" : "View action →"}</span></div></div></button>{expanded === item.title && <div className="prototype-modal mt-4 border-t border-[#DDD4F4] pt-4 pl-14"><p className="text-[8px] leading-4 text-[#716A78]">Recommended next step: create a focused 30-day pilot with the top three compatible partners, then measure referral acceptance, package conversion and repeat intent.</p><button onClick={() => notify(`Strategic initiative created: ${item.title}`)} className="mt-3 rounded-lg bg-[#5E3BEE] px-3 py-2 text-[8px] font-semibold text-white">Create strategic initiative</button></div>}</article>)}</div>
      </section>
    </div>
    <PrototypeAssistant />
    {toast && <div className="prototype-toast fixed bottom-6 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#211A32]/95 px-4 py-3 text-[10px] font-semibold text-white shadow-2xl"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#31A477] text-[10px]">✓</span>{toast}</div>}
  </main>;
}
