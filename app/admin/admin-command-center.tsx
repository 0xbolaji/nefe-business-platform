"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "../components/brand-logo";

type IconName = "dashboard"|"business"|"customer"|"campaign"|"revenue"|"reward"|"globe"|"approval"|"health"|"activity"|"search"|"bell"|"spark";

function Icon({ name,className="h-5 w-5" }: { name:IconName;className?:string }) {
  const paths:Record<IconName,React.ReactNode>={
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    business:<><path d="M4 21V5h11v16M15 10h5v11M8 9h3M8 13h3M8 17h3M2 21h20"/></>,
    customer:<><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6"/></>,
    campaign:<><path d="m4 13 11-5v10L4 13ZM4 13v5M15 11h3a2 2 0 0 1 0 4h-3M7 17l1 4h4"/></>,
    revenue:<><path d="M4 19V9M10 19V5M16 19v-7M3 19h18M18 9l3-3M21 6h-4M21 6v4"/></>,
    reward:<><path d="M12 21s7-3.5 7-10V5l-7-2-7 2v6c0 6.5 7 10 7 10Z"/><path d="m9 12 2 2 4-5"/></>,
    globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
    approval:<><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    health:<><path d="M3 12h4l2-5 4 10 2-5h6"/></>,
    activity:<><path d="M4 6h16M4 12h10M4 18h13"/><circle cx="20" cy="18" r="1"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    spark:<><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const nav:{label:string;icon:IconName;badge?:string}[]=[
  {label:"Command Center",icon:"dashboard"},
  {label:"Businesses",icon:"business"},
  {label:"Customers",icon:"customer"},
  {label:"Campaigns",icon:"campaign"},
  {label:"Rewards",icon:"reward"},
  {label:"Markets",icon:"globe"},
  {label:"Approvals",icon:"approval",badge:"18"},
  {label:"System Health",icon:"health"},
];

const metrics:{label:string;value:string;change:string;icon:IconName;tone:string}[]=[
  {label:"Businesses",value:"1,247",change:"+84",icon:"business",tone:"purple"},
  {label:"Customers",value:"486.2K",change:"+18.2%",icon:"customer",tone:"blue"},
  {label:"Campaigns",value:"618",change:"+46",icon:"campaign",tone:"mint"},
  {label:"Revenue",value:"AED 12.8M",change:"+22.0%",icon:"revenue",tone:"gold"},
  {label:"Rewards",value:"1.4M",change:"+28.2%",icon:"reward",tone:"pink"},
  {label:"Cities",value:"18",change:"+3",icon:"globe",tone:"orange"},
  {label:"Countries",value:"4",change:"+1",icon:"globe",tone:"blue"},
];

const businesses=[
  {name:"Nobu by the Beach",category:"Beach Club",location:"Palm Jumeirah",submitted:"6 min ago",risk:"Low",initials:"NB"},
  {name:"Villa Amalfi",category:"Restaurant",location:"Jumeirah Bay",submitted:"22 min ago",risk:"Low",initials:"VA"},
  {name:"Prestige Motion",category:"Car Rental",location:"Business Bay",submitted:"48 min ago",risk:"Review",initials:"PM"},
  {name:"ORA Wellness",category:"Medical Spa",location:"Dubai Hills",submitted:"1 hr ago",risk:"Low",initials:"OW"},
];

const moderation=[
  {name:"Golden Weekend Collection",partners:"Celeste × Lumé × Aurum",value:"AED 3,850",status:"Awaiting review"},
  {name:"Executive Wellness Week",partners:"King's × Serein × Forme",value:"AED 1,490",status:"AI flagged"},
  {name:"Sunset Society Access",partners:"Azure × Maison D'Or",value:"AED 920",status:"Awaiting review"},
];

const initialActivity=[
  {type:"onboarding",title:"Nobu by the Beach submitted verification",detail:"Palm Jumeirah · Beach Club",time:"Just now",color:"#7653E8"},
  {type:"campaign",title:"Dubai Weekend Escape reached 500 bookings",detail:"AED 1.22M campaign revenue",time:"2 min",color:"#C39844"},
  {type:"reward",title:"12,400 rewards issued across 8 partners",detail:"Gold member activation",time:"4 min",color:"#4FA88B"},
  {type:"partner",title:"The Celeste connected with Aurum Drive",detail:"96% compatibility score",time:"8 min",color:"#5C83D4"},
  {type:"system",title:"Merchant intelligence model refreshed",detail:"1,247 businesses analyzed",time:"12 min",color:"#A06FD0"},
];

function Logo() {
  return <BrandLogo variant="white" badge="Admin" priority />;
}

export default function AdminCommandCenter() {
  const [pending,setPending]=useState(businesses);
  const [campaignQueue,setCampaignQueue]=useState(moderation);
  const [activity,setActivity]=useState(initialActivity);
  const [toast,setToast]=useState("");
  const [period,setPeriod]=useState("30 days");
  const activityIndex=useRef(0);

  useEffect(()=>{
    const newItems=[
      {type:"reward",title:"420 rewards redeemed at Maison D'Or",detail:"AED 42,800 customer value",time:"Just now",color:"#4FA88B"},
      {type:"campaign",title:"Coast to Calm campaign went live",detail:"4 partner businesses",time:"Just now",color:"#C39844"},
      {type:"onboarding",title:"Embody Fitness began onboarding",detail:"DIFC · Premium Fitness",time:"Just now",color:"#7653E8"},
    ];
    const timer=window.setInterval(()=>{const item=newItems[activityIndex.current%newItems.length];activityIndex.current+=1;setActivity(items=>[item,...items.slice(0,5)])},5200);
    return()=>window.clearInterval(timer);
  },[]);

  function notify(message:string){setToast(message);window.setTimeout(()=>setToast(""),2500)}
  function approve(name:string){setPending(items=>items.filter(item=>item.name!==name));notify(`${name} verified and added to the ecosystem`)}
  function moderate(name:string,action:string){setCampaignQueue(items=>items.filter(item=>item.name!==name));notify(`${name} ${action}`)}

  return <main className="min-h-screen bg-[#0D0B13] text-[#EEEAF5]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[246px] flex-col border-r border-white/[.07] bg-[#100D17] px-4 py-6 lg:flex">
      <div className="px-2"><Logo/></div><div className="mt-9 px-2 text-[8px] font-bold uppercase tracking-[.18em] text-white/25">Ecosystem operations</div><nav className="mt-3 space-y-1">{nav.map((item,i)=><button key={item.label} onClick={()=>notify(`${item.label} workspace opened`)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[11px] font-medium transition ${i===0?"bg-[#6845E4]/20 text-[#BCA8FF]":"text-white/45 hover:bg-white/[.04] hover:text-white/75"}`}><Icon name={item.icon} className="h-[17px] w-[17px]"/>{item.label}{item.badge&&<span className="ml-auto rounded-full bg-[#6744DF] px-2 py-0.5 text-[7px] text-white">{pending.length+campaignQueue.length}</span>}</button>)}</nav>
      <div className="mt-auto rounded-[18px] border border-[#55408E]/30 bg-gradient-to-br from-[#241A40] to-[#1A1328] p-4"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5E3BEE]/25 text-[#C7B5FF]"><Icon name="health" className="h-4 w-4"/></span><span className="flex items-center gap-1 text-[7px] font-bold text-[#58CEA1]"><i className="h-1.5 w-1.5 rounded-full bg-[#58CEA1] shadow-[0_0_8px_#58CEA1]"/>ALL SYSTEMS</span></div><p className="mt-3 text-[10px] font-semibold">Network operating normally</p><p className="mt-1 text-[7px] text-white/30">Last health check 24 seconds ago</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[98%] rounded-full bg-gradient-to-r from-[#4AAF88] to-[#64D3A9]"/></div></div>
      <Link href="/business-portal" className="mt-4 flex items-center gap-2 px-3 text-[9px] font-medium text-white/35 transition hover:text-white">← Business Portal</Link>
    </aside>

    <div className="lg:pl-[246px]">
      <header className="sticky top-0 z-30 border-b border-white/[.07] bg-[#0D0B13]/85 backdrop-blur-xl"><div className="flex h-[72px] items-center justify-between px-4 sm:px-7 lg:px-8"><div className="lg:hidden"><Logo/></div><div className="hidden lg:block"><p className="text-[8px] text-white/30">Admin Command Center</p><p className="mt-1 text-xs font-semibold">Ecosystem Overview</p></div><div className="flex items-center gap-2"><label className="relative hidden md:block"><Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"/><input aria-label="Search ecosystem" placeholder="Search ecosystem..." className="h-10 w-56 rounded-xl border border-white/10 bg-white/[.04] pl-9 pr-3 text-[9px] text-white outline-none placeholder:text-white/20 focus:border-[#7657D8]"/></label><button onClick={()=>notify("Notifications panel opened")} className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.04] text-white/50"><Icon name="bell" className="h-4 w-4"/><i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D3A446] ring-2 ring-[#14101C]"/></button><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] p-1.5 pr-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#6B48E6] to-[#A878D0] text-[8px] font-bold">NA</span><div className="hidden sm:block"><p className="text-[8px] font-semibold">NEFE Admin</p><p className="mt-0.5 text-[6px] text-white/25">Super administrator</p></div></div></div></div></header>

      <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.15em] text-[#A890F4]"><span className="relative flex h-2 w-2"><i className="absolute h-full w-full animate-ping rounded-full bg-[#50CA9B] opacity-50"/><i className="relative h-2 w-2 rounded-full bg-[#50CA9B]"/></span>Live ecosystem</div><h1 className="mt-2 text-2xl font-semibold tracking-[-.04em] sm:text-[30px]">Admin Command Center</h1><p className="mt-1.5 text-[9px] text-white/35">Monitor, moderate and grow the NEFE network in real time.</p></div><div className="flex items-center gap-2"><select value={period} onChange={e=>setPeriod(e.target.value)} className="h-10 rounded-xl border border-white/10 bg-white/[.04] px-3 text-[8px] text-white/60 outline-none"><option className="bg-[#17131F]">Last 24 hours</option><option className="bg-[#17131F]">7 days</option><option className="bg-[#17131F]">30 days</option></select><button onClick={()=>notify("Operations report exported")} className="h-10 rounded-xl bg-[#6845E4] px-4 text-[8px] font-semibold text-white shadow-[0_8px_22px_rgba(95,58,210,.25)]">Export report</button></div></div>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-7">{metrics.map(metric=><article key={metric.label} className="admin-card rounded-[17px] border border-white/[.07] bg-white/[.035] p-4 transition hover:-translate-y-1 hover:border-[#7557D5]/40 hover:bg-white/[.05]"><div className="flex items-start justify-between"><span className={`portal-icon ${metric.tone}`}><Icon name={metric.icon} className="h-4 w-4"/></span><span className="rounded-full bg-[#49B88C]/10 px-2 py-1 text-[7px] font-bold text-[#54C99B]">{metric.change}</span></div><p className="mt-4 text-[7px] font-medium text-white/30">{metric.label}</p><p className="mt-1.5 text-lg font-semibold tracking-[-.025em]">{metric.value}</p></article>)}</section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_.55fr]">
          <article className="admin-card rounded-[22px] border border-white/[.07] bg-white/[.035] p-5"><div className="flex items-start justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#9D84EB]">Ecosystem growth</p><h2 className="mt-1.5 text-[14px] font-semibold">Businesses, customers and revenue</h2></div><div className="flex gap-3 text-[7px] text-white/30"><span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#7B58E7]"/>Revenue</span><span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#D2A64B]"/>Customers</span></div></div><div className="relative mt-5 h-60"><div className="absolute inset-0 flex flex-col justify-between">{["16M","12M","8M","4M","0"].map(v=><div key={v} className="flex items-center gap-3"><span className="w-6 text-[6px] text-white/20">{v}</span><i className="h-px flex-1 bg-white/[.06]"/></div>)}</div><svg viewBox="0 0 800 220" className="absolute bottom-0 left-9 h-[220px] w-[calc(100%-2.25rem)]" preserveAspectRatio="none"><defs><linearGradient id="adminGrowth" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7552E5" stopOpacity=".3"/><stop offset="1" stopColor="#7552E5" stopOpacity="0"/></linearGradient></defs><path d="M0 195 C65 185 80 168 140 174 S230 162 280 136 S370 148 420 105 S520 119 570 78 S670 92 800 28 V220 H0Z" fill="url(#adminGrowth)"/><path d="M0 195 C65 185 80 168 140 174 S230 162 280 136 S370 148 420 105 S520 119 570 78 S670 92 800 28" fill="none" stroke="#7A57E7" strokeWidth="4" strokeLinecap="round"/><path d="M0 205 C80 194 95 180 160 184 S250 176 310 154 S400 162 460 129 S550 140 610 110 S700 118 800 72" fill="none" stroke="#D0A448" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 7"/></svg></div><div className="ml-9 mt-2 flex justify-between text-[6px] text-white/20">{["Jan","Feb","Mar","Apr","May","Jun","Jul"].map(m=><span key={m}>{m}</span>)}</div></article>
          <article className="admin-card rounded-[22px] border border-white/[.07] bg-white/[.035] p-5"><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#9D84EB]">Market footprint</p><h2 className="mt-1.5 text-[14px] font-semibold">Activity by city</h2><div className="mt-6 space-y-4">{[["Dubai","68%","AED 8.7M",68,"#7653E5"],["Abu Dhabi","17%","AED 2.2M",17,"#C99D47"],["Riyadh","9%","AED 1.2M",9,"#4DA68A"],["Doha","6%","AED 0.7M",6,"#557BCD"]].map(([city,share,value,width,color])=><div key={city as string}><div className="flex justify-between text-[8px]"><span>{city as string}</span><span className="text-white/30">{value as string} · <b className="text-white/65">{share as string}</b></span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.06]"><div className="executive-industry-bar h-full rounded-full" style={{width:`${width}%`,background:color as string}}/></div></div>)}</div><div className="mt-6 grid grid-cols-2 gap-2 border-t border-white/[.07] pt-4">{[["18","Active cities"],["4","Countries"]].map(([v,l])=><div key={l} className="rounded-xl bg-white/[.035] p-3"><p className="text-lg font-semibold">{v}</p><p className="mt-1 text-[6px] text-white/25">{l}</p></div>)}</div></article>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <article className="admin-card rounded-[22px] border border-white/[.07] bg-white/[.035]"><div className="flex items-center justify-between border-b border-white/[.07] p-5"><div><div className="flex items-center gap-2"><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#9D84EB]">Business approvals</p><span className="rounded-full bg-[#D4A646]/15 px-2 py-1 text-[7px] font-bold text-[#E0B758]">{pending.length} pending</span></div><h2 className="mt-1.5 text-[14px] font-semibold">Pending businesses</h2></div><button onClick={()=>notify("Approval queue focused")} className="text-[8px] font-semibold text-[#A990F4]">View queue →</button></div>{pending.length?<div className="divide-y divide-white/[.06]">{pending.map((business,i)=><div key={business.name} className="flex items-center gap-3 p-4 transition hover:bg-white/[.025]"><span className={`grid h-9 w-9 place-items-center rounded-[11px] text-[7px] font-bold text-white ${["bg-[#7351DD]","bg-[#B88937]","bg-[#4C819E]","bg-[#9B617D]"][i%4]}`}>{business.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-[9px] font-semibold">{business.name}</p><p className="mt-1 text-[7px] text-white/25">{business.category} · {business.location} · {business.submitted}</p></div><span className={`rounded-full px-2 py-1 text-[6px] font-bold ${business.risk==="Low"?"bg-[#4BB88C]/10 text-[#54C99B]":"bg-[#D39D45]/10 text-[#DCAE55]"}`}>{business.risk} risk</span><button onClick={()=>approve(business.name)} className="rounded-lg bg-[#6442D7] px-3 py-2 text-[7px] font-semibold text-white">Approve</button><button onClick={()=>{setPending(items=>items.filter(item=>item.name!==business.name));notify(`${business.name} moved to manual review`)}} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-[11px] text-white/35">•••</button></div>)}</div>:<div className="py-12 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#4CB88D]/10 text-[#58CAA0]"><Icon name="approval" className="h-5 w-5"/></span><p className="mt-3 text-[9px] font-semibold">Approval queue cleared</p><p className="mt-1 text-[7px] text-white/25">All businesses have been reviewed.</p></div>}</article>

          <article className="admin-card rounded-[22px] border border-white/[.07] bg-white/[.035]"><div className="flex items-center justify-between border-b border-white/[.07] p-5"><div><div className="flex items-center gap-2"><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#9D84EB]">Campaign moderation</p><span className="rounded-full bg-[#D4A646]/15 px-2 py-1 text-[7px] font-bold text-[#E0B758]">{campaignQueue.length} open</span></div><h2 className="mt-1.5 text-[14px] font-semibold">Campaign review queue</h2></div><button onClick={()=>notify("Moderation policy opened")} className="text-[8px] font-semibold text-[#A990F4]">Moderation policy →</button></div>{campaignQueue.length?<div className="divide-y divide-white/[.06]">{campaignQueue.map((campaign,i)=><div key={campaign.name} className="p-4 transition hover:bg-white/[.025]"><div className="flex items-start gap-3"><span className={`grid h-9 w-9 place-items-center rounded-[11px] ${i===1?"bg-[#CB754D]/15 text-[#E18B67]":"bg-[#7452DF]/15 text-[#A98EF2]"}`}><Icon name="campaign" className="h-4 w-4"/></span><div className="min-w-0 flex-1"><p className="truncate text-[9px] font-semibold">{campaign.name}</p><p className="mt-1 text-[7px] text-white/25">{campaign.partners} · {campaign.value}</p></div><span className={`rounded-full px-2 py-1 text-[6px] font-bold ${campaign.status==="AI flagged"?"bg-[#D87851]/12 text-[#E48A65]":"bg-[#D2A446]/12 text-[#DEB45B]"}`}>{campaign.status}</span></div><div className="mt-3 flex justify-end gap-2"><button onClick={()=>moderate(campaign.name,"returned for changes")} className="rounded-lg border border-white/10 px-3 py-2 text-[7px] font-semibold text-white/45">Request changes</button><button onClick={()=>moderate(campaign.name,"approved and published")} className="rounded-lg bg-[#6442D7] px-3 py-2 text-[7px] font-semibold text-white">Approve campaign</button></div></div>)}</div>:<div className="py-12 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#4CB88D]/10 text-[#58CAA0]"><Icon name="campaign" className="h-5 w-5"/></span><p className="mt-3 text-[9px] font-semibold">Campaign queue cleared</p><p className="mt-1 text-[7px] text-white/25">No campaigns require moderation.</p></div>}</article>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
          <article className="admin-card rounded-[22px] border border-[#6549AC]/25 bg-gradient-to-br from-[#21173A] to-[#17111F] p-5"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[.14em] text-[#A78EF2]"><Icon name="spark" className="h-4 w-4 text-[#D5AE51]"/>AI recommendations</div><h2 className="mt-1.5 text-[14px] font-semibold">Operator intelligence</h2></div><span className="rounded-full bg-[#4BB88C]/10 px-2 py-1 text-[6px] font-bold text-[#55C99B]">4 new</span></div><div className="mt-5 space-y-2">{[["Prioritize hospitality approvals","Four pending Dubai businesses have >90% network fit.","High impact"],["Review Executive Wellness Week","Offer language may require medical compliance review.","Action needed"],["Expand Riyadh partner acquisition","Demand is growing 2.4× faster than merchant supply.","Opportunity"],["Increase reward issuance ceiling","Redemptions are projected to exceed the current limit.","This week"]].map(([title,detail,badge],i)=><button key={title} onClick={()=>notify(`AI recommendation opened: ${title}`)} className="flex w-full items-start gap-3 rounded-[13px] border border-white/[.07] bg-white/[.035] p-3 text-left transition hover:border-[#7455CE]/40 hover:bg-white/[.055]"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#6946DB]/15 text-[8px] text-[#AC94F2]">0{i+1}</span><span className="min-w-0 flex-1"><b className="block text-[8px]">{title}</b><small className="mt-1 block text-[6px] leading-3 text-white/25">{detail}</small></span><span className="shrink-0 rounded-full bg-white/[.05] px-2 py-1 text-[6px] text-[#C3B4EE]">{badge}</span></button>)}</div></article>

          <article className="admin-card rounded-[22px] border border-white/[.07] bg-white/[.035]"><div className="flex items-center justify-between border-b border-white/[.07] p-5"><div><div className="flex items-center gap-2"><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#9D84EB]">Activity feed</p><span className="relative flex h-2 w-2"><i className="absolute h-full w-full animate-ping rounded-full bg-[#50C99B] opacity-40"/><i className="relative h-2 w-2 rounded-full bg-[#50C99B]"/></span></div><h2 className="mt-1.5 text-[14px] font-semibold">Live ecosystem activity</h2></div><div className="flex gap-2">{["Onboarding","Campaigns","Rewards"].map(item=><span key={item} className="rounded-full border border-white/[.07] px-2 py-1.5 text-[6px] text-white/35">{item}</span>)}</div></div><div className="divide-y divide-white/[.06]">{activity.map((item,i)=><div key={`${item.title}-${i}`} className={`flex items-center gap-3 p-4 ${i===0?"admin-activity-new":""}`}><span className="relative grid h-9 w-9 place-items-center rounded-[11px]" style={{background:`${item.color}18`,color:item.color}}><Icon name={item.type==="campaign"?"campaign":item.type==="reward"?"reward":item.type==="onboarding"?"business":"activity"} className="h-4 w-4"/>{i===0&&<i className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#50C99B] ring-2 ring-[#16121E]"/>}</span><div className="min-w-0 flex-1"><p className="truncate text-[8px] font-semibold">{item.title}</p><p className="mt-1 text-[6px] text-white/25">{item.detail}</p></div><span className="text-[6px] text-white/20">{item.time}</span></div>)}</div></article>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["API Gateway","99.99%","42 ms"],["AI Intelligence","99.98%","128 ms"],["Rewards Engine","100%","31 ms"],["Commerce Graph","99.99%","64 ms"]].map(([name,uptime,latency])=><article key={name} className="admin-card rounded-[17px] border border-white/[.07] bg-white/[.03] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#50C99B] shadow-[0_0_8px_#50C99B]"/><p className="text-[8px] font-semibold">{name}</p></div><span className="text-[6px] text-[#54C99B]">Operational</span></div><div className="mt-4 flex justify-between border-t border-white/[.06] pt-3"><div><p className="text-[6px] text-white/20">UPTIME</p><p className="mt-1 text-[9px] font-bold">{uptime}</p></div><div className="text-right"><p className="text-[6px] text-white/20">LATENCY</p><p className="mt-1 text-[9px] font-bold">{latency}</p></div></div></article>)}</section>
      </div>
    </div>
    {toast&&<div className="prototype-toast fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/10 bg-[#211A32]/95 px-4 py-3 text-[9px] font-semibold text-white shadow-2xl backdrop-blur"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#31A477] text-[9px]">✓</span>{toast}</div>}
  </main>;
}
