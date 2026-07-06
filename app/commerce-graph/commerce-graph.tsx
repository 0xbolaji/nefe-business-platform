"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BrandLogo from "../components/brand-logo";
import Image from "next/image";

type Flow = "customers" | "referrals" | "rewards";

type Business = {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  revenue: string;
  partners: number;
  campaigns: number;
  referrals: string;
  bundles: string[];
  initials: string;
  color: string;
};

const businesses: Business[] = [
  { id:"hotel", name:"The Celeste", category:"Luxury Hotel", x:500, y:95, revenue:"AED 3.42M", partners:31, campaigns:18, referrals:"8,240", bundles:["Dubai Weekend Escape","Executive Arrival","Stay & Savour"], initials:"CH", color:"#8B6CF0" },
  { id:"restaurant", name:"Maison D'Or", category:"Restaurant", x:760, y:160, revenue:"AED 2.61M", partners:26, campaigns:15, referrals:"7,186", bundles:["Dinner & Culture","Stay & Savour","Golden Evening"], initials:"MD", color:"#D1A34D" },
  { id:"beach", name:"Azure Society", category:"Beach Club", x:870, y:365, revenue:"AED 1.54M", partners:19, campaigns:11, referrals:"5,940", bundles:["Coast to Calm","Sunset Society","Beach & Brunch"], initials:"AB", color:"#42B2C2" },
  { id:"car", name:"Aurum Drive", category:"Luxury Car Rental", x:720, y:565, revenue:"AED 1.86M", partners:24, campaigns:13, referrals:"6,420", bundles:["Executive Arrival","Dubai Weekend Escape","Chauffeured Dining"], initials:"AD", color:"#7290D7" },
  { id:"spa", name:"Serein Wellness", category:"Spa", x:280, y:565, revenue:"AED 1.28M", partners:18, campaigns:10, referrals:"4,860", bundles:["Coast to Calm","Restore & Stay","Wellness Weekend"], initials:"SW", color:"#CE7D9D" },
  { id:"retail", name:"Lumé Joaillerie", category:"Retail", x:130, y:365, revenue:"AED 1.33M", partners:16, campaigns:8, referrals:"4,180", bundles:["Golden Weekend","Private Collection","Shop & Reward"], initials:"LJ", color:"#C59A51" },
  { id:"medical", name:"King's College", category:"Medical Clinic", x:240, y:160, revenue:"AED 1.08M", partners:14, campaigns:7, referrals:"3,620", bundles:["Executive Health","Restore & Stay","Wellbeing Review"], initials:"KC", color:"#58A98D" },
  { id:"event", name:"The Foundry", category:"Event Venue", x:500, y:610, revenue:"AED 0.96M", partners:22, campaigns:12, referrals:"5,112", bundles:["Dinner & Culture","Private Preview","City After Dark"], initials:"TF", color:"#A075E1" },
];

type Connection = {
  from: string;
  to: string;
  referrals: string;
  revenue: string;
  conversion: string;
};

const connections: Connection[] = [
  { from:"hotel",to:"restaurant",referrals:"1,842",revenue:"AED 486K",conversion:"14.2%" },
  { from:"restaurant",to:"beach",referrals:"1,216",revenue:"AED 294K",conversion:"11.8%" },
  { from:"beach",to:"car",referrals:"986",revenue:"AED 248K",conversion:"10.7%" },
  { from:"car",to:"event",referrals:"1,408",revenue:"AED 382K",conversion:"13.1%" },
  { from:"event",to:"spa",referrals:"1,124",revenue:"AED 216K",conversion:"9.8%" },
  { from:"spa",to:"retail",referrals:"864",revenue:"AED 192K",conversion:"10.2%" },
  { from:"retail",to:"medical",referrals:"742",revenue:"AED 168K",conversion:"8.9%" },
  { from:"medical",to:"hotel",referrals:"1,038",revenue:"AED 326K",conversion:"12.4%" },
  { from:"hotel",to:"car",referrals:"2,146",revenue:"AED 618K",conversion:"15.6%" },
  { from:"restaurant",to:"event",referrals:"1,728",revenue:"AED 442K",conversion:"13.9%" },
  { from:"beach",to:"spa",referrals:"1,964",revenue:"AED 528K",conversion:"16.1%" },
  { from:"retail",to:"restaurant",referrals:"1,088",revenue:"AED 286K",conversion:"11.3%" },
];

const counterData = [
  { label:"Businesses Connected", end:1247, suffix:"", detail:"+84 this month" },
  { label:"Cross-business Revenue", end:12.8, prefix:"AED ", suffix:"M", decimals:1, detail:"+22.0%" },
  { label:"Monthly Referrals", end:48392, suffix:"", detail:"+18.7%" },
  { label:"Repeat Customer Rate", end:42.8, suffix:"%", decimals:1, detail:"+6.2 pts" },
];

function Counter({ end, prefix = "", suffix, decimals = 0 }: { end:number; prefix?:string; suffix:string; decimals?:number }) {
  const [value,setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now:number) => {
      const progress = Math.min((now-start)/1400,1);
      setValue(end*(1-Math.pow(1-progress,3)));
      if(progress<1) frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[end]);
  return <>{prefix}{value.toLocaleString("en-US",{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}{suffix}</>;
}

function Logo({ dark }: { dark:boolean }) {
  return <BrandLogo variant={dark ? "white" : "purple"} priority />;
}

function DetailDrawer({ business, onClose, dark }: { business:Business; onClose:()=>void; dark:boolean }) {
  const metrics = [["Revenue",business.revenue],["Partner count",business.partners.toString()],["Campaigns",business.campaigns.toString()],["Customer referrals",business.referrals]];
  return <div className={`commerce-drawer absolute inset-y-3 right-3 z-40 w-[min(370px,calc(100%-24px))] overflow-y-auto rounded-[24px] border p-5 shadow-2xl backdrop-blur-2xl ${dark?"border-white/10 bg-[#171224]/90 text-white":"border-[#DDD5E8] bg-white/92 text-[#19152A]"}`}>
    <div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-[15px] text-xs font-bold text-white shadow-lg" style={{background:`linear-gradient(135deg,${business.color},#33235f)`}}>{business.initials}</span><div><p className={`text-[8px] font-bold uppercase tracking-[.14em] ${dark?"text-white/35":"text-[#9991A1]"}`}>{business.category}</p><h2 className="mt-1 text-[17px] font-semibold">{business.name}</h2><p className="mt-1 flex items-center gap-1 text-[8px] text-[#58CAA0]">● Verified ecosystem partner</p></div></div><button onClick={onClose} className={`grid h-8 w-8 place-items-center rounded-full text-sm ${dark?"bg-white/10":"bg-[#F3F0F6]"}`}>×</button></div>
    <div className="mt-6 grid grid-cols-2 gap-2">{metrics.map(([label,value])=><div key={label} className={`rounded-[14px] border p-3 ${dark?"border-white/8 bg-white/[.045]":"border-[#ECE7F0] bg-[#FAF9FB]"}`}><p className={`text-[7px] ${dark?"text-white/35":"text-[#99929F]"}`}>{label}</p><p className="mt-1.5 text-[14px] font-bold">{value}</p></div>)}</div>
    <div className="mt-6"><div className="flex items-center justify-between"><h3 className="text-[10px] font-semibold">Revenue growth</h3><span className="rounded-full bg-[#46B98D]/15 px-2 py-1 text-[7px] font-bold text-[#55C99B]">↗ 24.8%</span></div><div className="mt-4 flex h-20 items-end gap-1.5">{[28,34,31,46,52,48,63,68,76,72,88,98].map((h,i)=><i key={i} className="chart-bar flex-1 rounded-t" style={{height:`${h}%`,background:`linear-gradient(to top,${business.color}88,${business.color})`,animationDelay:`${i*45}ms`}} />)}</div></div>
    <div className="mt-6"><h3 className="text-[10px] font-semibold">Top bundles</h3><div className="mt-3 space-y-2">{business.bundles.map((bundle,i)=><div key={bundle} className={`flex items-center gap-3 rounded-xl border p-3 ${dark?"border-white/8 bg-white/[.035]":"border-[#ECE7F0]"}`}><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#6D49EE]/15 text-[8px] font-bold text-[#A991FF]">0{i+1}</span><span className="text-[9px] font-medium">{bundle}</span><span className="ml-auto text-[8px] text-[#55C99B]">+{18-i*3}%</span></div>)}</div></div>
    <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6B47EA] to-[#8A65F3] py-3 text-[9px] font-semibold text-white shadow-[0_10px_24px_rgba(94,59,238,.25)]">View complete partner profile →</button>
  </div>;
}

export default function CommerceGraph() {
  const [dark,setDark] = useState(true);
  const [activeFlows,setActiveFlows] = useState<Flow[]>(["customers","referrals","rewards"]);
  const [selected,setSelected] = useState<Business|null>(null);
  const [hovered,setHovered] = useState<Connection|null>(null);
  const [paused,setPaused] = useState(false);

  const nodeMap = useMemo(()=>Object.fromEntries(businesses.map(item=>[item.id,item])),[]);
  const toggleFlow = (flow:Flow) => setActiveFlows(items=>items.includes(flow)?items.filter(item=>item!==flow):[...items,flow]);

  return <main className={`commerce-page min-h-screen transition-colors duration-500 ${dark?"commerce-dark bg-[#090710] text-white":"commerce-light bg-[#F5F2F8] text-[#171226]"}`}>
    <header className={`relative z-30 border-b backdrop-blur-xl ${dark?"border-white/[.07] bg-[#0B0813]/75":"border-[#E3DDE9] bg-white/75"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-7 lg:px-10"><div className="flex items-center gap-5"><Logo dark={dark}/><span className={`hidden h-6 w-px sm:block ${dark?"bg-white/10":"bg-[#DED7E5]"}`}/><div className="hidden sm:block"><p className={`text-[9px] ${dark?"text-white/30":"text-[#9B94A2]"}`}>Live Ecosystem</p><p className="text-xs font-semibold">Commerce Graph</p></div></div><div className="flex items-center gap-2"><button onClick={()=>setDark(!dark)} className={`grid h-9 w-9 place-items-center rounded-xl border text-sm ${dark?"border-white/10 bg-white/[.06] text-[#E9D27E]":"border-[#E0DAE6] bg-white text-[#5E3BEE]"}`}>{dark?"☼":"☾"}</button><Link href="/executive-insights" className={`hidden rounded-xl px-3 py-2.5 text-[9px] font-semibold md:block ${dark?"text-white/55 hover:bg-white/5 hover:text-white":"text-[#665F6E] hover:bg-white"}`}>Executive Insights</Link><Link href="/business-portal" className={`rounded-xl border px-4 py-2.5 text-[9px] font-semibold ${dark?"border-white/10 bg-white/[.06] text-white/75":"border-[#DED7E5] bg-white"}`}>← Business Portal</Link></div></div>
    </header>

    <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-7 sm:px-7 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className={`flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[8px] font-bold uppercase tracking-[.16em] ${dark?"border-[#7255CD]/35 bg-[#5E3BEE]/10 text-[#BDA9FF]":"border-[#D9CEF8] bg-white text-[#5E3BEE]"}`}><span className="relative flex h-2 w-2"><i className="absolute h-full w-full animate-ping rounded-full bg-[#50C99A] opacity-60"/><i className="relative h-2 w-2 rounded-full bg-[#50C99A]"/></span> Ecosystem live</div><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-[40px]">Commerce Graph</h1><p className={`mt-2 text-[11px] ${dark?"text-white/40":"text-[#817A88]"}`}>Watch customers, referrals, rewards and revenue move across the NEFE ecosystem.</p></div><div className={`flex w-fit items-center gap-1 rounded-xl border p-1 ${dark?"border-white/8 bg-white/[.04]":"border-[#E0DAE6] bg-white"}`}><button onClick={()=>setPaused(!paused)} className={`rounded-lg px-3 py-2 text-[8px] font-semibold ${paused?"bg-[#D2A747]/15 text-[#E0BB62]":"bg-[#5E3BEE]/15 text-[#A98EFF]"}`}>{paused?"▶ Resume":"Ⅱ Pause"}</button>{(["customers","referrals","rewards"] as Flow[]).map((flow,i)=><button key={flow} onClick={()=>toggleFlow(flow)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[8px] font-semibold capitalize transition ${activeFlows.includes(flow)?(dark?"bg-white/8 text-white":"bg-[#F0ECFF] text-[#5E3BEE]"):(dark?"text-white/25":"text-[#AAA3AF]")}`}><i className="h-1.5 w-1.5 rounded-full" style={{background:["#B19AFB","#53CBA0","#E2BE68"][i]}}/>{flow}</button>)}</div></div>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{counterData.map(counter=><article key={counter.label} className={`commerce-glass rounded-[18px] border p-4 ${dark?"border-white/[.07] bg-white/[.035]":"border-[#E3DDE8] bg-white/80"}`}><div className="flex items-center justify-between"><p className={`text-[8px] font-medium ${dark?"text-white/35":"text-[#8D8693]"}`}>{counter.label}</p><span className="relative flex h-2 w-2"><i className="absolute h-full w-full animate-ping rounded-full bg-[#51C99B] opacity-30"/><i className="relative h-2 w-2 rounded-full bg-[#51C99B]"/></span></div><p className="mt-2 text-xl font-semibold tracking-[-.035em] sm:text-2xl"><Counter end={counter.end} prefix={counter.prefix} suffix={counter.suffix} decimals={counter.decimals}/></p><div className="mt-3 flex items-center gap-2"><span className="rounded-full bg-[#46B98D]/12 px-2 py-1 text-[7px] font-bold text-[#4DBF91]">{counter.detail}</span><span className={`text-[7px] ${dark?"text-white/20":"text-[#AAA3AF]"}`}>live</span></div></article>)}</section>

      <section className={`relative mt-4 min-h-[690px] overflow-hidden rounded-[30px] border ${dark?"border-white/[.07] bg-[#0D0916]/80 shadow-[0_35px_100px_rgba(0,0,0,.35)]":"border-[#E2DCE7] bg-white/75 shadow-[0_30px_80px_rgba(55,38,80,.1)]"}`}>
        <div className="commerce-orb one"/><div className="commerce-orb two"/><div className="commerce-grid absolute inset-0 opacity-40"/>
        <div className={`absolute left-5 top-5 z-20 rounded-xl border px-3 py-2 backdrop-blur ${dark?"border-white/8 bg-black/20":"border-[#E1DAE7] bg-white/70"}`}><p className={`text-[7px] font-bold uppercase tracking-[.14em] ${dark?"text-white/25":"text-[#9C95A2]"}`}>Live network activity</p><div className="mt-2 flex gap-4">{[["24","flows / sec"],["AED 8.4K","revenue / min"],["94%","network health"]].map(([v,l])=><div key={l}><p className="text-[10px] font-bold">{v}</p><p className={`text-[6px] ${dark?"text-white/25":"text-[#AAA3AF]"}`}>{l}</p></div>)}</div></div>

        <div className={`absolute inset-0 ${paused?"commerce-paused":""}`}>
          <svg viewBox="0 0 1000 690" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="3.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <radialGradient id="centerGlow"><stop offset="0" stopColor="#8E68FF" stopOpacity=".8"/><stop offset="1" stopColor="#5E3BEE" stopOpacity=".05"/></radialGradient>
            </defs>
            {connections.map((connection,index)=>{
              const from=nodeMap[connection.from] as Business; const to=nodeMap[connection.to] as Business;
              const curve=`M ${from.x} ${from.y} Q 500 345 ${to.x} ${to.y}`;
              const isHovered=hovered===connection;
              return <g key={`${connection.from}-${connection.to}`}>
                <path d={curve} fill="none" stroke={isHovered?"#9C80FF":dark?"rgba(151,123,234,.24)":"rgba(94,59,238,.20)"} strokeWidth={isHovered?2.2:1.1} className="commerce-connection"/>
                <path d={curve} fill="none" stroke="transparent" strokeWidth="18" className="cursor-pointer" onMouseEnter={()=>setHovered(connection)} onMouseLeave={()=>setHovered(null)}/>
                {!paused&&activeFlows.includes("customers")&&<circle r="3.5" fill="#B59DFF" filter="url(#glow)"><animateMotion dur={`${4.5+(index%4)*.6}s`} repeatCount="indefinite" begin={`${index*-.37}s`} path={curve}/></circle>}
                {!paused&&activeFlows.includes("referrals")&&index%2===0&&<circle r="2.8" fill="#55D2A4" filter="url(#glow)"><animateMotion dur={`${5.8+(index%3)*.7}s`} repeatCount="indefinite" begin={`${index*-.52}s`} path={curve}/></circle>}
                {!paused&&activeFlows.includes("rewards")&&index%3===0&&<circle r="3" fill="#E5C36C" filter="url(#glow)"><animateMotion dur={`${7+(index%2)}s`} repeatCount="indefinite" begin={`${index*-.71}s`} path={curve}/></circle>}
              </g>;
            })}
            {businesses.map((business,index)=>{
              const path=`M ${business.x} ${business.y} Q 500 345 500 345`;
              return <g key={`center-${business.id}`}>
                <path d={path} fill="none" stroke={dark?"rgba(112,77,221,.18)":"rgba(94,59,238,.13)"} strokeWidth=".8" strokeDasharray="4 7" className="commerce-dash"/>
                {!paused&&activeFlows.includes("referrals")&&<circle r="2.3" fill="#55D2A4" opacity=".8"><animateMotion dur={`${6+index*.25}s`} repeatCount="indefinite" begin={`${index*-.45}s`} path={path}/></circle>}
              </g>;
            })}
            <circle cx="500" cy="345" r="82" fill="url(#centerGlow)" className="commerce-center-aura"/>
          </svg>

          <button onClick={()=>setSelected(null)} className="commerce-center absolute z-20 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#9D83F8]/30 bg-gradient-to-br from-[#6E49ED]/85 to-[#2D1C62]/90 text-center shadow-[0_0_70px_rgba(105,70,232,.35)] backdrop-blur-xl" style={{left:"50%",top:"50%"}}><span><Image src="/nefe-logo-white.png" alt="" width={200} height={200} className="mx-auto h-10 w-10 object-contain" /><small className="mt-1 block text-[6px] font-bold uppercase tracking-[.16em] text-[#CDBEFF]">Commerce Core</small><i className="mx-auto mt-2 block h-1.5 w-1.5 rounded-full bg-[#5AD0A2] shadow-[0_0_10px_#5AD0A2]"/></span></button>

          {businesses.map(business=><button key={business.id} onClick={()=>setSelected(business)} className={`commerce-node absolute z-20 w-[132px] -translate-x-1/2 -translate-y-1/2 rounded-[17px] border p-2.5 text-left backdrop-blur-xl transition hover:z-30 hover:-translate-y-[55%] hover:scale-105 ${selected?.id===business.id?"border-[#9D83F8] ring-2 ring-[#7654E8]/20":dark?"border-white/10 bg-[#171224]/78 hover:border-white/20":"border-[#DED7E6] bg-white/85 hover:border-[#C9BCF6]"}`} style={{left:`${business.x/10}%`,top:`${business.y/6.9}%`}}>
            <span className="flex items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[7px] font-bold text-white shadow-lg" style={{background:`linear-gradient(135deg,${business.color},#33235f)`}}>{business.initials}</span><span className="min-w-0"><b className="block truncate text-[8px]">{business.name}</b><small className={`mt-1 block truncate text-[6px] ${dark?"text-white/35":"text-[#958E9B]"}`}>{business.category}</small></span></span><span className={`mt-2 flex items-center justify-between border-t pt-2 ${dark?"border-white/8":"border-[#EEEAF1]"}`}><small className={`text-[6px] ${dark?"text-white/25":"text-[#A39CA7]"}`}>Revenue</small><b className="text-[7px] text-[#58C99B]">{business.revenue}</b></span>
          </button>)}

          {hovered&&(()=>{
            const from=nodeMap[hovered.from] as Business; const to=nodeMap[hovered.to] as Business;
            return <div className={`pointer-events-none absolute z-50 w-48 -translate-x-1/2 -translate-y-[110%] rounded-xl border p-3 shadow-2xl backdrop-blur-xl ${dark?"border-white/10 bg-[#171223]/95":"border-[#DED7E5] bg-white/95"}`} style={{left:`${(from.x+to.x)/20}%`,top:`${(from.y+to.y)/13.8}%`}}><p className="truncate text-[8px] font-semibold">{from.name} → {to.name}</p><div className="mt-2 grid grid-cols-3 gap-2">{[["Referrals",hovered.referrals],["Revenue",hovered.revenue],["Conversion",hovered.conversion]].map(([l,v])=><div key={l}><p className={`text-[5px] ${dark?"text-white/30":"text-[#9B94A1]"}`}>{l}</p><p className="mt-1 text-[7px] font-bold">{v}</p></div>)}</div></div>;
          })()}
        </div>
        {selected&&<DetailDrawer business={selected} onClose={()=>setSelected(null)} dark={dark}/>}
        <div className={`absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border px-3 py-2 text-[7px] backdrop-blur ${dark?"border-white/8 bg-black/20 text-white/35":"border-[#E0D9E6] bg-white/75 text-[#8F8895]"}`}>Click any business to explore performance · Hover a connection for flow intelligence</div>
      </section>
    </div>
  </main>;
}
