"use client";

import Link from "next/link";
import { useState } from "react";
import type { Merchant } from "../merchant-data";
import { merchantSlug } from "../merchant-data";
import UAEFlag from "../../components/uae-flag";

type Match = Merchant & { compatibility: number };

const customerTypes: Record<string, string> = {
  Hotels: "Premium tourists, business travelers and weekend guests",
  Restaurants: "Affluent residents, destination diners and corporate groups",
  "Luxury Dining": "High-value diners, couples and international visitors",
  "Beach Clubs": "Lifestyle members, premium tourists and social groups",
  "Car Rentals": "Hotel guests, business travelers and luxury tourists",
  Spas: "Wellness travelers, residents and premium hotel guests",
  Retail: "Luxury shoppers, members and high-spend visitors",
  Healthcare: "Executives, families and international wellness travelers",
  Events: "Entertainment audiences, corporate groups and premium guests",
  "Real Estate": "Investors, new residents and high-net-worth buyers",
  "Luxury Experiences": "Premium tourists, celebration groups and concierge clients",
};

export default function MerchantProfile({ merchant, matches }: { merchant: Merchant; matches: Match[] }) {
  const [toast, setToast] = useState("");
  const act = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const conversion = Math.min(38, 18 + Math.round((merchant.fit - 80) * .8));
  const repeat = Math.min(46, 20 + Math.round((merchant.fit - 80) * 1.1));
  const customers = 1800 + merchant.referrals * 13;
  const averageValue = Math.round(merchant.value / Math.max(merchant.referrals, 1));
  const campaign = `${merchant.name} × ${matches[0]?.name ?? "Premium Partner"}`;

  return <main className="merchant-profile-page min-h-screen bg-[#F6F4F8] text-[#1B1725]">
    <section className={`relative overflow-hidden border-b ${merchant.ceo ? "bg-[#171220] text-white" : "bg-white"}`}>
      <div className="merchant-profile-grid absolute inset-0"/>
      <div className="page-shell relative py-14 sm:py-20">
        <Link href="/uae-opportunity-map" className={`inline-flex items-center gap-2 text-[9px] font-semibold ${merchant.ceo ? "text-[#D8B55E]" : "text-[#5E3BEE]"}`}>← UAE Opportunity Map</Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-2 text-[7px] font-bold uppercase tracking-[.14em] ${merchant.ceo ? "bg-[#D1A344]/15 text-[#E4C36E]" : "bg-[#F0ECFF] text-[#5E3BEE]"}`}>{merchant.category}</span>{merchant.ceo&&<span className="rounded-full border border-[#D1A344]/30 bg-[#D1A344]/10 px-3 py-2 text-[7px] font-bold text-[#E4C36E]">★ CEO Network</span>}</div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-.055em] sm:text-6xl">{merchant.name}</h1>
            <p className={`mt-4 inline-flex items-center gap-2 text-[11px] ${merchant.ceo ? "text-white/45" : "text-[#817A87]"}`}><UAEFlag className="h-4 w-auto" title="United Arab Emirates flag"/>{merchant.location}, {merchant.city} · Verified UAE opportunity</p>
          </div>
          <div className={`min-w-56 rounded-[22px] border p-5 backdrop-blur ${merchant.ceo ? "border-white/10 bg-white/[.055]" : "border-[#E3DEE8] bg-[#FAF9FB]"}`}>
            <p className={`text-[7px] font-bold uppercase tracking-[.12em] ${merchant.ceo ? "text-white/35" : "text-[#968F9B]"}`}>Partnership fit</p>
            <div className="mt-2 flex items-end justify-between"><strong className={`text-4xl ${merchant.ceo ? "text-[#E1BD62]" : "text-[#5E3BEE]"}`}>{merchant.fit}%</strong><span className={`rounded-full px-3 py-1.5 text-[7px] font-bold ${merchant.priority==="Very High"?"bg-[#D1A344]/15 text-[#DDBB63]":"bg-[#E9F8F2] text-[#29926D]"}`}>{merchant.priority} priority</span></div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/10"><i className={`block h-full rounded-full ${merchant.ceo ? "bg-gradient-to-r from-[#C89636] to-[#704BDD]" : "bg-[#5E3BEE]"}`} style={{width:`${merchant.fit}%`}}/></div>
          </div>
        </div>
      </div>
    </section>

    <div className="page-shell py-10 sm:py-14">
      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[26px] border border-[#E3DEE7] bg-white p-6 sm:p-8"><p className="merchant-eyebrow">Business overview</p><h2 className="mt-3 text-2xl font-semibold tracking-[-.035em]">A high-value connection inside the NEFE commercial ecosystem.</h2><p className="mt-4 max-w-2xl text-[10px] leading-6 text-[#746D79]">{merchant.name} is positioned to create measurable cross-business value through curated referrals, shared customer journeys and premium partner campaigns across {merchant.city}.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{[["Customer type",customerTypes[merchant.category]],["Estimated monthly customers",customers.toLocaleString()],["Average customer value",`AED ${averageValue.toLocaleString()}`],["Current opportunity",merchant.bundle]].map(([label,value])=><div key={label} className="rounded-[16px] bg-[#F8F6FA] p-4"><p className="text-[7px] uppercase text-[#9A939F]">{label}</p><p className="mt-2 text-[10px] font-semibold leading-5">{value}</p></div>)}</div></div>
        <div className={`rounded-[26px] p-7 text-white ${merchant.ceo ? "bg-gradient-to-br from-[#9B732B] via-[#5E3BEE] to-[#251A38]" : "bg-gradient-to-br from-[#5E3BEE] to-[#2D1D58]"}`}><p className="text-[7px] font-bold uppercase tracking-[.14em] text-white/50">Suggested bundle</p><span className="mt-7 grid h-12 w-12 place-items-center rounded-[15px] bg-white/10 text-xl">✦</span><h2 className="mt-5 text-2xl font-semibold tracking-[-.035em]">{merchant.bundle}</h2><p className="mt-3 text-[9px] leading-5 text-white/55">A premium multi-partner journey designed to increase conversion, average customer value and repeat engagement.</p><button onClick={()=>act("Bundle workspace created")} className="mt-8 rounded-xl bg-white px-4 py-3 text-[8px] font-bold text-[#4F32C4]">Create Bundle →</button></div>
      </section>

      <section className="mt-5 rounded-[26px] border border-[#E3DEE7] bg-white p-6 sm:p-8"><div className="flex items-end justify-between gap-4"><div><p className="merchant-eyebrow">Partner intelligence</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Suggested partner matches</h2></div><span className="text-[8px] text-[#918A96]">{matches.length} high-fit opportunities</span></div><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{matches.map(match=><Link key={match.name} href={`/merchants/${merchantSlug(match.name)}`} className="group rounded-[18px] border border-[#E8E3EB] p-4 transition hover:-translate-y-1 hover:border-[#C9BAF2] hover:shadow-[0_14px_35px_rgba(54,37,88,.09)]"><div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0ECFF] text-[8px] font-bold text-[#5E3BEE]">{match.name.split(/\s+/).slice(0,2).map(x=>x[0]).join("")}</span><b className="rounded-full bg-[#EAF8F3] px-2 py-1 text-[7px] text-[#278C69]">{match.compatibility}% match</b></div><h3 className="mt-4 text-[11px] font-semibold">{match.name}</h3><p className="mt-1 flex items-center gap-1.5 text-[7px] text-[#98919D]"><UAEFlag className="h-3 w-auto"/>{match.category} · {match.location}</p><div className="mt-4 rounded-xl bg-[#F8F6FA] p-3"><p className="text-[6px] uppercase text-[#9B94A0]">Campaign idea</p><p className="mt-1 text-[8px] font-semibold">{merchant.category} × {match.category} Member Journey</p></div></Link>)}</div></section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_.8fr]">
        <div className="rounded-[26px] border border-[#E3DEE7] bg-white p-6 sm:p-8"><p className="merchant-eyebrow">Revenue projection</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Commercial potential</h2><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Monthly referrals",merchant.referrals.toLocaleString()],["Monthly value",`AED ${(merchant.value/1000).toFixed(0)}K`],["Conversion rate",`${conversion}%`],["Repeat potential",`${repeat}%`]].map(([label,value])=><div key={label} className="rounded-[16px] border border-[#ECE8EF] p-4"><p className="text-[7px] text-[#99929F]">{label}</p><p className="mt-2 text-lg font-semibold tracking-[-.03em]">{value}</p></div>)}</div><div className="mt-5 rounded-[17px] bg-gradient-to-r from-[#F1EDFF] to-[#FBF7EC] p-5"><p className="text-[7px] uppercase text-[#8D83A0]">Recommended first campaign</p><p className="mt-2 text-[11px] font-semibold text-[#4E35A7]">{campaign}: {merchant.bundle}</p></div></div>
        <div className="rounded-[26px] border border-[#E3DEE7] bg-white p-6 sm:p-8"><p className="merchant-eyebrow">Outreach plan</p><div className="mt-5 space-y-4">{[["Suggested first message",`We identified a ${merchant.fit}% partnership fit between ${merchant.name} and the NEFE premium business network. We would like to share a focused pilot opportunity.`],["Best person to contact",merchant.meeting],["Partnership angle",`Unlock qualified ${merchant.city} customer flow through ${merchant.bundle.toLowerCase()}.`],["Next action","Schedule a 30-minute commercial opportunity workshop."]].map(([label,value])=><div key={label}><p className="text-[7px] font-bold uppercase text-[#9A939F]">{label}</p><p className="mt-1.5 text-[9px] leading-5 text-[#514A57]">{value}</p></div>)}</div></div>
      </section>

      <div className="mt-5 flex flex-wrap gap-2 rounded-[22px] border border-[#E3DEE7] bg-white p-4"><button onClick={()=>act(`${merchant.name} added to Partner Pipeline`)} className="rounded-xl bg-[#5E3BEE] px-5 py-3 text-[8px] font-bold text-white">Add to Partner Pipeline</button><button onClick={()=>act("Outreach plan generated")} className="rounded-xl bg-[#F0ECFF] px-5 py-3 text-[8px] font-bold text-[#5E3BEE]">Generate Outreach Plan</button><button onClick={()=>act("Bundle workspace created")} className="rounded-xl border border-[#DDD6E5] px-5 py-3 text-[8px] font-bold">Create Bundle</button><Link href="/opportunity-engine" className="rounded-xl border border-[#CFC1F5] bg-[#F6F2FF] px-5 py-3 text-[8px] font-bold text-[#5E3BEE]">Simulate in Opportunity Engine</Link><Link href="/uae-opportunity-map" className="ml-auto rounded-xl border border-[#DDD6E5] px-5 py-3 text-[8px] font-bold">Back to Opportunity Map</Link></div>
    </div>
    {toast&&<div className="prototype-toast fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-[#211A32]/95 px-5 py-3 text-[8px] font-semibold text-white shadow-2xl">✓ {toast}</div>}
  </main>;
}
