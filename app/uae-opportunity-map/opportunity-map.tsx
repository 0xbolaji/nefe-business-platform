"use client";

import { useMemo, useState } from "react";

type Business = {
  name: string; category: string; city: string; location: string; fit: number;
  nearby: number; bundle: string; referrals: number; priority: "High"|"Medium";
  opportunity: string; value: number; x: number; y: number; initials: string;
};

const businesses: Business[] = [
  {name:"One&Only One Za'abeel",category:"Hotels",city:"Dubai",location:"One Za'abeel",fit:97,nearby:14,bundle:"Executive Stay + Chauffeured Arrival",referrals:285,priority:"High",opportunity:"Premium bundle",value:284000,x:48,y:43,initials:"OO"},
  {name:"Trèsind Studio",category:"Restaurants",city:"Dubai",location:"Palm Jumeirah",fit:96,nearby:11,bundle:"Tasting Menu + Luxury Transfer",referrals:242,priority:"High",opportunity:"Customer referral",value:218000,x:27,y:58,initials:"TS"},
  {name:"VIP Rent A Car",category:"Car Rentals",city:"Dubai",location:"Business Bay",fit:94,nearby:18,bundle:"Supercar Weekend + Hotel Stay",referrals:316,priority:"High",opportunity:"Premium bundle",value:326000,x:52,y:57,initials:"VR"},
  {name:"Nammos Dubai",category:"Beach Clubs",city:"Dubai",location:"Jumeirah",fit:93,nearby:9,bundle:"Beach Day + Wellness Ritual",referrals:198,priority:"High",opportunity:"Lifestyle package",value:176000,x:37,y:50,initials:"ND"},
  {name:"Talise Ottoman Spa",category:"Spas",city:"Dubai",location:"Palm Jumeirah",fit:91,nearby:8,bundle:"Spa Ritual + Fine Dining",referrals:174,priority:"High",opportunity:"Wellness package",value:148000,x:23,y:63,initials:"TO"},
  {name:"Level Shoes Private",category:"Retail",city:"Dubai",location:"Dubai Mall",fit:89,nearby:21,bundle:"Private Shopping + Rewards",referrals:156,priority:"Medium",opportunity:"Member reward",value:132000,x:55,y:52,initials:"LS"},
  {name:"Coca-Cola Arena",category:"Events",city:"Dubai",location:"City Walk",fit:92,nearby:16,bundle:"Dinner + Premium Event Access",referrals:228,priority:"High",opportunity:"Event package",value:204000,x:48,y:51,initials:"CA"},
  {name:"King's College Hospital",category:"Healthcare",city:"Dubai",location:"Dubai Hills",fit:86,nearby:7,bundle:"Executive Health + Recovery Stay",referrals:118,priority:"Medium",opportunity:"Customer referral",value:96000,x:61,y:66,initials:"KC"},
  {name:"OMNIYAT Residences",category:"Real Estate",city:"Dubai",location:"Downtown Dubai",fit:88,nearby:13,bundle:"Resident Welcome Collection",referrals:132,priority:"Medium",opportunity:"Resident benefit",value:186000,x:57,y:48,initials:"OR"},
  {name:"The Lana Concierge",category:"Luxury Services",city:"Dubai",location:"Business Bay",fit:95,nearby:22,bundle:"Bespoke Dubai Weekend",referrals:264,priority:"High",opportunity:"Premium bundle",value:298000,x:54,y:58,initials:"LC"},
  {name:"Emirates Palace Mandarin Oriental",category:"Hotels",city:"Abu Dhabi",location:"West Corniche",fit:94,nearby:10,bundle:"Capital Weekend + Private Dining",referrals:210,priority:"High",opportunity:"Premium bundle",value:246000,x:20,y:30,initials:"EP"},
  {name:"Yas Marina Circuit",category:"Events",city:"Abu Dhabi",location:"Yas Island",fit:90,nearby:12,bundle:"Track Experience + Hotel Stay",referrals:186,priority:"High",opportunity:"Event package",value:194000,x:31,y:29,initials:"YM"},
  {name:"The Chedi Al Bait",category:"Hotels",city:"Sharjah",location:"Heart of Sharjah",fit:84,nearby:6,bundle:"Heritage Stay + Cultural Access",referrals:92,priority:"Medium",opportunity:"Cultural package",value:78000,x:67,y:37,initials:"CB"},
  {name:"Waldorf Astoria RAK",category:"Hotels",city:"Ras Al Khaimah",location:"Al Hamra",fit:88,nearby:7,bundle:"Resort Escape + Adventure",referrals:146,priority:"Medium",opportunity:"Weekend package",value:136000,x:82,y:18,initials:"WA"},
];

const sectors=["All sectors","Hotels","Restaurants","Car Rentals","Beach Clubs","Spas","Retail","Events","Healthcare","Real Estate","Luxury Services"];
const cities=["All cities","Dubai","Abu Dhabi","Sharjah","Ras Al Khaimah"];
const opportunities=["All opportunities","Premium bundle","Customer referral","Lifestyle package","Wellness package","Member reward","Event package","Resident benefit","Cultural package","Weekend package"];

export default function OpportunityMap(){
  const [sector,setSector]=useState("All sectors");
  const [city,setCity]=useState("All cities");
  const [minFit,setMinFit]=useState(80);
  const [opportunity,setOpportunity]=useState("All opportunities");
  const [selected,setSelected]=useState<Business>(businesses[0]);
  const [pipeline,setPipeline]=useState(businesses.filter(x=>x.priority==="High").slice(0,5));
  const [toast,setToast]=useState("");

  const filtered=useMemo(()=>businesses.filter(b=>
    (sector==="All sectors"||b.category===sector)&&
    (city==="All cities"||b.city===city)&& b.fit>=minFit&&
    (opportunity==="All opportunities"||b.opportunity===opportunity)
  ),[sector,city,minFit,opportunity]);
  const monthlyValue=filtered.reduce((sum,b)=>sum+b.value,0);

  function addLead(b:Business){
    if(!pipeline.some(x=>x.name===b.name))setPipeline(items=>[b,...items]);
    setToast(`${b.name} added to Partner Pipeline`);
    window.setTimeout(()=>setToast(""),2200);
  }

  return <main className="min-h-screen bg-[#F5F3F7] text-[#19152A]">
    <div className="mx-auto max-w-[1700px] px-4 py-7 sm:px-7 lg:px-9">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex w-fit items-center gap-2 rounded-full border border-[#DDD3F8] bg-white px-3 py-2 text-[8px] font-bold uppercase tracking-[.15em] text-[#5E3BEE]"><span className="relative flex h-2 w-2"><i className="absolute h-full w-full animate-ping rounded-full bg-[#4EBE91] opacity-40"/><i className="relative h-2 w-2 rounded-full bg-[#4EBE91]"/></span>Live market intelligence</div><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-[40px]">UAE Opportunity Map</h1><p className="mt-2 text-[10px] text-[#817A87]">Discover which UAE businesses NEFE should connect first.</p></div><div className="flex gap-3"><div className="rounded-xl border border-[#E3DEE7] bg-white px-4 py-3"><p className="text-[6px] uppercase text-[#9D96A2]">Visible opportunities</p><p className="mt-1 text-sm font-bold">{filtered.length}</p></div><div className="rounded-xl bg-[#21172F] px-4 py-3 text-white"><p className="text-[6px] uppercase text-white/35">Estimated monthly value</p><p className="mt-1 text-sm font-bold">AED {monthlyValue.toLocaleString()}</p></div></div></div>

      <section className="mt-6 rounded-[20px] border border-[#E4DFE8] bg-white p-3"><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.2fr_auto]"><label className="opportunity-filter"><span>Sector</span><select value={sector} onChange={e=>setSector(e.target.value)}>{sectors.map(x=><option key={x}>{x}</option>)}</select></label><label className="opportunity-filter"><span>City</span><select value={city} onChange={e=>setCity(e.target.value)}>{cities.map(x=><option key={x}>{x}</option>)}</select></label><label className="opportunity-filter"><span>Opportunity type</span><select value={opportunity} onChange={e=>setOpportunity(e.target.value)}>{opportunities.map(x=><option key={x}>{x}</option>)}</select></label><label className="px-3 py-2"><span className="flex justify-between text-[7px] font-bold uppercase tracking-wider text-[#8F8895]">Minimum fit score <b className="text-[#5E3BEE]">{minFit}%</b></span><input type="range" min="80" max="97" value={minFit} onChange={e=>setMinFit(Number(e.target.value))} className="roi-slider mt-3 w-full"/></label><button onClick={()=>{setSector("All sectors");setCity("All cities");setOpportunity("All opportunities");setMinFit(80)}} className="rounded-xl bg-[#F1EDFF] px-4 text-[8px] font-semibold text-[#5E3BEE]">Reset filters</button></div></section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_350px]">
        <div className="min-w-0">
          <section className="uae-map relative min-h-[620px] overflow-hidden rounded-[25px] border border-[#DCD6E3] bg-[#DDE8E5] shadow-[0_20px_55px_rgba(42,31,64,.1)]">
            <div className="uae-map-grid absolute inset-0"/><div className="uae-coast"/><div className="absolute left-[8%] top-[18%] text-[8px] font-bold uppercase tracking-widest text-[#59736E]/50">Abu Dhabi</div><div className="absolute left-[48%] top-[32%] text-[8px] font-bold uppercase tracking-widest text-[#59736E]/50">Dubai</div><div className="absolute left-[68%] top-[25%] text-[8px] font-bold uppercase tracking-widest text-[#59736E]/50">Sharjah</div><div className="absolute right-[8%] top-[9%] text-[8px] font-bold uppercase tracking-widest text-[#59736E]/50">Ras Al Khaimah</div>
            <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full">{filtered.map((b,i)=>{const target=filtered[(i+1)%filtered.length];return target?<path key={b.name} d={`M${b.x*10} ${b.y*6.2} Q500 310 ${target.x*10} ${target.y*6.2}`} fill="none" stroke="rgba(94,59,238,.15)" strokeWidth="1" strokeDasharray="5 7" className="commerce-dash"/>:null})}</svg>
            {filtered.map(b=><button key={b.name} onClick={()=>setSelected(b)} className={`map-pin absolute z-10 -translate-x-1/2 -translate-y-1/2 ${selected.name===b.name?"active":""}`} style={{left:`${b.x}%`,top:`${b.y}%`}}><span>{b.initials}</span><i>{b.fit}%</i></button>)}
            {filtered.length===0&&<div className="absolute inset-0 grid place-items-center"><div className="rounded-[20px] border border-white/60 bg-white/85 p-6 text-center shadow-xl backdrop-blur"><span className="text-2xl">⌖</span><p className="mt-3 text-[11px] font-semibold">No matching opportunities</p><p className="mt-1 text-[8px] text-[#8C8592]">Broaden the filters to reveal more businesses.</p></div></div>}
            {filtered.some(x=>x.name===selected.name)&&<article className="absolute bottom-4 left-4 right-4 z-20 rounded-[20px] border border-white/65 bg-white/90 p-4 shadow-[0_16px_45px_rgba(35,25,55,.18)] backdrop-blur-xl sm:right-auto sm:w-[430px]"><div className="flex items-start gap-3"><span className="grid h-11 w-11 place-items-center rounded-[13px] bg-gradient-to-br from-[#5E3BEE] to-[#9B78EF] text-[8px] font-bold text-white">{selected.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-1"><h2 className="truncate text-[12px] font-semibold">{selected.name}</h2><span className="text-[8px] text-[#5E3BEE]">✓</span></div><p className="mt-1 text-[7px] text-[#918A96]">{selected.category} · {selected.location}</p></div><span className="rounded-full bg-[#EAF9F2] px-2 py-1 text-[7px] font-bold text-[#168F66]">{selected.fit}% fit</span></div><div className="mt-4 grid grid-cols-3 gap-2"><div><p className="text-[6px] text-[#9A94A0]">Nearby partners</p><p className="mt-1 text-[10px] font-bold">{selected.nearby}</p></div><div><p className="text-[6px] text-[#9A94A0]">Monthly referrals</p><p className="mt-1 text-[10px] font-bold">{selected.referrals}</p></div><div><p className="text-[6px] text-[#9A94A0]">Priority</p><p className={`mt-1 text-[10px] font-bold ${selected.priority==="High"?"text-[#C17D28]":"text-[#5E3BEE]"}`}>{selected.priority}</p></div></div><div className="mt-3 rounded-xl bg-[#F5F1FF] p-3"><p className="text-[6px] uppercase tracking-wider text-[#8D829B]">Potential bundle idea</p><p className="mt-1 text-[9px] font-semibold text-[#5E3BEE]">{selected.bundle}</p></div><button onClick={()=>addLead(selected)} className="mt-3 w-full rounded-xl bg-[#5E3BEE] py-2.5 text-[8px] font-semibold text-white">Add to Partner Pipeline →</button></article>}
          </section>

          <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{filtered.map(b=><button key={b.name} onClick={()=>setSelected(b)} className="rounded-[18px] border border-[#E3DEE7] bg-white p-4 text-left transition hover:-translate-y-1 hover:border-[#CDBFF6]"><div className="flex items-center justify-between"><h3 className="truncate text-[10px] font-semibold">{b.name}</h3><span className="rounded-full bg-[#F0ECFF] px-2 py-1 text-[7px] font-bold text-[#5E3BEE]">{b.fit}%</span></div><p className="mt-1 text-[7px] text-[#938C98]">{b.category} · {b.location}</p><div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#EEEAF1] pt-3"><span className="text-[7px] text-[#77707D]">{b.nearby} nearby partners</span><span className="text-right text-[7px] font-semibold text-[#168F66]">{b.referrals} referrals/mo</span></div><p className="mt-3 truncate text-[8px] font-medium text-[#5E3BEE]">{b.bundle}</p></button>)}</div>
        </div>

        <aside className="h-fit rounded-[24px] border border-[#E0DAE5] bg-[#171221] p-5 text-white shadow-[0_18px_50px_rgba(32,23,47,.18)] xl:sticky xl:top-24"><div className="flex items-center justify-between"><div><p className="text-[7px] font-bold uppercase tracking-[.15em] text-[#B7A2F5]">Partner Pipeline</p><h2 className="mt-1.5 text-[17px] font-semibold">Priority opportunities</h2></div><span className="rounded-full bg-[#5E3BEE]/25 px-2.5 py-1.5 text-[7px] font-bold text-[#C5B4F9]">{pipeline.length} leads</span></div><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/[.055] p-3"><p className="text-[6px] text-white/30">High priority leads</p><p className="mt-1 text-lg font-semibold">{pipeline.filter(x=>x.priority==="High").length}</p></div><div className="rounded-xl bg-white/[.055] p-3"><p className="text-[6px] text-white/30">Estimated monthly value</p><p className="mt-1 text-sm font-semibold">AED {(pipeline.reduce((s,x)=>s+x.value,0)/1000).toFixed(0)}K</p></div></div><div className="mt-5 space-y-2">{pipeline.map((b,i)=><article key={b.name} className="rounded-[14px] border border-white/[.08] bg-white/[.04] p-3"><div className="flex items-start gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#6C49DF]/25 text-[6px] font-bold text-[#C6B6F7]">{b.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold">{b.name}</p><p className="mt-1 text-[6px] text-white/25">{b.opportunity} · {b.fit}% fit</p></div><span className="text-[6px] text-[#D7B35C]">0{i+1}</span></div><p className="mt-2 text-[7px] text-white/45">{b.bundle}</p><button onClick={()=>{setToast(`Outreach brief prepared for ${b.name}`);window.setTimeout(()=>setToast(""),2200)}} className="mt-2 text-[7px] font-semibold text-[#B49DF4]">Suggested outreach →</button></article>)}</div><button className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#6542DA] to-[#8562E8] py-3 text-[8px] font-semibold">Build outreach sequence</button></aside>
      </div>
    </div>
    {toast&&<div className="prototype-toast fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-[#211A32]/95 px-4 py-3 text-[8px] font-semibold text-white shadow-2xl">✓ {toast}</div>}
  </main>;
}
