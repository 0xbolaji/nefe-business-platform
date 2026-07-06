"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PrototypeAssistant from "../components/prototype-assistant";

type Partner = {
  category: string;
  name: string;
  location: string;
  initials: string;
  color: string;
  inclusion: string;
  split: number;
};

const partners: Partner[] = [
  { category: "Hotel", name: "The Celeste Dubai", location: "Palm Jumeirah", initials: "CD", color: "from-[#5E3BEE] to-[#9B7CF7]", inclusion: "2-night hotel stay", split: 38 },
  { category: "Restaurant", name: "Maison D'Or", location: "DIFC", initials: "MD", color: "from-[#9B6A24] to-[#DBB568]", inclusion: "Fine dining reservation", split: 16 },
  { category: "Car Rental", name: "Aurum Drive", location: "Downtown Dubai", initials: "AD", color: "from-[#303646] to-[#727989]", inclusion: "Luxury airport pickup", split: 12 },
  { category: "Beach Club", name: "Azure Beach Society", location: "JBR", initials: "AB", color: "from-[#18899D] to-[#73C8D4]", inclusion: "Beach club access", split: 14 },
  { category: "Spa", name: "Serein Wellness", location: "Jumeirah", initials: "SW", color: "from-[#A96380] to-[#DEA2B8]", inclusion: "Spa treatment", split: 12 },
  { category: "Event Venue", name: "The Foundry", location: "Al Quoz", initials: "TF", color: "from-[#4268BC] to-[#7B9DE7]", inclusion: "Private event access", split: 8 },
];

const concepts = [
  {
    name: "Dubai Weekend Escape",
    label: "Signature city experience",
    description: "A seamless luxury weekend connecting arrival, stay, dining, wellness and the best of Dubai's coastline.",
    price: 2450,
    sales: 168,
    repeat: 24,
    audience: "business travelers, couples, premium tourists, UAE weekend visitors.",
  },
  {
    name: "The Golden Dubai Edit",
    label: "Premium lifestyle journey",
    description: "A curated city-to-coast itinerary designed around considered luxury, privileged access and effortless movement.",
    price: 2890,
    sales: 142,
    repeat: 27,
    audience: "luxury leisure travelers, anniversary couples, GCC residents, executive guests.",
  },
  {
    name: "Coast, Calm & Culture",
    label: "Restorative weekend collection",
    description: "A slower-paced Dubai escape bringing together beachside energy, restorative wellness and memorable evenings.",
    price: 2180,
    sales: 184,
    repeat: 29,
    audience: "wellness travelers, young professionals, couples, premium staycation guests.",
  },
];

function Logo() {
  return <Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#5E3BEE] text-white shadow-[0_8px_24px_rgba(94,59,238,.25)]"><svg viewBox="0 0 32 32" className="h-6 w-6" fill="none"><path d="M7 22V10l9 12V10l9 12V10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span><span className="text-[19px] font-bold tracking-[-.04em]">nefe</span></Link>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m5 12 4 4L19 6" /></svg>;
}

export default function ExperienceBuilder() {
  const [selected, setSelected] = useState(partners.slice(0, 5).map(item => item.category));
  const [conceptIndex, setConceptIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState("");
  const concept = concepts[conceptIndex];
  const selectedPartners = partners.filter(item => selected.includes(item.category));
  const revenue = concept.price * concept.sales;

  const normalizedSplits = useMemo(() => {
    const total = selectedPartners.reduce((sum, item) => sum + item.split, 0);
    return selectedPartners.map(item => ({ ...item, normalized: Math.round(item.split / total * 100) }));
  }, [selectedPartners]);

  function togglePartner(category: string) {
    setSelected(items => items.includes(category) ? (items.length > 2 ? items.filter(item => item !== category) : items) : [...items, category]);
  }

  function generate() {
    setGenerating(true);
    window.setTimeout(() => {
      setConceptIndex(index => (index + 1) % concepts.length);
      setGenerating(false);
      setToast("A new bundle has been generated");
      window.setTimeout(() => setToast(""), 2400);
    }, 900);
  }

  return <main className="min-h-screen bg-[#F7F6FA] text-[#19152A]">
    <header className="sticky top-0 z-30 border-b border-[#E9E5ED] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <div className="flex items-center gap-5"><Logo /><span className="hidden h-6 w-px bg-[#E7E2EB] sm:block" /><div className="hidden sm:block"><p className="text-[10px] text-[#99939F]">Business Portal</p><p className="text-xs font-semibold">Experience Builder</p></div></div>
        <div className="flex items-center gap-2"><Link href="/consumer" className="hidden rounded-xl px-3 py-2.5 text-[10px] font-semibold text-[#6C6574] transition hover:bg-[#F4F1F8] hover:text-[#5E3BEE] sm:block">View Consumer App</Link><Link href="/portal" className="rounded-xl border border-[#E5E0E9] bg-white px-4 py-2.5 text-[10px] font-semibold text-[#585160] shadow-sm transition hover:border-[#C8BAF6] hover:text-[#5E3BEE]">← Business Portal</Link></div>
      </div>
    </header>

    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="flex w-fit items-center gap-2 rounded-full border border-[#E0D7FA] bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#5E3BEE]"><span className="text-[#C39B40]">✦</span> Powered by NEFE Intelligence</div><h1 className="mt-4 text-3xl font-semibold tracking-[-.045em] sm:text-[38px]">Experience Builder</h1><p className="mt-2 text-sm text-[#837C8A]">Create premium bundled experiences with partner businesses.</p></div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E7E2EB] bg-white p-2 pr-4 text-[9px] text-[#8A8490] shadow-sm"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#EAF9F2] text-[#159166]"><CheckIcon /></span><span><b className="block text-[#413A49]">All changes saved</b>Prototype workspace</span></div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[390px_1fr]">
        <aside className="h-fit rounded-[24px] border border-[#E8E4EC] bg-white p-5 shadow-[0_8px_30px_rgba(42,29,67,.035)] xl:sticky xl:top-24">
          <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#7359D8]">Bundle creator</p><h2 className="mt-1.5 text-lg font-semibold">Select your partners</h2></div><span className="rounded-full bg-[#F0ECFF] px-2.5 py-1.5 text-[8px] font-bold text-[#5E3BEE]">{selected.length} selected</span></div>
          <p className="mt-2 text-[10px] leading-4 text-[#928B98]">Combine complementary businesses into one exceptional customer experience.</p>
          <div className="mt-5 space-y-2.5">{partners.map(partner => {
            const active = selected.includes(partner.category);
            return <button key={partner.category} onClick={() => togglePartner(partner.category)} className={`flex w-full items-center gap-3 rounded-[15px] border p-3 text-left transition ${active ? "border-[#CFC2F9] bg-[#FAF8FF] shadow-[0_5px_16px_rgba(73,48,140,.05)]" : "border-[#ECE8EF] hover:border-[#DAD1E2] hover:bg-[#FCFBFD]"}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${partner.color} text-[9px] font-bold text-white`}>{partner.initials}</span><span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold">{partner.name}</span><span className="mt-1 block text-[8px] text-[#99939F]">{partner.category} · {partner.location}</span></span><span className={`grid h-5 w-5 place-items-center rounded-full border transition ${active ? "border-[#5E3BEE] bg-[#5E3BEE] text-white" : "border-[#DAD4DE] text-transparent"}`}><CheckIcon /></span>
            </button>;
          })}</div>
          <div className="mt-4 rounded-xl bg-[#F8F6FA] p-3 text-[8px] leading-4 text-[#837C89]"><b className="text-[#514A59]">Bundle quality: Excellent</b><br />Your selected partners have a 94% audience compatibility score.</div>
        </aside>

        <div className="space-y-5">
          <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1F153D] via-[#34216D] to-[#6240D7] p-6 text-white shadow-[0_24px_60px_rgba(55,33,128,.18)] sm:p-8">
            <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#B9A0FF]/20 blur-2xl" /><div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#D3A94C]/10 blur-2xl" />
            {generating ? <div className="relative flex min-h-[330px] flex-col items-center justify-center"><span className="assistant-thinking text-4xl text-[#E5C875]">✦</span><p className="mt-5 text-sm font-semibold">Creating a new experience...</p><p className="mt-2 text-[9px] text-white/45">Balancing partner value, pricing and customer appeal</p><div className="mt-7 h-1 w-52 overflow-hidden rounded-full bg-white/10"><div className="experience-progress h-full rounded-full bg-gradient-to-r from-[#A88CFA] to-[#E6C46D]" /></div></div> : <div className="relative">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-[#D4C8FF]">{concept.label}</span><h2 className="mt-5 text-3xl font-semibold tracking-[-.045em] sm:text-[38px]">{concept.name}</h2><p className="mt-3 max-w-2xl text-[11px] leading-5 text-white/55">{concept.description}</p></div><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-xl text-[#E5C46E]">✦</span></div>
              <div className="mt-8"><p className="text-[8px] font-bold uppercase tracking-[.15em] text-white/35">Experience includes</p><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{selectedPartners.map(partner => <div key={partner.category} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[.07] p-3 backdrop-blur"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-[7px] font-bold">{partner.initials}</span><div><p className="text-[9px] font-semibold">{partner.inclusion}</p><p className="mt-1 text-[7px] text-white/35">{partner.name}</p></div></div>)}</div></div>
              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5"><div className="flex -space-x-2">{selectedPartners.map(partner => <span key={partner.initials} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#392474] bg-gradient-to-br ${partner.color} text-[7px] font-bold`}>{partner.initials}</span>)}</div><p className="text-[8px] text-white/45"><b className="text-white/80">{selected.length} partner businesses</b><br />One connected customer journey</p><button onClick={() => setToast("Bundle preview copied for sharing")} className="ml-auto rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-[9px] font-semibold transition hover:bg-white/20">Share preview ↗</button></div>
            </div>}
          </section>

          <section className="rounded-[24px] border border-[#E8E4EC] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#7359D8]">Business projections</p><h2 className="mt-1.5 text-lg font-semibold">Commercial potential</h2></div><span className="rounded-full bg-[#EAF9F2] px-2.5 py-1.5 text-[8px] font-bold text-[#158F66]">High confidence</span></div>
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">{[
              [`AED ${concept.price.toLocaleString()}`,"Recommended price","Optimized for conversion"],
              [concept.sales.toString(),"Projected monthly sales","+18% vs. similar bundles"],
              [`AED ${revenue.toLocaleString()}`,"Estimated monthly revenue","Gross bundle revenue"],
              [`${concept.repeat}%`,"Expected repeat customers","+7.4% network average"],
            ].map(([value,label,detail]) => <article key={label} className="rounded-[16px] border border-[#ECE8EF] bg-[#FCFBFD] p-4"><p className="text-lg font-bold tracking-[-.025em]">{value}</p><p className="mt-2 text-[8px] font-semibold text-[#706977]">{label}</p><p className="mt-1 text-[7px] text-[#159166]">{detail}</p></article>)}</div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]"><div><h3 className="text-[11px] font-semibold">Partner revenue split</h3><p className="mt-1 text-[8px] text-[#96909C]">Recommended distribution based on contribution and delivery cost.</p><div className="mt-4 flex h-3 overflow-hidden rounded-full">{normalizedSplits.map((partner,i) => <div key={partner.category} title={`${partner.name}: ${partner.normalized}%`} className={["bg-[#5E3BEE]","bg-[#C79B42]","bg-[#596274]","bg-[#3D9EB0]","bg-[#C87897]","bg-[#4E78CE]"][i]} style={{width:`${partner.normalized}%`}} />)}</div></div><div className="grid grid-cols-2 gap-x-5 gap-y-2">{normalizedSplits.map(partner => <div key={partner.category} className="flex items-center text-[8px]"><span className={`mr-2 h-2 w-2 rounded-full bg-gradient-to-br ${partner.color}`} /><span className="truncate text-[#77707D]">{partner.name}</span><b className="ml-auto">{partner.normalized}%</b></div>)}</div></div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div className="rounded-[22px] border border-[#E1D8F7] bg-gradient-to-r from-[#F4F0FF] to-[#FFF9EB] p-5 sm:p-6"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#5E3BEE] text-[#E8CE79] shadow-[0_10px_22px_rgba(94,59,238,.2)]">✦</span><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#6A4FD5]">AI recommendation</p><h3 className="mt-1.5 text-[13px] font-semibold">Audience fit is exceptionally strong</h3><p className="mt-2 text-[10px] leading-5 text-[#6F6878]"><b>Recommended audience:</b> {concept.audience}</p><div className="mt-3 flex flex-wrap gap-2">{["Premium intent","Weekend demand","High partner overlap"].map(item => <span key={item} className="rounded-full border border-white bg-white/70 px-2.5 py-1.5 text-[7px] font-semibold text-[#6E55CB]">{item}</span>)}</div></div></div></div>
            <button onClick={generate} disabled={generating} className="flex min-h-28 items-center justify-center gap-2 rounded-[22px] bg-[#5E3BEE] px-8 text-xs font-semibold text-white shadow-[0_14px_32px_rgba(94,59,238,.24)] transition hover:-translate-y-1 hover:bg-[#5130DD] disabled:opacity-60"><span className="text-[#E9CE78]">✦</span>{generating ? "Generating..." : "Generate Another Bundle"}</button>
          </section>
        </div>
      </div>
    </div>
    <PrototypeAssistant />
    {toast && <div className="prototype-toast fixed bottom-6 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#211A32]/95 px-4 py-3 text-[10px] font-semibold text-white shadow-2xl"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#31A477] text-[10px]">✓</span>{toast}</div>}
  </main>;
}
