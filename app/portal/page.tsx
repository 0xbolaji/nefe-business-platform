"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PrototypeAssistant from "../components/prototype-assistant";

type IconName =
  | "grid" | "partners" | "campaigns" | "referrals" | "analytics"
  | "rewards" | "settings" | "search" | "bell" | "plus" | "arrow"
  | "revenue" | "repeat" | "value" | "calendar" | "location" | "spark";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    partners: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6" /></>,
    campaigns: <><path d="m4 13 11-5v10L4 13ZM4 13v5M15 11h3a2 2 0 0 1 0 4h-3M7 17l1 4h4" /></>,
    referrals: <><path d="M8 7h12M16 3l4 4-4 4M16 17H4M8 13l-4 4 4 4" /></>,
    analytics: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    rewards: <><path d="M12 21s7-3.5 7-10V5l-7-2-7 2v6c0 6.5 7 10 7 10Z" /><path d="m9 12 2 2 4-5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    revenue: <><path d="M4 19V9M10 19V5M16 19v-7M3 19h18M18 9l3-3M21 6h-4M21 6v4" /></>,
    repeat: <><path d="M20 7h-9a6 6 0 0 0-6 6v1M4 17h9a6 6 0 0 0 6-6v-1M17 4l3 3-3 3M7 20l-3-3 3-3" /></>,
    value: <><circle cx="12" cy="12" r="9" /><path d="M16 8.5A4.5 4.5 0 1 0 16 15M8 10h7M8 14h6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="NEFE home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#5E3BEE] text-white shadow-[0_8px_24px_rgba(94,59,238,.25)]">
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none"><path d="M7 22V10l9 12V10l9 12V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span className="text-[19px] font-bold tracking-[-.04em] text-[#151127]">nefe</span>
      <span className="rounded-md bg-[#F0ECFF] px-1.5 py-1 text-[8px] font-bold uppercase tracking-wider text-[#5E3BEE]">Portal</span>
    </Link>
  );
}

const navItems: { label: string; icon: IconName; href: string }[] = [
  { label: "Dashboard", icon: "grid", href: "#dashboard" },
  { label: "Partners", icon: "partners", href: "#partners" },
  { label: "Campaigns", icon: "campaigns", href: "#campaigns" },
  { label: "Referrals", icon: "referrals", href: "#referrals" },
  { label: "Analytics", icon: "analytics", href: "#analytics" },
  { label: "Rewards", icon: "rewards", href: "#rewards" },
  { label: "Settings", icon: "settings", href: "#settings" },
];

const metrics: { label: string; value: string; change: string; detail: string; icon: IconName; tone: string }[] = [
  { label: "Total Revenue Generated", value: "AED 1.28M", change: "+18.4%", detail: "vs. last month", icon: "revenue", tone: "purple" },
  { label: "Partner Businesses", value: "24", change: "+3", detail: "new this month", icon: "partners", tone: "gold" },
  { label: "Active Campaigns", value: "8", change: "92%", detail: "avg. performance", icon: "campaigns", tone: "blue" },
  { label: "Customer Referrals", value: "2,841", change: "+24.7%", detail: "vs. last month", icon: "referrals", tone: "mint" },
  { label: "Repeat Customer Rate", value: "42.8%", change: "+6.2%", detail: "last 90 days", icon: "repeat", tone: "pink" },
  { label: "Customer Lifetime Value", value: "AED 4,860", change: "+12.1%", detail: "network average", icon: "value", tone: "orange" },
];

function AnimatedNumber({ end, prefix = "", suffix = "", decimals = 0 }: { end: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 1100, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end]);
  return <>{prefix}{value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

function MetricValue({ label }: { label: string }) {
  if (label === "Total Revenue Generated") return <AnimatedNumber end={1.28} prefix="AED " suffix="M" decimals={2} />;
  if (label === "Partner Businesses") return <AnimatedNumber end={24} />;
  if (label === "Active Campaigns") return <AnimatedNumber end={8} />;
  if (label === "Customer Referrals") return <AnimatedNumber end={2841} />;
  if (label === "Repeat Customer Rate") return <AnimatedNumber end={42.8} suffix="%" decimals={1} />;
  return <AnimatedNumber end={4860} prefix="AED " />;
}

const partners = [
  { name: "The Celeste Dubai", category: "Luxury Hotel", location: "Palm Jumeirah", status: "Active", referrals: "486", performance: 94, initials: "CD", color: "from-[#5E3BEE] to-[#9A7CF8]" },
  { name: "Maison D'Or", category: "Fine Dining", location: "DIFC", status: "Active", referrals: "372", performance: 89, initials: "MD", color: "from-[#B57A26] to-[#E0BC6D]" },
  { name: "Azure Beach Society", category: "Beach Club", location: "JBR", status: "Active", referrals: "318", performance: 91, initials: "AB", color: "from-[#168BA0] to-[#6CC5D4]" },
  { name: "Aurum Drive", category: "Luxury Car Rental", location: "Downtown Dubai", status: "Active", referrals: "264", performance: 86, initials: "AD", color: "from-[#2F3547] to-[#777E90]" },
  { name: "Serein Wellness", category: "Spa", location: "Jumeirah", status: "Active", referrals: "227", performance: 83, initials: "SW", color: "from-[#AF6A88] to-[#E1A3BA]" },
  { name: "Forme Athletic", category: "Premium Gym", location: "Dubai Marina", status: "Active", referrals: "194", performance: 78, initials: "FA", color: "from-[#D3692A] to-[#F2A56E]" },
  { name: "Lumé Joaillerie", category: "Jewelry Store", location: "Dubai Mall", status: "Review", referrals: "156", performance: 74, initials: "LJ", color: "from-[#776040] to-[#C8A96D]" },
  { name: "The Foundry", category: "Event Venue", location: "Al Quoz", status: "Active", referrals: "143", performance: 81, initials: "TF", color: "from-[#3B63B8] to-[#759BEE]" },
];

const initialCampaigns = [
  { name: "Weekend Stay + Fine Dining", businesses: ["CD", "MD"], revenue: "AED 286,400", reach: "18,420", conversion: "12.8%", status: "Live" },
  { name: "Luxury Car + Hotel Pickup", businesses: ["AD", "CD"], revenue: "AED 194,650", reach: "12,840", conversion: "10.4%", status: "Live" },
  { name: "Beach Club + Spa Day", businesses: ["AB", "SW"], revenue: "AED 142,820", reach: "15,290", conversion: "8.9%", status: "Live" },
  { name: "Restaurant + Event Night", businesses: ["MD", "TF"], revenue: "AED 98,240", reach: "9,670", conversion: "7.6%", status: "Scheduled" },
];

const referrals = [
  { from: "The Celeste Dubai", to: "Maison D'Or", customer: "Guest referral", value: "AED 1,850", time: "8 min ago", initials: ["CD", "MD"] },
  { from: "Aurum Drive", to: "The Celeste Dubai", customer: "VIP booking", value: "AED 6,400", time: "24 min ago", initials: ["AD", "CD"] },
  { from: "Azure Beach Society", to: "Serein Wellness", customer: "Wellness package", value: "AED 1,240", time: "1 hr ago", initials: ["AB", "SW"] },
  { from: "Maison D'Or", to: "The Foundry", customer: "Private event enquiry", value: "AED 12,500", time: "2 hrs ago", initials: ["MD", "TF"] },
  { from: "Forme Athletic", to: "Serein Wellness", customer: "Recovery session", value: "AED 780", time: "3 hrs ago", initials: ["FA", "SW"] },
];

function SectionTitle({ eyebrow, title, detail, action, onAction }: { eyebrow: string; title: string; detail: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#7B61E8]">{eyebrow}</p><h2 className="mt-1.5 text-[25px] font-semibold tracking-[-.035em] text-[#18142A]">{title}</h2><p className="mt-1 text-sm text-[#888292]">{detail}</p></div>
      {action && <button onClick={onAction} className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E8E3EE] bg-white px-4 py-2.5 text-xs font-semibold text-[#554E61] shadow-sm transition hover:-translate-y-0.5 hover:border-[#CDC1FA] hover:text-[#5E3BEE]">{action}<Icon name="arrow" className="h-3.5 w-3.5" /></button>}
    </div>
  );
}

const discoveryPartners = [
  { name: "One&Only One Za'abeel", category: "Hotels", location: "One Za'abeel", potential: "AED 310K", score: 96, referrals: 184, initials: "OO" },
  { name: "Trèsind Studio", category: "Restaurants", location: "Palm Jumeirah", potential: "AED 245K", score: 94, referrals: 156, initials: "TS" },
  { name: "Level Shoes Private", category: "Luxury Retail", location: "Dubai Mall", potential: "AED 198K", score: 91, referrals: 128, initials: "LS" },
  { name: "VIP Rent A Car", category: "Car Rental", location: "Business Bay", potential: "AED 176K", score: 89, referrals: 112, initials: "VR" },
  { name: "OMNIYAT Residences", category: "Real Estate", location: "Downtown Dubai", potential: "AED 420K", score: 87, referrals: 74, initials: "OR" },
  { name: "Embody Fitness", category: "Fitness", location: "DIFC", potential: "AED 118K", score: 92, referrals: 137, initials: "EF" },
  { name: "Talise Ottoman Spa", category: "Spa", location: "Palm Jumeirah", potential: "AED 164K", score: 95, referrals: 149, initials: "TO" },
  { name: "King's College Hospital", category: "Medical", location: "Dubai Hills", potential: "AED 138K", score: 84, referrals: 96, initials: "KC" },
  { name: "Coca-Cola Arena", category: "Events", location: "City Walk", potential: "AED 272K", score: 93, referrals: 171, initials: "CA" },
];

function ModalShell({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-[#120C23]/45 p-4 backdrop-blur-sm" onMouseDown={onClose}><div onMouseDown={event => event.stopPropagation()} className={`max-h-[92vh] w-full overflow-y-auto rounded-[26px] border border-white/60 bg-white shadow-[0_35px_100px_rgba(20,12,45,.3)] prototype-modal ${wide ? "max-w-[780px]" : "max-w-[620px]"}`}>{children}</div></div>;
}

function CreateCampaignModal({ onClose, onGenerated }: { onClose: () => void; onGenerated: (campaign: (typeof initialCampaigns)[number]) => void }) {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [partner, setPartner] = useState("Azure Beach Society");
  const [type, setType] = useState("Bundled experience");

  function generate() {
    setStep("loading");
    window.setTimeout(() => setStep("result"), 900);
  }

  return <ModalShell onClose={onClose} wide>
    <div className="flex items-center justify-between border-b border-[#ECE8F0] px-6 py-5"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#6D50DD]">Campaign Studio</p><h2 className="mt-1 text-xl font-semibold tracking-[-.03em]">{step === "result" ? "Your campaign is ready" : "Create a joint campaign"}</h2></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-[#F5F2F8] text-[#716A7A]">×</button></div>
    {step === "form" && <div className="p-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#F1EDFF] to-[#FFF9E9] p-4"><p className="text-[10px] font-semibold text-[#4E3A9C]">✦ NEFE campaign intelligence</p><p className="mt-1 text-[9px] leading-4 text-[#786F86]">Choose the commercial inputs. We&apos;ll turn them into a polished, performance-led campaign.</p></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="prototype-field"><span>Partner business</span><select value={partner} onChange={e => setPartner(e.target.value)}>{partners.slice(1,6).map(item => <option key={item.name}>{item.name}</option>)}</select></label>
        <label className="prototype-field"><span>Campaign type</span><select value={type} onChange={e => setType(e.target.value)}>{["Bundled experience","Referral partnership","VIP member offer","Seasonal activation"].map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="prototype-field"><span>Campaign dates</span><input defaultValue="15 Jul — 31 Aug 2026" /></label>
        <label className="prototype-field"><span>Target audience</span><select defaultValue="Luxury leisure travelers"><option>Luxury leisure travelers</option><option>Dubai residents</option><option>VIP members</option><option>Corporate guests</option></select></label>
        <label className="prototype-field"><span>Campaign budget</span><div className="relative"><i>AED</i><input className="!pl-12" defaultValue="65,000" /></div></label>
        <label className="prototype-field"><span>Expected revenue</span><div className="relative"><i>AED</i><input className="!pl-12" defaultValue="320,000" /></div></label>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button onClick={onClose} className="rounded-xl border border-[#E5E0E9] px-4 py-3 text-xs font-semibold text-[#746D7C]">Cancel</button><button onClick={generate} className="rounded-xl bg-[#5E3BEE] px-5 py-3 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(94,59,238,.22)]">✦ Generate Campaign</button></div>
    </div>}
    {step === "loading" && <div className="p-8"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#F0ECFF] text-xl text-[#5E3BEE] assistant-thinking">✦</div><p className="mt-4 text-center text-sm font-semibold">Designing your campaign...</p><p className="mt-1 text-center text-[9px] text-[#938C99]">Analyzing partner overlap, audience fit and revenue potential</p><div className="mx-auto mt-7 max-w-md space-y-3"><div className="h-12 animate-pulse rounded-xl bg-[#F3F0F6]" /><div className="grid grid-cols-3 gap-3">{[1,2,3].map(x => <div key={x} className="h-16 animate-pulse rounded-xl bg-[#F3F0F6]" />)}</div><div className="h-20 animate-pulse rounded-xl bg-[#F3F0F6]" /></div></div>}
    {step === "result" && <div className="p-6">
      <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-[#211746] via-[#3A247D] to-[#6B47DD] p-6 text-white"><div className="flex items-start justify-between"><span className="rounded-full bg-white/10 px-2.5 py-1.5 text-[8px] font-bold text-[#D7CBFF]">GENERATED BY NEFE AI</span><span className="rounded-full bg-[#D8B453]/20 px-2.5 py-1.5 text-[8px] font-bold text-[#F0D582]">92% FIT</span></div><h3 className="mt-7 text-2xl font-semibold tracking-[-.04em]">Coast to Calm</h3><p className="mt-2 text-xs text-white/60">{partner} × Serein Wellness</p><p className="mt-5 max-w-lg text-[10px] leading-5 text-white/65">A seamless day-to-evening experience combining premium beach access with a restorative spa ritual and member-only privileges.</p></div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["AED 328K","Expected revenue"],["4,800","Projected guests"],["13.2%","Conversion"],["4.1×","Projected ROI"]].map(([value,label]) => <div key={label} className="rounded-xl border border-[#EAE6EE] p-3"><p className="text-sm font-bold">{value}</p><p className="mt-1 text-[7px] text-[#96909C]">{label}</p></div>)}</div>
      <div className="mt-5 flex justify-end gap-2"><button onClick={() => setStep("form")} className="rounded-xl border border-[#E5E0E9] px-4 py-3 text-xs font-semibold text-[#746D7C]">Edit inputs</button><button onClick={() => onGenerated({ name:"Coast to Calm", businesses:["AB","SW"], revenue:"AED 328,000", reach:"24,800", conversion:"13.2%", status:"Draft" })} className="rounded-xl bg-[#5E3BEE] px-5 py-3 text-xs font-semibold text-white">Add to campaigns</button></div>
    </div>}
  </ModalShell>;
}

function CampaignDetailModal({ campaign, onClose, onToast }: { campaign: (typeof initialCampaigns)[number]; onClose: () => void; onToast: (message: string) => void }) {
  return <ModalShell onClose={onClose} wide><div className="relative overflow-hidden bg-gradient-to-r from-[#211745] to-[#5A38D0] p-6 text-white"><button onClick={onClose} className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/10">×</button><span className="rounded-full bg-white/10 px-2.5 py-1.5 text-[8px] font-bold text-[#D5C9FF]">{campaign.status.toUpperCase()} CAMPAIGN</span><h2 className="mt-5 text-2xl font-semibold tracking-[-.04em]">{campaign.name}</h2><p className="mt-2 text-[10px] text-white/55">A premium multi-partner experience built for high-intent customers.</p></div>
    <div className="p-6"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[[campaign.revenue,"Expected revenue"],["3,240","Customer growth"],[campaign.conversion,"Conversion KPI"],["3.8×","Campaign ROI"]].map(([v,l]) => <div key={l} className="rounded-xl border border-[#EAE6EE] bg-[#FCFBFD] p-3"><p className="text-sm font-bold">{v}</p><p className="mt-1 text-[7px] text-[#99939F]">{l}</p></div>)}</div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2"><div><h3 className="text-xs font-semibold">Partner businesses</h3><div className="mt-3 flex items-center gap-3 rounded-xl border border-[#EAE6EE] p-3"><div className="flex -space-x-2">{campaign.businesses.map((b,i) => <span key={b} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[8px] font-bold text-white ${i ? "bg-[#C59B4B]" : "bg-[#5E3BEE]"}`}>{b}</span>)}</div><div><p className="text-[9px] font-semibold">Joint partnership</p><p className="mt-1 text-[7px] text-[#99939F]">{campaign.businesses.length} participating businesses</p></div></div></div>
      <div><h3 className="text-xs font-semibold">Campaign timeline</h3><div className="mt-3 space-y-3">{[["Creative approval","Completed"],["Partner launch","15 July"],["Mid-campaign review","2 August"],["Final report","31 August"]].map(([a,b],i) => <div key={a} className="flex items-center gap-2 text-[8px]"><span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-[#31A77D]" : "bg-[#CDBFF8]"}`} /><span>{a}</span><span className="ml-auto text-[#99939F]">{b}</span></div>)}</div></div></div>
      <div className="mt-6 rounded-xl bg-[#F4F1FC] p-4"><p className="text-[9px] font-semibold text-[#5E3BEE]">Key performance indicators</p><div className="mt-3 flex flex-wrap gap-2">{["Qualified reach","Partner referrals","Package bookings","Repeat visits","Revenue per guest"].map(kpi => <span key={kpi} className="rounded-full bg-white px-2.5 py-1.5 text-[8px] text-[#645D6C]">{kpi}</span>)}</div></div>
      <div className="mt-6 flex justify-end"><button onClick={() => onToast("Campaign proposal downloaded")} className="rounded-xl bg-[#5E3BEE] px-5 py-3 text-xs font-semibold text-white">↓ Download proposal</button></div>
    </div></ModalShell>;
}

export default function PortalPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<(typeof initialCampaigns)[number] | null>(null);
  const [campaignList, setCampaignList] = useState(initialCampaigns);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [invited, setInvited] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  const visibleDiscovery = discoveryPartners.filter(partner =>
    (category === "All" || partner.category === category) &&
    partner.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F7F6FA] text-[#19152A]">
      {loading && <div className="fixed inset-0 z-[100] bg-[#F7F6FA] p-8"><div className="mx-auto max-w-[1100px] animate-pulse"><div className="h-8 w-48 rounded-lg bg-[#EAE6EF]" /><div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-6">{[1,2,3,4,5,6].map(i => <div key={i} className="h-32 rounded-2xl bg-white" />)}</div><div className="mt-6 grid gap-4 lg:grid-cols-3"><div className="h-80 rounded-2xl bg-white lg:col-span-2" /><div className="h-80 rounded-2xl bg-white" /></div></div></div>}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[#EAE6EF] bg-white px-4 py-6 lg:flex">
        <div className="px-2"><Logo /></div>
        <div className="mt-9 px-2 text-[9px] font-bold uppercase tracking-[.18em] text-[#AAA4B1]">Workspace</div>
        <nav className="mt-3 space-y-1">
          {navItems.map((item, i) => <a key={item.label} href={item.href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${i === 0 ? "bg-[#F0ECFF] text-[#5E3BEE]" : "text-[#716B79] hover:bg-[#F8F6FC] hover:text-[#3F3850]"}`}><Icon name={item.icon} className="h-[18px] w-[18px]" />{item.label}{item.label === "Referrals" && <span className="ml-auto rounded-full bg-[#5E3BEE] px-1.5 py-0.5 text-[8px] text-white">12</span>}</a>)}
        </nav>
        <Link href="/experience-builder" className="mt-3 flex items-center gap-3 rounded-xl border border-[#E4D9FF] bg-gradient-to-r from-[#F3EFFF] to-[#FFF9E9] px-3 py-3 text-[11px] font-semibold text-[#5E3BEE] transition hover:-translate-y-0.5 hover:shadow-sm"><span className="text-[#B88B2B]">✦</span>Experience Builder<span className="ml-auto">→</span></Link>
        <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#251A51] to-[#5133D2] p-4 text-white">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10"><Icon name="spark" className="h-4 w-4 text-[#CFBEFF]" /></div>
          <p className="mt-3 text-xs font-semibold">NEFE Network</p>
          <p className="mt-1 text-[10px] leading-4 text-white/55">You&apos;re in the top 8% of partner businesses this month.</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#A98DFF] to-[#F1C978]" /></div>
        </div>
        <div className="mt-4 space-y-2">
          <Link href="/consumer" className="flex items-center gap-2 px-3 text-[11px] font-medium text-[#5E3BEE] transition hover:text-[#4225C7]">View Consumer App <span>→</span></Link>
          <Link href="/" className="flex items-center gap-2 px-3 text-[11px] font-medium text-[#8D8795] transition hover:text-[#5E3BEE]">← Back to website</Link>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-[#EAE6EF] bg-white/85 backdrop-blur-xl">
          <div className="flex h-[72px] items-center justify-between px-4 sm:px-7 lg:px-9">
            <div className="lg:hidden"><Logo /></div>
            <div className="hidden lg:block"><p className="text-[11px] text-[#98919F]">Business Portal</p><p className="text-sm font-semibold">Celeste Hospitality Group</p></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/consumer" className="hidden rounded-xl bg-[#F0ECFF] px-3 py-2.5 text-[10px] font-semibold text-[#5E3BEE] transition hover:bg-[#E8E1FF] sm:block">View Consumer App</Link>
              <Link href="/experience-builder" className="hidden rounded-xl border border-[#E4DFE9] bg-white px-3 py-2.5 text-[10px] font-semibold text-[#665F6E] transition hover:border-[#C9BCF6] hover:text-[#5E3BEE] md:block">Experience Builder</Link>
              <label className="relative hidden md:block"><Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AAA4B1]" /><input aria-label="Search portal" placeholder="Search anything..." className="h-10 w-52 rounded-xl border border-[#E7E3EB] bg-[#FAF9FB] pl-9 pr-3 text-xs outline-none transition placeholder:text-[#A9A3AF] focus:border-[#B7A8F5] focus:bg-white" /></label>
              <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#E7E3EB] bg-white text-[#6F6879]"><Icon name="bell" className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#5E3BEE] ring-2 ring-white" /></button>
              <div className="flex items-center gap-2 rounded-xl border border-[#E7E3EB] bg-white p-1.5 pr-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#5E3BEE] to-[#A17DF7] text-[9px] font-bold text-white">OH</span><div className="hidden sm:block"><p className="text-[10px] font-semibold">Olivia Hart</p><p className="text-[8px] text-[#9A94A2]">Admin</p></div></div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-[#F0EDF3] px-4 py-2 lg:hidden">
            {navItems.map((item, i) => <a key={item.label} href={item.href} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-semibold ${i === 0 ? "bg-[#F0ECFF] text-[#5E3BEE]" : "text-[#77717F]"}`}><Icon name={item.icon} className="h-3.5 w-3.5" />{item.label}</a>)}
          </nav>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <section id="dashboard" className="scroll-mt-32">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-sm text-[#827C8A]">Sunday, 5 July 2026</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.045em] sm:text-[34px]">Good morning, Olivia.</h1><p className="mt-2 text-sm text-[#8C8693]">Here&apos;s how your partnership network is performing.</p></div>
              <div className="flex gap-2"><button onClick={() => notify("Date range updated to the last 30 days")} className="flex items-center gap-2 rounded-xl border border-[#E4DFE9] bg-white px-4 py-3 text-xs font-semibold text-[#655E6E]"><Icon name="calendar" className="h-4 w-4" />Last 30 days</button><button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 rounded-xl bg-[#5E3BEE] px-4 py-3 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(94,59,238,.2)] transition hover:-translate-y-0.5"><Icon name="plus" className="h-4 w-4" />Create Campaign</button></div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {metrics.map((metric) => <article key={metric.label} className="group rounded-2xl border border-[#EAE6EE] bg-white p-4 shadow-[0_4px_18px_rgba(37,28,60,.025)] transition hover:-translate-y-1 hover:border-[#D8CEF8] hover:shadow-[0_14px_35px_rgba(55,37,100,.07)]">
                <div className="flex items-start justify-between"><span className={`portal-icon ${metric.tone}`}><Icon name={metric.icon} className="h-[17px] w-[17px]" /></span><span className="rounded-full bg-[#EAF9F2] px-2 py-1 text-[9px] font-bold text-[#149566]">{metric.change}</span></div>
                <p className="mt-5 text-[10px] font-medium text-[#8A8491]">{metric.label}</p><p className="mt-1.5 text-xl font-bold tracking-[-.025em]"><MetricValue label={metric.label} /></p><p className="mt-1 text-[9px] text-[#AAA4AF]">{metric.detail}</p>
              </article>)}
            </div>
          </section>

          <section id="analytics" className="scroll-mt-32 pt-8">
            <div className="grid gap-4 xl:grid-cols-[1.55fr_.7fr]">
              <article className="rounded-[22px] border border-[#E9E5ED] bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">Partnership revenue</p><p className="mt-1 text-[10px] text-[#9993A0]">Revenue generated across your partner network</p></div><div className="flex gap-4 text-[9px] text-[#8F8997]"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#5E3BEE]" />This period</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#D9D0FA]" />Previous period</span></div></div>
                <div className="mt-5 flex items-end gap-2"><strong className="text-2xl tracking-[-.03em]">AED 1,284,560</strong><span className="mb-1 rounded-full bg-[#EAF9F2] px-2 py-1 text-[9px] font-bold text-[#159668]">↗ 18.4%</span></div>
                <div className="relative mt-7 h-56">
                  <div className="absolute inset-0 flex flex-col justify-between text-[8px] text-[#A8A2AD]">{["400k","300k","200k","100k","0"].map(n => <div key={n} className="flex items-center gap-3"><span className="w-7">{n}</span><i className="h-px flex-1 bg-[#F0EDF3]" /></div>)}</div>
                  <svg viewBox="0 0 700 210" className="absolute inset-y-0 left-10 h-full w-[calc(100%-2.5rem)]" preserveAspectRatio="none">
                    <defs><linearGradient id="portalRevenue" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6643ED" stopOpacity=".22" /><stop offset="1" stopColor="#6643ED" stopOpacity="0" /></linearGradient></defs>
                    <path d="M0 178 C55 165 72 135 120 148 S196 168 240 115 S320 138 360 88 S445 102 485 61 S570 76 615 35 S675 38 700 18 V210 H0Z" fill="url(#portalRevenue)" />
                    <path d="M0 178 C55 165 72 135 120 148 S196 168 240 115 S320 138 360 88 S445 102 485 61 S570 76 615 35 S675 38 700 18" fill="none" stroke="#5E3BEE" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M0 190 C65 180 75 158 125 168 S195 180 245 148 S320 155 368 123 S445 135 490 105 S570 120 620 82 S675 92 700 67" fill="none" stroke="#D5CCF7" strokeWidth="2.5" strokeDasharray="6 7" strokeLinecap="round" />
                    <circle cx="615" cy="35" r="5" fill="white" stroke="#5E3BEE" strokeWidth="3" />
                  </svg>
                  <div className="absolute bottom-[-20px] left-10 right-0 flex justify-between text-[8px] text-[#AAA4B0]">{["Jan","Feb","Mar","Apr","May","Jun","Jul"].map(m => <span key={m}>{m}</span>)}</div>
                </div>
              </article>
              <article className="rounded-[22px] border border-[#E9E5ED] bg-white p-5 sm:p-6">
                <p className="text-sm font-semibold">Revenue by category</p><p className="mt-1 text-[10px] text-[#9993A0]">Top contributing partner segments</p>
                <div className="relative mx-auto mt-7 grid h-40 w-40 place-items-center rounded-full" style={{background:"conic-gradient(#5E3BEE 0 32%,#D6A84F 32% 55%,#4AAE90 55% 73%,#7295E8 73% 88%,#E695B5 88% 100%)"}}><div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center"><div><p className="text-[9px] text-[#9B95A2]">Total</p><p className="text-lg font-bold">AED 1.28M</p></div></div></div>
                <div className="mt-7 space-y-3">{[["Hospitality","32%","#5E3BEE"],["Dining","23%","#D6A84F"],["Wellness","18%","#4AAE90"],["Mobility","15%","#7295E8"],["Lifestyle","12%","#E695B5"]].map(([name,value,color]) => <div key={name} className="flex items-center text-[10px]"><i className="mr-2 h-2 w-2 rounded-full" style={{background:color}} /><span className="text-[#77717E]">{name}</span><span className="ml-auto font-semibold">{value}</span></div>)}</div>
              </article>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Customer Growth","+21.4%","8,640 customers",[34,42,39,55,62,71,82]],
                ["Referral Network","2,841","426 this week",[45,58,50,68,64,79,88]],
                ["Business Performance","91.2","Network score",[62,68,73,70,82,86,91]],
                ["Campaign ROI","3.8×","+0.7× this quarter",[38,45,52,49,67,76,89]],
              ].map(([title,value,detail,bars]) => <article key={title as string} className="rounded-[20px] border border-[#E9E5ED] bg-white p-4 transition hover:-translate-y-1 hover:border-[#D7CCF8] hover:shadow-[0_12px_30px_rgba(52,35,95,.06)]"><div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold text-[#77717E]">{title as string}</p><p className="mt-2 text-lg font-bold">{value as string}</p><p className="mt-1 text-[7px] text-[#159166]">{detail as string}</p></div><span className="rounded-lg bg-[#F0ECFF] p-2 text-[#5E3BEE]"><Icon name="analytics" className="h-4 w-4" /></span></div><div className="mt-5 flex h-12 items-end gap-1.5">{(bars as number[]).map((height,i) => <i key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#6542E7] to-[#B5A1F5] chart-bar" style={{height:`${height}%`,animationDelay:`${i*70}ms`}} />)}</div></article>)}
            </div>
          </section>

          <section id="partners" className="scroll-mt-32 pt-12">
            <SectionTitle eyebrow="Your network" title="Partner businesses" detail="Trusted businesses growing alongside your brand." action="View all partners" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {partners.map((partner) => <article key={partner.name} className="group rounded-[20px] border border-[#E9E5ED] bg-white p-4 transition hover:-translate-y-1 hover:border-[#D6CBF8] hover:shadow-[0_16px_40px_rgba(55,38,100,.07)]">
                <div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-[13px] bg-gradient-to-br ${partner.color} text-xs font-bold text-white shadow-sm`}>{partner.initials}</div><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${partner.status === "Active" ? "bg-[#EAF9F2] text-[#168F65]" : "bg-[#FFF5E2] text-[#A9771F]"}`}>● {partner.status}</span></div>
                <h3 className="mt-4 text-[13px] font-semibold">{partner.name}</h3><p className="mt-1 text-[9px] text-[#938D9A]">{partner.category}</p>
                <p className="mt-3 flex items-center gap-1 text-[9px] text-[#8F8996]"><Icon name="location" className="h-3 w-3 text-[#B0AAB5]" />{partner.location}</p>
                <div className="mt-4 grid grid-cols-2 border-t border-[#F0EDF3] pt-3"><div><p className="text-[8px] text-[#AAA4AF]">Referrals</p><p className="mt-1 text-xs font-bold">{partner.referrals}</p></div><div className="border-l border-[#F0EDF3] pl-3"><p className="text-[8px] text-[#AAA4AF]">Performance</p><div className="mt-1 flex items-center gap-2"><p className="text-xs font-bold">{partner.performance}%</p><div className="h-1 flex-1 overflow-hidden rounded-full bg-[#EEEAF4]"><div className="h-full rounded-full bg-[#5E3BEE]" style={{width:`${partner.performance}%`}} /></div></div></div></div>
              </article>)}
            </div>
            <div className="mt-10 rounded-[24px] border border-[#E7E2EC] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#7358DD]">Partner Discovery</p><h3 className="mt-1.5 text-xl font-semibold tracking-[-.03em]">Find your next growth partner</h3><p className="mt-1 text-[10px] text-[#918A98]">Ranked by commercial fit, audience overlap and referral potential.</p></div><label className="relative block w-full lg:w-72"><Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A19AA7]" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partner marketplace..." className="h-11 w-full rounded-xl border border-[#E5E0E9] bg-[#FAF9FB] pl-10 pr-3 text-[10px] outline-none focus:border-[#BDAEF5]" /></label></div>
              <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">{["All","Hotels","Restaurants","Luxury Retail","Car Rental","Real Estate","Fitness","Spa","Medical","Events"].map(item => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-[8px] font-semibold transition ${category === item ? "bg-[#5E3BEE] text-white" : "border border-[#E8E3EC] text-[#756E7D] hover:border-[#CDBFF7]"}`}>{item}</button>)}</div>
              {visibleDiscovery.length ? <div className="mt-5 grid gap-3 lg:grid-cols-3">{visibleDiscovery.map((partner,i) => <article key={partner.name} className="rounded-2xl border border-[#EAE6EE] p-4 transition hover:-translate-y-1 hover:border-[#D4C8F8] hover:shadow-[0_12px_30px_rgba(52,35,95,.07)]"><div className="flex items-start gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl text-[9px] font-bold text-white ${["bg-[#5E3BEE]","bg-[#B98B38]","bg-[#468E83]"][i%3]}`}>{partner.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-1"><h4 className="truncate text-[11px] font-semibold">{partner.name}</h4><span title="Verified Partner" className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-[#5E3BEE] text-[7px] text-white">✓</span></div><p className="mt-1 text-[8px] text-[#96909D]">{partner.category} · {partner.location}</p></div><span className="rounded-full bg-[#EAF9F2] px-2 py-1 text-[8px] font-bold text-[#158F66]">{partner.score}% fit</span></div><div className="mt-4 grid grid-cols-2 border-y border-[#F0EDF3] py-3"><div><p className="text-[7px] text-[#A19BA6]">Revenue potential</p><p className="mt-1 text-[10px] font-bold">{partner.potential}<span className="font-normal text-[#9A94A0]">/mo</span></p></div><div className="border-l border-[#F0EDF3] pl-3"><p className="text-[7px] text-[#A19BA6]">Monthly referrals</p><p className="mt-1 text-[10px] font-bold">{partner.referrals}</p></div></div><button onClick={() => { setInvited(items => [...items, partner.name]); notify(`Invitation sent to ${partner.name}`); }} disabled={invited.includes(partner.name)} className={`mt-3 w-full rounded-xl py-2.5 text-[9px] font-semibold transition ${invited.includes(partner.name) ? "bg-[#EAF9F2] text-[#158F66]" : "bg-[#F0ECFF] text-[#5E3BEE] hover:bg-[#5E3BEE] hover:text-white"}`}>{invited.includes(partner.name) ? "✓ Invitation sent" : "Invite to partner"}</button></article>)}</div> : <div className="py-12 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#F1EDFF] text-[#5E3BEE]"><Icon name="search" /></span><p className="mt-3 text-xs font-semibold">No matching partners</p><p className="mt-1 text-[9px] text-[#99939F]">Try another category or search term.</p><button onClick={() => {setSearch("");setCategory("All");}} className="mt-3 text-[9px] font-semibold text-[#5E3BEE]">Clear filters</button></div>}
            </div>
          </section>

          <section id="campaigns" className="scroll-mt-32 pt-12">
            <SectionTitle eyebrow="Joint growth" title="Campaign performance" detail="Live and scheduled campaigns across your partner network." action="Create Campaign" onAction={() => setCreateOpen(true)} />
            <div className="overflow-hidden rounded-[22px] border border-[#E8E4EC] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b border-[#EEEAF2] bg-[#FAF9FB] text-[9px] font-bold uppercase tracking-[.08em] text-[#9A94A0]"><tr><th className="px-5 py-4">Campaign</th><th className="px-5 py-4">Partners</th><th className="px-5 py-4">Revenue generated</th><th className="px-5 py-4">Customers reached</th><th className="px-5 py-4">Conversion</th><th className="px-5 py-4">Status</th></tr></thead>
                  <tbody className="divide-y divide-[#F0EDF3]">{campaignList.map((campaign) => <tr key={campaign.name} onClick={() => setSelectedCampaign(campaign)} className="cursor-pointer transition hover:bg-[#F8F5FF]"><td className="px-5 py-4 text-xs font-semibold">{campaign.name}<span className="ml-2 text-[8px] font-normal text-[#8A73E5]">View →</span></td><td className="px-5 py-4"><div className="flex -space-x-2">{campaign.businesses.map((b,i) => <span key={b} className={`grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[7px] font-bold text-white ${i ? "bg-[#C0994F]" : "bg-[#6342E7]"}`}>{b}</span>)}</div></td><td className="px-5 py-4 text-xs font-semibold">{campaign.revenue}</td><td className="px-5 py-4 text-xs text-[#726B7B]">{campaign.reach}</td><td className="px-5 py-4"><span className="rounded-full bg-[#EAF9F2] px-2 py-1 text-[9px] font-bold text-[#159166]">{campaign.conversion}</span></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1.5 text-[9px] font-bold ${campaign.status === "Live" ? "bg-[#EEE9FF] text-[#5E3BEE]" : "bg-[#FFF4DE] text-[#A7751C]"}`}>● {campaign.status}</span></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="referrals" className="scroll-mt-32 pt-12">
            <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
              <div><SectionTitle eyebrow="Live network" title="Recent referrals" detail="Customer opportunities moving between your partners." />
                <div className="overflow-hidden rounded-[22px] border border-[#E8E4EC] bg-white divide-y divide-[#F0EDF3]">
                  {referrals.map((referral) => <div key={`${referral.from}-${referral.time}`} className="flex items-center gap-3 p-4 transition hover:bg-[#FCFBFE]">
                    <div className="flex shrink-0 -space-x-2">{referral.initials.map((b,i) => <span key={b} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[8px] font-bold text-white ${i ? "bg-[#C19A50]" : "bg-[#6040DD]"}`}>{b}</span>)}</div>
                    <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold">{referral.from} <span className="mx-1 text-[#AAA4AF]">→</span> {referral.to}</p><p className="mt-1 text-[9px] text-[#97919D]">{referral.customer} · {referral.time}</p></div><p className="shrink-0 text-xs font-bold text-[#179268]">+{referral.value}</p>
                  </div>)}
                </div>
              </div>
              <div className="pt-[82px]">
                <article className="h-full min-h-[330px] rounded-[22px] bg-gradient-to-br from-[#201642] via-[#2A1B5B] to-[#5331C7] p-6 text-white">
                  <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#BDAFFF]">Referral momentum</p><h3 className="mt-2 text-xl font-semibold">Your network is accelerating.</h3></div><Icon name="spark" className="h-7 w-7 text-[#E5C676]" /></div>
                  <p className="mt-3 max-w-sm text-xs leading-5 text-white/55">Partner-to-partner referrals are up 24.7% this month, led by hospitality and dining.</p>
                  <div className="mt-8 flex h-28 items-end gap-2">{[38,55,43,68,59,82,74,92,86,100,93,116].map((h,i) => <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-[#7353EB] to-[#B9A5FF] transition hover:to-[#F0CB78]" style={{height:`${h}px`,opacity:.55+i*.035}} />)}</div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5"><div><p className="text-[9px] text-white/40">Successful referrals</p><p className="mt-1 text-lg font-bold">2,416</p></div><div className="text-right"><p className="text-[9px] text-white/40">Acceptance rate</p><p className="mt-1 text-lg font-bold">85.0%</p></div></div>
                </article>
              </div>
            </div>
          </section>

          <section id="rewards" className="scroll-mt-32 pt-12">
            <SectionTitle eyebrow="Coming to the ecosystem" title="Rewards & membership benefits" detail="Recognize the customers and partners who create the most value." action="View rewards roadmap" onAction={() => notify("Rewards roadmap opened")} />
            <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
              <article className="relative overflow-hidden rounded-[24px] border border-[#E4D9B8] bg-gradient-to-br from-[#FFFCF4] to-[#F8F2E3] p-6 sm:p-8">
                <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E7C46D]/20 blur-2xl" />
                <div className="relative"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#241A3F] text-[#E6C46C]"><Icon name="rewards" /></span><span className="rounded-full border border-[#DDCAA0] bg-white/70 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wider text-[#8C6A21]">Preview</span></div><h3 className="mt-7 text-2xl font-semibold tracking-[-.035em]">NEFE Signature Membership</h3><p className="mt-3 max-w-xl text-sm leading-6 text-[#776D58]">One premium membership connecting preferred customers with thoughtful benefits across the entire NEFE business network.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">{[["Priority access","Preferred booking windows"],["Connected benefits","Privileges across partners"],["Member recognition","One profile, everywhere"]].map(([a,b]) => <div key={a} className="rounded-xl border border-[#E7DCC3] bg-white/60 p-3"><p className="text-[10px] font-semibold">{a}</p><p className="mt-1 text-[9px] leading-4 text-[#8D826B]">{b}</p></div>)}</div></div>
              </article>
              <article className="rounded-[24px] border border-[#E8E3ED] bg-white p-6">
                <p className="text-sm font-semibold">Your future benefit tiers</p><p className="mt-1 text-[10px] text-[#99939F]">Based on annual network engagement</p>
                <div className="mt-6 space-y-3">{[["Gold","Member offers + priority access","bg-[#FFF4D9] text-[#936B1D]"],["Platinum","Upgrades + concierge benefits","bg-[#EEEAF4] text-[#655D6B]"],["Diamond","Bespoke network experiences","bg-[#EEE9FF] text-[#5E3BEE]"]].map(([tier,desc,tone],i) => <div key={tier} className="flex items-center gap-3 rounded-xl border border-[#EFECEF] p-3"><span className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-bold ${tone}`}>{i+1}</span><div><p className="text-[11px] font-semibold">{tier}</p><p className="mt-0.5 text-[9px] text-[#99939F]">{desc}</p></div>{i === 0 && <span className="ml-auto rounded-full bg-[#E9F8F1] px-2 py-1 text-[8px] font-bold text-[#168F65]">Current</span>}</div>)}</div>
              </article>
            </div>
          </section>

          <section id="settings" className="scroll-mt-32 py-12">
            <div className="flex flex-col gap-5 rounded-[22px] border border-[#E9E5ED] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8B73E8]">Workspace settings</p><h2 className="mt-1.5 text-lg font-semibold">Celeste Hospitality Group</h2><p className="mt-1 text-xs text-[#938D99]">Manage your profile, team access, notifications, and partnership preferences.</p></div>
              <button onClick={() => notify("Workspace settings opened")} className="w-fit rounded-xl border border-[#E4DFE9] px-4 py-2.5 text-xs font-semibold text-[#5F5869] transition hover:border-[#CDBFF9] hover:text-[#5E3BEE]">Open settings</button>
            </div>
          </section>
        </div>
      </div>
      <PrototypeAssistant />
      {createOpen && <CreateCampaignModal onClose={() => setCreateOpen(false)} onGenerated={campaign => { setCampaignList(items => [campaign, ...items]); setCreateOpen(false); notify("Coast to Calm added to campaigns"); }} />}
      {selectedCampaign && <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} onToast={notify} />}
      {toast && <div className="prototype-toast fixed bottom-6 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/60 bg-[#211A32]/95 px-4 py-3 text-[10px] font-semibold text-white shadow-2xl backdrop-blur"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#31A477] text-[10px]">✓</span>{toast}</div>}
    </main>
  );
}
