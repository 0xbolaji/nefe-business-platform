"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { merchants, type Merchant } from "../merchants/merchant-data";

type Position = { x: number; y: number };
type RevenueInputs = { businesses: number; visitors: number; conversion: number; participation: number; spend: number; retention: number };

const categories = ["All","Hotels","Car Rentals","Restaurants","Luxury Dining","Beach Clubs","Events","Retail","Healthcare","Real Estate","Luxury Experiences","CEO Network"];
const defaultNames = ["One&Only One Za'abeel","F10 Car Rental","RAK Resort Development","RAK Hotel Partner"];
const recommendations = [
  "High-value luxury cluster detected.",
  "Restaurant partnerships would increase referrals by 21%.",
  "Adding premium transport could increase customer value by AED 340.",
  "Healthcare partnerships would diversify the ecosystem.",
  "Luxury retail is currently underrepresented.",
];
const slideCount = 7;
const simulationStages = ["Executive alignment","Merchant onboarding","Bundle creation","Customer launch","Campaign testing","Performance review","Expansion decision"];

function initials(name: string) {
  return name.split(/[\s&-]+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function AnimatedValue({ value }: { value: string | number }) {
  return <AnimatePresence mode="popLayout"><motion.span key={value} initial={{ opacity: 0, y: 8, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -7 }} transition={{ duration: .28 }}>{value}</motion.span></AnimatePresence>;
}

function downloadHtml(filename: string, title: string, sections: { label: string; value: string }[]) {
  const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
  const rows = sections.map(section => `<section><small>${escape(section.label)}</small><p>${escape(section.value)}</p></section>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(title)}</title><style>body{margin:0;background:#f6f4f8;color:#1b1725;font:15px/1.6 Inter,Arial,sans-serif}.page{max-width:850px;margin:40px auto;background:white;border:1px solid #e5dfea;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px #281d3d1a}.hero{padding:42px;background:linear-gradient(135deg,#1b1228,#5e3bee);color:white}.hero b{color:#dfbd67;font-size:12px;letter-spacing:.15em}.hero h1{margin:12px 0 6px;font-size:36px}.hero p{margin:0;color:#ffffff99}.content{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:30px}.content section{padding:18px;border-radius:14px;background:#f8f6fa;border:1px solid #ebe6ee}.content small{color:#7560bd;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.content p{margin:8px 0 0;font-weight:600}.footer{padding:0 30px 30px;color:#8f8895;font-size:12px}@media(max-width:640px){.page{margin:0;border-radius:0}.content{grid-template-columns:1fr}}</style></head><body><main class="page"><header class="hero"><b>NEFE OPPORTUNITY ENGINE</b><h1>${escape(title)}</h1><p>Executive prototype report generated from sample commercial intelligence.</p></header><div class="content">${rows}</div><footer class="footer">NEFE · Connected businesses create connected growth.</footer></main></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function OpportunityEngine() {
  const [selectedNames, setSelectedNames] = useState(defaultNames);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [hoveredConnection, setHoveredConnection] = useState<{ a: Merchant; b: Merchant; strength: number } | null>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [presenting, setPresenting] = useState(false);
  const [slide, setSlide] = useState(0);
  const [executiveModal, setExecutiveModal] = useState<"report" | "pilot" | null>(null);
  const [simulationState, setSimulationState] = useState<"idle" | "running" | "complete">("idle");
  const [simulationStage, setSimulationStage] = useState(0);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [pilotSummaryVisible, setPilotSummaryVisible] = useState(false);
  const [inputs, setInputs] = useState<RevenueInputs>({ businesses: 12, visitors: 8400, conversion: 24, participation: 38, spend: 620, retention: 31 });
  const graphRef = useRef<HTMLDivElement>(null);
  const simulationTimerRef = useRef<number | null>(null);

  const selected = useMemo(() => merchants.filter(merchant => selectedNames.includes(merchant.name)), [selectedNames]);
  const filtered = useMemo(() => merchants.filter(merchant => (category === "All" || category === "CEO Network" ? category !== "CEO Network" || merchant.ceo : merchant.category === category) && merchant.name.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const avgFit = selected.length ? selected.reduce((sum, merchant) => sum + merchant.fit, 0) / selected.length : 0;
  const categoryCount = new Set(selected.map(merchant => merchant.category)).size;
  const cityCount = new Set(selected.map(merchant => merchant.city)).size;
  const referralTotal = selected.reduce((sum, merchant) => sum + merchant.referrals, 0);
  const valueTotal = selected.reduce((sum, merchant) => sum + merchant.value, 0);
  const commercialScore = Math.min(99, Math.round(avgFit * .58 + Math.min(selected.length, 8) * 3 + categoryCount * 2));
  const networkStrength = Math.min(98, Math.round(avgFit * .62 + selected.length * 5));
  const compatibility = Math.min(99, Math.round(avgFit + categoryCount * 1.4 - Math.max(0, selected.length - 6)));
  const retentionScore = Math.min(94, Math.round(48 + categoryCount * 6 + (selected.some(x => x.category === "Hotels") ? 7 : 0)));
  const bundleReadiness = Math.min(100, Math.round(selected.length * 11 + categoryCount * 9 + avgFit * .24));
  const avgCustomerValue = selected.length ? Math.round(valueTotal / Math.max(referralTotal, 1)) : 0;
  const ceoPilot = ["RAK Resort Development","F10 Car Rental","RAK Hotel Partner"].every(name => selectedNames.includes(name));

  const graphPositions = useMemo(() => {
    const output: Record<string, Position> = {};
    selected.forEach((merchant, index) => {
      const angle = (index / Math.max(selected.length, 1)) * Math.PI * 2 - Math.PI / 2;
      output[merchant.name] = positions[merchant.name] ?? { x: 50 + Math.cos(angle) * 34, y: 50 + Math.sin(angle) * 33 };
    });
    return output;
  }, [positions, selected]);

  const connections = useMemo(() => selected.flatMap((a, index) => selected.slice(index + 1).map(b => ({
    a, b, strength: Math.min(98, Math.round((a.fit + b.fit) / 2 + (a.city === b.city ? 4 : -2))),
  }))), [selected]);

  const revenue = useMemo(() => {
    const referred = inputs.visitors * (inputs.participation / 100) * (inputs.conversion / 100);
    const monthly = referred * inputs.spend * (1 + inputs.retention / 180) * Math.max(1, inputs.businesses / 8);
    return {
      monthly: Math.round(monthly),
      annual: Math.round(monthly * 12),
      merchant: Math.round(monthly * .78),
      platform: Math.round(monthly * .08),
      commissions: Math.round(monthly * .14),
      repeat: Math.round(referred * inputs.retention / 100),
    };
  }, [inputs]);

  useEffect(() => {
    document.body.classList.toggle("opportunity-presentation", presenting);
    document.body.style.overflow = presenting ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (!presenting) return;
      if (event.key === "Escape") {
        setExecutiveModal(null);
        setPresenting(false);
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") setSlide(current => Math.min(slideCount - 1, current + 1));
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") setSlide(current => Math.max(0, current - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("opportunity-presentation");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (simulationTimerRef.current !== null) window.clearInterval(simulationTimerRef.current);
    };
  }, [presenting]);

  const notify = (message: string) => {
    if (message === "Executive commercial report prepared") {
      setExecutiveModal("report");
      return;
    }
    if (message === "Pilot simulation launched") {
      setSimulationState("idle");
      setSimulationStage(0);
      setSimulationProgress(0);
      setPilotSummaryVisible(false);
      setExecutiveModal("pilot");
      return;
    }
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const closeExecutiveModal = () => {
    if (simulationTimerRef.current !== null) {
      window.clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setExecutiveModal(null);
    setSimulationState("idle");
    setSimulationStage(0);
    setSimulationProgress(0);
    setPilotSummaryVisible(false);
  };
  const startSimulation = () => {
    if (simulationTimerRef.current !== null) window.clearInterval(simulationTimerRef.current);
    setSimulationState("running");
    setSimulationStage(0);
    setSimulationProgress(0);
    setPilotSummaryVisible(false);
    simulationTimerRef.current = window.setInterval(() => {
      setSimulationStage(current => {
        const next = current + 1;
        setSimulationProgress(Math.round((next / simulationStages.length) * 100));
        if (next >= simulationStages.length) {
          if (simulationTimerRef.current !== null) window.clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
          setSimulationState("complete");
          setToast("Pilot simulation complete. Ready for executive review.");
          window.setTimeout(() => setToast(""), 2800);
          return simulationStages.length;
        }
        return next;
      });
    }, 620);
  };
  const downloadExecutiveReport = () => {
    downloadHtml("nefe-executive-commercial-report.html", "Executive Commercial Report", [
      { label: "Selected businesses", value: selected.map(merchant => merchant.name).join(", ") || "No businesses selected" },
      { label: "Commercial score", value: `${commercialScore}/100` },
      { label: "Network strength", value: `${networkStrength}%` },
      { label: "Projected monthly value", value: `AED ${valueTotal.toLocaleString()}` },
      { label: "Bundle readiness", value: `${bundleReadiness}%` },
      { label: "Recommended next step", value: "Approve a 90-day commercial pilot with executive sponsorship, shared campaign ownership and weekly KPI review." },
      { label: "Pilot recommendation", value: ceoPilot ? "Launch the Ras Al Khaimah CEO Network cluster as the first controlled regional pilot." : "Begin with the highest-fit hospitality, mobility and experience partners in one city." },
    ]);
    setToast("Report preview downloaded.");
    window.setTimeout(() => setToast(""), 2400);
  };
  const downloadSimulationReport = () => {
    downloadHtml("nefe-90-day-pilot-simulation.html", "90-Day Pilot Simulation", [
      { label: "Pilot cluster", value: ceoPilot ? "RAK Resort Development, F10 Car Rental and RAK Hotel Partner" : "Premium UAE Commercial Cluster" },
      { label: "Launch sequence", value: simulationStages.join(" → ") },
      { label: "Simulation status", value: "Pilot simulation complete. Ready for executive review." },
      { label: "Expected KPIs", value: "AED 2.86M revenue, 2,840 referrals, 27% conversion and 34% repeat customer rate" },
      { label: "Recommended pilot owner", value: "NEFE Commercial Director, supported by merchant GMs and partner experience leads" },
      { label: "Recommended next step", value: "Executive approval followed by commercial alignment and Week 1 pilot activation." },
    ]);
    setToast("Simulation report downloaded.");
    window.setTimeout(() => setToast(""), 2400);
  };
  const toggleMerchant = (merchant: Merchant) => setSelectedNames(current => current.includes(merchant.name) ? current.filter(name => name !== merchant.name) : [...current, merchant.name]);
  const enterPresentation = () => {
    setSlide(0);
    setPresenting(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const exitPresentation = () => setPresenting(false);
  const previousSlide = () => setSlide(current => Math.max(0, current - 1));
  const nextSlide = () => setSlide(current => Math.min(slideCount - 1, current + 1));
  const slideProps = (index: number) => ({ "data-engine-slide": "true", "data-present-active": presenting ? String(slide === index) : "true" });

  const journey = [
    { name: selected.find(x => x.category === "Hotels")?.name ?? "Premium Hotel", service: "Hotel arrival", spend: 1450, time: "18 hrs" },
    { name: selected.find(x => x.category.includes("Dining") || x.category === "Restaurants")?.name ?? "Luxury Breakfast", service: "Curated dining", spend: 280, time: "90 min" },
    { name: selected.find(x => x.category === "Car Rentals")?.name ?? "Premium Mobility", service: "Car rental", spend: 540, time: "6 hrs" },
    { name: selected.find(x => x.category === "Beach Clubs")?.name ?? "Beach Club", service: "Lifestyle access", spend: 390, time: "4 hrs" },
    { name: selected.find(x => x.category === "Spas")?.name ?? "Spa Partner", service: "Wellness ritual", spend: 460, time: "2 hrs" },
    { name: "NEFE Mobility Partner", service: "Airport transfer", spend: 220, time: "45 min" },
  ];

  return <main className={`opportunity-engine contrast-audit-page min-h-screen bg-[#F5F3F7] text-[#1B1725] ${presenting ? "is-presenting" : ""}`}>
    {presenting&&<div className="fixed inset-x-0 top-0 z-[200] flex items-center justify-between gap-3 bg-[#171120]/94 px-4 py-3 text-white backdrop-blur-xl sm:px-6"><span className="hidden text-[8px] font-bold uppercase tracking-[.16em] text-[#C8B5FF] sm:block">NEFE Opportunity Engine · Investor Mode</span><span className="text-[9px] font-bold text-white sm:ml-auto">{slide+1} / {slideCount}</span><span className="hidden text-[7px] text-white/40 md:block">Use ← → to navigate · ESC to exit</span><button type="button" onClick={exitPresentation} className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-[8px] font-semibold transition hover:bg-white/15">Exit Presentation</button></div>}

    <section {...slideProps(0)} className="engine-slide">
      <div className="engine-hero relative overflow-hidden border-b border-[#E3DDE8] px-4 py-12 sm:px-7 lg:px-9">
        <div className="engine-grid absolute inset-0"/><div className="relative mx-auto max-w-[1540px]"><div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"><div><span className="inline-flex items-center gap-2 rounded-full border border-[#DCD1F8] bg-white/70 px-3 py-2 text-[8px] font-bold uppercase tracking-[.15em] text-[#5E3BEE] backdrop-blur"><i className="h-2 w-2 animate-pulse rounded-full bg-[#C6983E]"/>Live commercial intelligence</span><h1 className="mt-5 text-4xl font-semibold tracking-[-.055em] sm:text-6xl">NEFE Opportunity Engine</h1><p className="mt-4 max-w-2xl text-[12px] leading-6 text-[#746D7A]">Build a connected business ecosystem and understand its commercial impact before launching the first partnership.</p><Link href="/commercial-ecosystems" className="mt-4 inline-flex rounded-xl border border-[#D9C58F] bg-[#FFF7E5]/80 px-4 py-3 text-[8px] font-bold text-[#8E681E] transition hover:-translate-y-0.5">View curated ecosystem logic →</Link></div><div className="flex flex-wrap gap-2"><Link href="/business-model" className="rounded-xl border border-[#D9C58F] bg-[#FFF7E5] px-4 py-3 text-[8px] font-semibold text-[#8E681E]">Financial Intelligence</Link><Link href="/uae-opportunity-map" className="rounded-xl border border-[#DED8E4] bg-white px-4 py-3 text-[8px] font-semibold">← Opportunity Map</Link><button type="button" onClick={enterPresentation} className="relative z-10 touch-manipulation rounded-xl bg-[#21172F] px-5 py-3 text-[8px] font-semibold text-white shadow-xl">Present to Investors ↗</button></div></div></div>
      </div>
      <div className="mx-auto grid max-w-[1540px] gap-5 px-4 py-8 sm:px-7 lg:grid-cols-[1fr_390px] lg:px-9">
        <section className="engine-card p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="engine-eyebrow">Opportunity builder</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">Build the commercial ecosystem</h2></div><label className="engine-search"><span>⌕</span><input aria-label="Search businesses" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search businesses"/></label></div><div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">{categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-[7px] font-bold ${category===item?"bg-[#5E3BEE] text-white":"border border-[#E2DDE6] bg-white text-[#706978]"}`}>{item}</button>)}</div><div className="mt-5 grid max-h-[420px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(merchant=>{const active=selectedNames.includes(merchant.name);return <motion.button layout key={merchant.name} onClick={()=>toggleMerchant(merchant)} whileHover={{y:-2}} className={`relative rounded-[16px] border p-4 text-left transition ${active?"border-[#8D73E4] bg-[#F2EEFF] shadow-[0_10px_28px_rgba(69,43,140,.09)]":"border-[#E8E3EB] bg-white hover:border-[#CFC3F3]"}`}><div className="flex items-start gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[7px] font-bold ${merchant.ceo?"bg-gradient-to-br from-[#C99A3E] to-[#6542D9] text-white":"bg-[#F1EDFF] text-[#5E3BEE]"}`}>{initials(merchant.name)}</span><div className="min-w-0"><p className="truncate text-[9px] font-semibold">{merchant.name}</p><p className="mt-1 text-[6px] text-[#99929E]">{merchant.category} · {merchant.location}</p></div><span className={`ml-auto text-[11px] ${active?"text-[#5E3BEE]":"text-[#C8C1CD]"}`}>{active?"✓":"+"}</span></div>{merchant.ceo&&<span className="mt-3 inline-flex rounded-full bg-[#FFF4D9] px-2 py-1 text-[6px] font-bold text-[#916719]">★ CEO Network</span>}</motion.button>})}</div></section>
        <aside className="engine-card h-fit overflow-hidden p-5"><div className="flex items-center justify-between"><div><p className="engine-eyebrow">Selected ecosystem</p><p className="mt-1 text-[9px] text-[#918A96]">{selected.length} businesses connected</p></div><button onClick={()=>setSelectedNames([])} className="text-[7px] font-semibold text-[#9A939F]">Clear</button></div><div className="mt-5 space-y-2"><AnimatePresence>{selected.map((merchant)=><motion.div layout initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:18}} key={merchant.name} className="flex items-center gap-3 rounded-[14px] border border-[#E6E0EA] bg-white p-3"><span className={`grid h-8 w-8 place-items-center rounded-lg text-[6px] font-bold ${merchant.ceo?"bg-[#FFF1C9] text-[#966A17]":"bg-[#F0ECFF] text-[#5E3BEE]"}`}>{initials(merchant.name)}</span><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold">{merchant.name}</p><p className="mt-1 text-[6px] text-[#99929E]">{merchant.fit}% fit</p></div></motion.div>)}</AnimatePresence>{!selected.length&&<div className="rounded-[16px] border border-dashed border-[#DCD5E1] p-8 text-center"><span className="text-xl text-[#B6A9D8]">✦</span><p className="mt-3 text-[8px] font-semibold">Select businesses to begin</p></div>}</div></aside>
      </div>
    </section>

    <section {...slideProps(1)} className="engine-slide mx-auto max-w-[1540px] px-4 py-10 sm:px-7 lg:px-9">
      <div><p className="engine-eyebrow">Live intelligence</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em]">Commercial Opportunity Score</h2></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
        ["Commercial Score",commercialScore,"/100"],["Network Strength",networkStrength,"%"],["Average Customer Value",`AED ${avgCustomerValue.toLocaleString()}`,""],["Partner Compatibility",compatibility,"%"],["Referral Opportunity",referralTotal.toLocaleString(),"/mo"],["Projected Monthly Value",`AED ${(valueTotal/1000).toFixed(0)}K`,""],["Customer Retention",retentionScore,"%"],["Bundle Readiness",bundleReadiness,"%"],
      ].map(([label,value,suffix])=><motion.article layout key={label} className="engine-kpi" whileHover={{y:-4}}><div className="flex items-center justify-end"><i className="text-[7px] font-bold text-[#2D9B73]">LIVE</i></div><p className="mt-4 text-[8px] text-[#8F8895]">{label}</p><p className="mt-2 text-xl font-bold tracking-[-.035em]"><AnimatedValue value={`${value}${suffix}`}/></p><div className="mt-4 h-1 overflow-hidden rounded-full bg-[#EEEAF1]"><motion.i className="block h-full rounded-full bg-gradient-to-r from-[#5E3BEE] to-[#C29B47]" animate={{width:`${Math.min(100,typeof value==="number"?value:70)}%`}}/></div></motion.article>)}</div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><article className="overflow-hidden rounded-[26px] bg-gradient-to-br from-[#181021] via-[#2A1853] to-[#5A34C3] p-6 text-white sm:p-8"><div className="flex items-center justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#C2AEF9]">NEFE AI Commercial Analysis</p><h3 className="mt-2 text-2xl font-semibold">This ecosystem is ready for a premium pilot.</h3></div><span className="engine-ai-orb">✦</span></div><p className="mt-5 max-w-3xl text-[10px] leading-6 text-white/55">{selected.length ? `${selected.length} businesses across ${categoryCount} industries create a ${commercialScore}/100 commercial opportunity. The strongest path combines hospitality, mobility and destination experiences into one measurable customer journey.` : "Select businesses to generate a commercial assessment."}</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{[["Strengths",`${Math.max(0,selected.filter(x=>x.fit>=93).length)} exceptional-fit anchors and ${cityCount} active markets.`],["Weaknesses",categoryCount<4?"Limited industry diversity constrains cross-selling depth.":"The network needs a retention-led membership mechanic."],["Missed opportunity",selected.some(x=>x.category==="Restaurants"||x.category==="Luxury Dining")?"Wellness is the clearest adjacent category.":"Premium dining could raise referral frequency by 21%."],["Highest value bundle",ceoPilot?"RAK Stay + Car Rental + Resort Experience":selected[0]?.bundle??"Select businesses"],["Industries missing",["Restaurants","Healthcare","Retail"].filter(type=>!selected.some(x=>x.category===type)).join(", ")||"Core sectors covered"],["Suggested next partner",merchants.filter(x=>!selectedNames.includes(x.name)).sort((a,b)=>b.fit-a.fit)[0]?.name??"Network complete"],["Rollout sequence","Anchor partner → mobility → experience → rewards activation"],["Risks",selected.length<3?"Insufficient partner density for a resilient pilot.":"Operational alignment and shared offer governance."]].map(([label,text])=><div key={label} className="rounded-[15px] border border-white/10 bg-white/[.055] p-4"><p className="text-[6px] font-bold uppercase text-[#C8B6F4]">{label}</p><p className="mt-2 text-[8px] leading-4 text-white/65">{text}</p></div>)}</div></article><aside className="engine-card p-6"><p className="engine-eyebrow">Expansion opportunities</p><div className="mt-5 space-y-3">{recommendations.slice(0,4).map((item,index)=><motion.div initial={{opacity:0,x:15}} whileInView={{opacity:1,x:0}} transition={{delay:index*.08}} key={item} className="flex gap-3 rounded-[15px] bg-[#F8F6FA] p-4"><span className="text-[#C2963E]">✦</span><div><p className="text-[8px] font-semibold">{item}</p><p className="mt-1 text-[6px] text-[#9B94A0]">NEFE AI · commercial signal</p></div></motion.div>)}</div></aside></div>
    </section>

    <section {...slideProps(2)} className="engine-slide bg-[#120D1A] px-4 py-16 text-white sm:px-7 lg:px-9"><div className="mx-auto max-w-[1540px]"><p className="text-[8px] font-bold uppercase tracking-[.15em] text-[#AE94EF]">Interactive ecosystem graph</p><div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><h2 className="text-3xl font-semibold tracking-[-.045em]">Drag the network. Reshape the opportunity.</h2><p className="text-[8px] text-white/35">Connection thickness represents partnership strength</p></div><div ref={graphRef} className="engine-graph relative mt-7 h-[620px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0B0711]"><div className="commerce-grid absolute inset-0"/><svg className="absolute inset-0 h-full w-full">{connections.map(connection=>{const a=graphPositions[connection.a.name],b=graphPositions[connection.b.name];return <motion.line key={`${connection.a.name}-${connection.b.name}`} x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`} stroke="#8B68F1" strokeOpacity={.25+connection.strength/220} strokeWidth={Math.max(1,connection.strength/24)} initial={{pathLength:0}} animate={{pathLength:1}} onMouseEnter={()=>setHoveredConnection(connection)} onMouseLeave={()=>setHoveredConnection(null)} className="cursor-help"/>})}</svg>{selected.map(merchant=>{const pos=graphPositions[merchant.name];return <motion.button drag dragMomentum={false} dragConstraints={graphRef} onDrag={(_,info)=>{const rect=graphRef.current?.getBoundingClientRect();if(rect)setPositions(current=>({...current,[merchant.name]:{x:Math.max(7,Math.min(93,(info.point.x-rect.left)/rect.width*100)),y:Math.max(9,Math.min(91,(info.point.y-rect.top)/rect.height*100))}}))}} whileHover={{scale:1.07}} whileDrag={{scale:1.1,zIndex:50}} key={merchant.name} className={`engine-graph-node absolute -translate-x-1/2 -translate-y-1/2 ${merchant.ceo?"ceo":""}`} style={{left:`${pos.x}%`,top:`${pos.y}%`}}><span>{initials(merchant.name)}</span><b>{merchant.name}</b><small>{merchant.fit}% partnership fit</small></motion.button>})}{!selected.length&&<div className="absolute inset-0 grid place-items-center text-center"><div><span className="text-3xl text-[#8060DC]">✦</span><p className="mt-4 text-[10px] text-white/45">Select businesses to generate the ecosystem graph</p></div></div>}{hoveredConnection&&<div className="pointer-events-none absolute bottom-5 left-5 z-50 rounded-[18px] border border-white/10 bg-[#21162E]/95 p-4 shadow-2xl backdrop-blur"><p className="text-[8px] font-semibold">{hoveredConnection.a.name} × {hoveredConnection.b.name}</p><div className="mt-3 grid grid-cols-4 gap-5">{[["Referrals",Math.round((hoveredConnection.a.referrals+hoveredConnection.b.referrals)*.34)],["Conversion",`${Math.round(hoveredConnection.strength*.29)}%`],["Avg spend",`AED ${Math.round((hoveredConnection.a.value/hoveredConnection.a.referrals+hoveredConnection.b.value/hoveredConnection.b.referrals)/2)}`],["Monthly value",`AED ${Math.round((hoveredConnection.a.value+hoveredConnection.b.value)*.18/1000)}K`]].map(([label,value])=><div key={label}><b className="text-[9px]">{value}</b><small className="mt-1 block text-[6px] text-white/35">{label}</small></div>)}</div></div>}</div></div></section>

    <section {...slideProps(3)} className="engine-slide mx-auto max-w-[1540px] px-4 py-14 sm:px-7 lg:px-9"><p className="engine-eyebrow">Customer journey simulator</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em]">Follow value through the ecosystem.</h2><div className="mt-7 overflow-x-auto pb-3"><div className="relative flex min-w-[1050px] items-stretch gap-4">{journey.map((stage,index)=><div key={stage.service} className="relative flex flex-1 items-center"><motion.article initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} transition={{delay:index*.1}} className="engine-card min-h-52 w-full p-5"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F0ECFF] text-[8px] font-bold text-[#5E3BEE]">0{index+1}</span><span className="text-[7px] text-[#A29BA7]">{stage.time}</span></div><p className="mt-6 text-[7px] uppercase text-[#9C95A1]">{stage.service}</p><h3 className="mt-1 text-[10px] font-semibold">{stage.name}</h3><p className="mt-5 text-lg font-bold text-[#5E3BEE]">AED {stage.spend}</p><p className="mt-1 text-[6px] text-[#99929E]">Revenue generated</p></motion.article>{index<journey.length-1&&<span className="absolute -right-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-[#5E3BEE] text-[9px] text-white shadow-lg">→</span>}</div>)}</div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Average spend",`AED ${journey.reduce((s,x)=>s+x.spend,0).toLocaleString()}`],["Time spent","32.2 hours"],["Repeat visit probability",`${retentionScore}%`],["Loyalty opportunity","Platinum tier"]].map(([label,value])=><div key={label} className="engine-card p-5"><p className="text-[7px] text-[#99929E]">{label}</p><p className="mt-2 text-lg font-semibold"><AnimatedValue value={value}/></p></div>)}</div></section>

    <section {...slideProps(4)} className="engine-slide bg-white px-4 py-14 sm:px-7 lg:px-9"><div className="mx-auto max-w-[1540px]"><p className="engine-eyebrow">Revenue simulator</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.045em]">Model the commercial outcome.</h2><div className="mt-7 grid gap-5 xl:grid-cols-[.8fr_1.2fr]"><div className="rounded-[26px] border border-[#E3DEE7] bg-[#FAF9FB] p-6">{([["businesses","Businesses onboarded",2,40,1],["visitors","Monthly visitors",1000,40000,500],["conversion","Conversion rate",5,60,1],["participation","Referral participation",5,80,1],["spend","Average spend",150,2500,10],["retention","Customer retention",5,70,1]] as const).map(([key,label,min,max,step])=><label key={key} className="mb-6 block last:mb-0"><span className="flex items-center justify-between text-[8px] font-semibold"><i className="not-italic text-[#746D79]">{label}</i><b className="text-[#5E3BEE]">{key==="spend"?"AED ":""}{inputs[key].toLocaleString()}{key==="conversion"||key==="participation"||key==="retention"?"%":""}</b></span><input className="roi-slider mt-3 w-full" type="range" min={min} max={max} step={step} value={inputs[key]} onChange={event=>setInputs(current=>({...current,[key]:Number(event.target.value)}))}/></label>)}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[["Monthly revenue",revenue.monthly],["Annual revenue",revenue.annual],["Merchant revenue",revenue.merchant],["NEFE platform revenue",revenue.platform],["Partner commissions",revenue.commissions],["Repeat customer growth",revenue.repeat]].map(([label,value],index)=><motion.article layout key={label} className={`rounded-[22px] p-5 ${index===0?"bg-gradient-to-br from-[#5E3BEE] to-[#2E1B62] text-white":"border border-[#E5E0E9] bg-white"}`}><p className={`text-[8px] ${index===0?"text-white/50":"text-[#918A96]"}`}>{label}</p><p className="mt-2 text-xl font-bold tracking-[-.035em]"><AnimatedValue value={String(label).includes("growth")?`+${Number(value).toLocaleString()}`:`AED ${Number(value).toLocaleString()}`}/></p></motion.article>)}</div></div></div></section>

    <section {...slideProps(5)} className="engine-slide mx-auto max-w-[1540px] px-4 py-14 sm:px-7 lg:px-9">{ceoPilot?<motion.article initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} className="overflow-hidden rounded-[30px] border border-[#D8B35B] bg-gradient-to-br from-[#FFF9E8] via-[#FBF4DF] to-[#F2EAFF] p-6 shadow-[0_24px_65px_rgba(115,80,25,.12)] sm:p-9"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><span className="inline-flex rounded-full bg-[#A97B24] px-3 py-2 text-[7px] font-bold uppercase tracking-[.14em] text-white">★ Regional Pilot Cluster detected</span><h2 className="mt-5 text-3xl font-semibold tracking-[-.045em]">Ras Al Khaimah can become NEFE’s first connected regional pilot.</h2><p className="mt-3 max-w-3xl text-[10px] leading-6 text-[#71654F]">Resort development, premium mobility and hospitality create a complete visitor journey with clear commercial ownership and measurable shared revenue.</p></div><div className="rounded-[18px] border border-[#D8B35B]/40 bg-white/55 p-5"><p className="text-[7px] uppercase text-[#9A772F]">90-day commercial value</p><p className="mt-2 text-3xl font-bold text-[#6D4C13]">AED 2.86M</p><p className="mt-1 text-[7px] text-[#9A8355]">Projected pilot impact</p></div></div><div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[["Pilot roadmap","Commercial alignment → onboarding → bundle QA → controlled launch"],["Launch order","RAK Resort → RAK Hotel → F10 Mobility → rewards"],["First campaigns","RAK Weekend Escape · Executive Resort Transfer"],["Merchant onboarding","Executive sponsor, commercial owner, experience lead"],["KPIs","Revenue · referrals · conversion · repeat visits"],["Commercial value","AED 954K projected monthly ecosystem activity"],["Expansion","Dining, beach clubs and luxury experiences"],["Next market","Dubai Marina hospitality and mobility corridor"]].map(([label,value])=><div key={label} className="rounded-[16px] border border-[#DCC991]/50 bg-white/60 p-4"><p className="text-[6px] font-bold uppercase text-[#9B7628]">{label}</p><p className="mt-2 text-[8px] leading-4 text-[#574D3D]">{value}</p></div>)}</div></motion.article>:<div className="rounded-[28px] border border-dashed border-[#D8C58F] bg-[#FFF9EB] p-10 text-center"><span className="text-2xl text-[#C1953D]">★</span><h2 className="mt-4 text-2xl font-semibold">Pilot Cluster Generator</h2><p className="mx-auto mt-3 max-w-xl text-[9px] leading-5 text-[#8B7C61]">Select RAK Resort Development, F10 Car Rental and RAK Hotel Partner to detect NEFE’s Regional Pilot Cluster.</p><button onClick={()=>setSelectedNames(current=>Array.from(new Set([...current,"RAK Resort Development","F10 Car Rental","RAK Hotel Partner"])))} className="mt-5 rounded-xl bg-[#A77B29] px-5 py-3 text-[8px] font-bold text-white">Select CEO Network cluster</button></div>}<div className="mt-7"><p className="engine-eyebrow">Executive actions</p><div className="mt-4 flex flex-wrap gap-2">{["Generate Outreach Plan","Export Commercial Report","Create Partnership Bundle","Save Ecosystem","Compare Scenarios","Launch Pilot Simulation"].map((action,index)=><button key={action} onClick={()=>notify(`${action} ready`)} className={`rounded-xl px-5 py-3 text-[8px] font-bold transition hover:-translate-y-1 ${index===0?"bg-[#5E3BEE] text-white":"border border-[#DDD7E3] bg-white text-[#554E5C]"}`}>{action}</button>)}</div></div></section>

    <section {...slideProps(6)} className="engine-slide bg-[#120D1A] px-4 py-16 text-white sm:px-7 lg:px-9">
      <div className="mx-auto grid w-full max-w-[1240px] gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <div><p className="text-[8px] font-bold uppercase tracking-[.15em] text-[#C3AEFA]">Executive decision</p><h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-6xl">The opportunity is ready to move from simulation to pilot.</h2><p className="mt-6 max-w-2xl text-[11px] leading-6 text-white/45">{selected.length} businesses create a {commercialScore}/100 commercial opportunity with AED {(valueTotal/1000).toFixed(0)}K in projected monthly value. NEFE can now convert the scenario into an outreach plan, partnership bundle and controlled launch.</p><div className="mt-8 flex flex-wrap gap-2"><button onClick={()=>notify("Executive commercial report prepared")} className="rounded-xl bg-white px-5 py-3 text-[8px] font-bold text-[#4E31BE]">Export Commercial Report</button><button onClick={()=>notify("Pilot simulation launched")} className="rounded-xl border border-[#D3AE51]/30 bg-[#D3AE51]/10 px-5 py-3 text-[8px] font-bold text-[#E5C46F]">Launch Pilot Simulation</button></div></div>
        <div className="rounded-[26px] border border-white/10 bg-white/[.055] p-6 backdrop-blur-xl"><p className="text-[7px] font-bold uppercase tracking-[.13em] text-[#BCA8EF]">Decision summary</p><div className="mt-5 grid grid-cols-2 gap-3">{[["Commercial score",`${commercialScore}/100`],["Network strength",`${networkStrength}%`],["Monthly value",`AED ${(valueTotal/1000).toFixed(0)}K`],["Bundle readiness",`${bundleReadiness}%`]].map(([label,value])=><div key={label} className="rounded-[15px] bg-white/[.055] p-4"><p className="text-[6px] text-white/35">{label}</p><p className="mt-2 text-lg font-semibold">{value}</p></div>)}</div><p className="mt-5 rounded-[14px] bg-[#6D49DD]/15 p-4 text-[8px] leading-5 text-[#D2C3FA]">Recommended next step: approve a 90-day commercial pilot with executive sponsorship and weekly KPI review.</p></div>
      </div>
    </section>

    {presenting&&<div className="fixed inset-x-0 bottom-0 z-[200] flex items-center justify-between border-t border-white/10 bg-[#171120]/94 px-4 py-3 text-white backdrop-blur-xl sm:px-6"><button type="button" onClick={previousSlide} disabled={slide===0} className="min-w-28 touch-manipulation rounded-xl border border-white/10 bg-white/[.07] px-4 py-3 text-[8px] font-semibold transition enabled:hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-30">← Previous</button><div className="flex gap-1.5">{Array.from({length:slideCount},(_,index)=><button type="button" key={index} onClick={()=>setSlide(index)} aria-label={`Go to slide ${index+1}`} className={`h-1.5 rounded-full transition-all ${slide===index?"w-6 bg-[#CBA04B]":"w-1.5 bg-white/25 hover:bg-white/50"}`}/>)}</div><button type="button" onClick={nextSlide} disabled={slide===slideCount-1} className="min-w-28 touch-manipulation rounded-xl bg-[#6542D9] px-4 py-3 text-[8px] font-semibold transition enabled:hover:bg-[#7654E7] disabled:cursor-not-allowed disabled:opacity-30">Next →</button></div>}

    <AnimatePresence>
      {executiveModal&&<motion.div className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto bg-[#0C0712]/72 p-4 backdrop-blur-md" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={event=>{if(event.target===event.currentTarget)closeExecutiveModal()}}>
        <motion.div role="dialog" aria-modal="true" aria-labelledby="executive-modal-title" initial={{opacity:0,y:24,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:15,scale:.98}} transition={{type:"spring",stiffness:280,damping:26}} className="w-full max-w-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[#F8F6FA] shadow-[0_35px_100px_rgba(9,5,17,.45)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1B1228] via-[#31205D] to-[#5E3BEE] p-6 text-white sm:p-8"><div className="engine-grid absolute inset-0 opacity-20"/><div className="relative flex items-start justify-between gap-5"><div><p className="text-[7px] font-bold uppercase tracking-[.16em] text-[#D1C2FA]">{executiveModal==="report"?"Investor-ready intelligence":"Controlled commercial rollout"}</p><h2 id="executive-modal-title" className="mt-3 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">{executiveModal==="report"?"Executive Commercial Report":"90-Day Pilot Simulation"}</h2><p className="mt-2 text-[9px] text-white/45">Generated from the current Opportunity Engine scenario.</p></div><button type="button" onClick={closeExecutiveModal} aria-label="Close modal" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10 text-lg text-white/70 transition hover:bg-white/15">×</button></div></div>

          {executiveModal==="report"?<div className="p-6 sm:p-8">
            <div><p className="engine-eyebrow">Selected businesses</p><div className="mt-3 flex flex-wrap gap-2">{selected.map(merchant=><span key={merchant.name} className={`rounded-full border px-3 py-2 text-[7px] font-semibold ${merchant.ceo?"border-[#D5AE51]/40 bg-[#FFF4D9] text-[#916719]":"border-[#DDD5F5] bg-[#F1EDFF] text-[#5E3BEE]"}`}>{merchant.ceo?"★ ":""}{merchant.name}</span>)}</div></div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Commercial score",`${commercialScore}/100`],["Network strength",`${networkStrength}%`],["Monthly value",`AED ${(valueTotal/1000).toFixed(0)}K`],["Bundle readiness",`${bundleReadiness}%`]].map(([label,value])=><div key={label} className="rounded-[16px] border border-[#E5DFE9] bg-white p-4"><p className="text-[6px] text-[#958E9A]">{label}</p><p className="mt-2 text-lg font-semibold tracking-[-.03em]">{value}</p></div>)}</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-[17px] bg-[#F1EDFF] p-5"><p className="text-[7px] font-bold uppercase text-[#7257D2]">Recommended next step</p><p className="mt-2 text-[9px] leading-5 text-[#51456D]">Approve a 90-day commercial pilot with executive sponsorship, shared campaign ownership and weekly KPI review.</p></div><div className="rounded-[17px] bg-[#FFF7E5] p-5"><p className="text-[7px] font-bold uppercase text-[#9B7428]">Pilot recommendation</p><p className="mt-2 text-[9px] leading-5 text-[#64543A]">{ceoPilot?"Launch the Ras Al Khaimah CEO Network cluster as the first controlled regional pilot.":"Begin with the highest-fit hospitality, mobility and experience partners in one city."}</p></div></div>
            <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={closeExecutiveModal} className="rounded-xl border border-[#DDD7E3] px-5 py-3 text-[8px] font-bold text-[#625B68]">Close</button><button type="button" onClick={downloadExecutiveReport} className="relative z-10 touch-manipulation rounded-xl bg-[#5E3BEE] px-5 py-3 text-[8px] font-bold text-white shadow-[0_10px_25px_rgba(94,59,238,.22)]">Download PDF Preview</button></div>
          </div>:<div className="p-6 sm:p-8">
            <div className="rounded-[18px] border border-[#E1C471] bg-gradient-to-r from-[#FFF8E5] to-[#F5F0FF] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[7px] font-bold uppercase text-[#967022]">Pilot cluster</p><p className="mt-2 text-[11px] font-semibold">{ceoPilot?"RAK Resort Development + F10 Car Rental + RAK Hotel Partner":"Premium UAE Commercial Cluster"}</p></div><span className="rounded-full bg-[#AE8129] px-3 py-2 text-[7px] font-bold text-white">90 days</span></div></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-[17px] border border-[#E6E1EA] bg-white p-5"><p className="engine-eyebrow">Launch sequence</p><div className="mt-4 space-y-3">{[["Week 1","Executive alignment and commercial ownership"],["Week 2","Merchant onboarding and data setup"],["Week 3","Bundle design and campaign approvals"],["Week 4","Staff readiness and controlled customer launch"],["Month 2","Campaign testing, referral optimization and rewards"],["Month 3","Performance review and expansion decision"]].map(([period,task],index)=><div key={period} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#F0ECFF] text-[6px] font-bold text-[#5E3BEE]">0{index+1}</span><div><p className="text-[7px] font-bold">{period}</p><p className="mt-1 text-[6px] leading-3 text-[#8D8692]">{task}</p></div></div>)}</div></div><div className="space-y-3"><div className="rounded-[17px] border border-[#E6E1EA] bg-white p-5"><p className="engine-eyebrow">Expected KPIs</p><div className="mt-4 grid grid-cols-2 gap-2">{[["Revenue","AED 2.86M"],["Referrals","2,840"],["Conversion","27%"],["Repeat rate","34%"]].map(([label,value])=><div key={label} className="rounded-xl bg-[#F8F6FA] p-3"><p className="text-[6px] text-[#99929E]">{label}</p><p className="mt-1 text-[10px] font-semibold">{value}</p></div>)}</div></div><div className="rounded-[17px] border border-[#E6E1EA] bg-white p-5"><p className="text-[7px] font-bold uppercase text-[#8C8491]">Recommended pilot owner</p><p className="mt-2 text-[10px] font-semibold">NEFE Commercial Director</p><p className="mt-1 text-[7px] text-[#99929E]">Supported by merchant GMs and partner experience leads.</p></div></div></div>
            {simulationState!=="idle"&&<div className="mt-5 rounded-[16px] bg-[#171120] p-4 text-white"><div className="flex items-center justify-between gap-4"><div><p className="text-[8px] font-semibold">{simulationState==="complete"?"Pilot simulation complete. Ready for executive review.":simulationStages[Math.min(simulationStage,simulationStages.length-1)]}</p><p className="mt-1 text-[6px] text-white/35">{simulationState==="complete"?"All seven stages completed":`Stage ${Math.min(simulationStage+1,simulationStages.length)} of ${simulationStages.length}`}</p></div><span className={`text-[8px] font-bold ${simulationState==="complete"?"text-[#65D3A7]":"text-[#D9BD70]"}`}>{simulationProgress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.i className="block h-full rounded-full bg-gradient-to-r from-[#7250DF] to-[#D6AF55]" animate={{width:`${simulationProgress}%`}} transition={{duration:.5,ease:"easeInOut"}}/></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{simulationStages.map((stage,index)=>{const complete=index<simulationStage||simulationState==="complete";const active=simulationState==="running"&&index===simulationStage;return <div key={stage} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[6px] transition ${active?"bg-[#7452DF]/25 text-[#D8CCFF]":complete?"bg-[#51B98E]/10 text-[#75D5AE]":"bg-white/[.035] text-white/30"}`}><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${complete?"bg-[#50B98D]/20":active?"bg-[#7653E0]/25":"bg-white/[.05]"}`}>{complete?"✓":index+1}</span><span>{stage}</span>{active&&<i className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-[#D7B55C]"/>}</div>})}</div></div>}
            {simulationState==="complete"&&pilotSummaryVisible&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mt-4 rounded-[16px] border border-[#CFC2F4] bg-[#F3EFFF] p-4"><p className="text-[7px] font-bold uppercase text-[#6549C6]">Pilot summary</p><p className="mt-2 text-[8px] leading-5 text-[#554A70]">Seven rollout stages completed successfully. The scenario is ready for executive approval, commercial-owner assignment and controlled Week 1 activation.</p></motion.div>}
            <div className="mt-7 flex flex-wrap justify-end gap-2"><button type="button" onClick={closeExecutiveModal} className="rounded-xl border border-[#DDD7E3] px-5 py-3 text-[8px] font-bold text-[#625B68]">Close</button>{simulationState==="complete"?<><button type="button" onClick={()=>setPilotSummaryVisible(true)} className="rounded-xl border border-[#CFC1F5] bg-[#F5F1FF] px-5 py-3 text-[8px] font-bold text-[#5E3BEE]">View Pilot Summary</button><button type="button" onClick={downloadSimulationReport} className="rounded-xl bg-[#5E3BEE] px-5 py-3 text-[8px] font-bold text-white shadow-[0_10px_25px_rgba(94,59,238,.22)]">Export Simulation Report</button></>:<button type="button" disabled={simulationState==="running"} onClick={startSimulation} className="min-w-36 rounded-xl bg-[#5E3BEE] px-5 py-3 text-[8px] font-bold text-white shadow-[0_10px_25px_rgba(94,59,238,.22)] disabled:opacity-55">{simulationState==="running"?"Simulation Running…":"Start Simulation"}</button>}</div>
          </div>}
        </motion.div>
      </motion.div>}
    </AnimatePresence>

    {!presenting&&<div className="pointer-events-none fixed bottom-5 left-5 z-40 hidden max-w-[280px] space-y-2 xl:block">{recommendations.slice(0,2).map((item,index)=><motion.div initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:.8+index*.15}} key={item} className="rounded-[14px] border border-[#DFD7EA] bg-white/92 p-3 shadow-[0_12px_35px_rgba(43,30,66,.12)] backdrop-blur"><div className="flex gap-2"><span className="text-[#C3973D]">✦</span><div><p className="text-[7px] font-semibold">{item}</p><p className="mt-1 text-[5px] text-[#9C95A1]">NEFE AI recommendation</p></div></div></motion.div>)}</div>}
    {toast&&<div className="prototype-toast fixed bottom-6 left-1/2 z-[250] -translate-x-1/2 rounded-xl bg-[#211A32]/95 px-5 py-3 text-[8px] font-semibold text-white shadow-2xl">✓ {toast}</div>}
  </main>;
}
