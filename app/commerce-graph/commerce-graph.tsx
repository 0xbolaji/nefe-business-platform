"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BrandLogo from "../components/brand-logo";
import Image from "next/image";
import { RAK_SCENARIO, RAK_SCENARIO_ENTITIES, type ScenarioEntity } from "../lib/demo-scenario";

type Flow = "customers" | "referrals" | "rewards";

type Business = ScenarioEntity;

const businesses: Business[] = RAK_SCENARIO_ENTITIES;

type Connection = {
  from: string;
  to: string;
  referrals: string;
  revenue: string;
  conversion: string;
};

const connections: Connection[] = [
  { from:"resort",to:"hotel",referrals:"126",revenue:"AED 116,000",conversion:"14.2%" },
  { from:"hotel",to:"restaurant",referrals:"98",revenue:"AED 72,000",conversion:"12.8%" },
  { from:"restaurant",to:"beach",referrals:"64",revenue:"AED 41,000",conversion:"10.7%" },
  { from:"beach",to:"mobility",referrals:"72",revenue:"AED 48,000",conversion:"11.1%" },
  { from:"mobility",to:"anchor-hotel",referrals:"104",revenue:"AED 89,000",conversion:"13.1%" },
  { from:"anchor-hotel",to:"wellness",referrals:"58",revenue:"AED 37,000",conversion:"9.8%" },
  { from:"wellness",to:"retail",referrals:"42",revenue:"AED 24,000",conversion:"8.9%" },
  { from:"retail",to:"resort",referrals:"36",revenue:"AED 19,000",conversion:"8.2%" },
  { from:"resort",to:"mobility",referrals:"148",revenue:"AED 137,000",conversion:"15.6%" },
  { from:"hotel",to:"beach",referrals:"86",revenue:"AED 53,000",conversion:"11.9%" },
  { from:"beach",to:"wellness",referrals:"74",revenue:"AED 46,000",conversion:"12.1%" },
  { from:"restaurant",to:"anchor-hotel",referrals:"68",revenue:"AED 44,000",conversion:"10.3%" },
];

const counterData = [
  { label:"Participants Modeled", end:8, suffix:"", detail:"Destination pilot" },
  { label:"Projected Monthly Value", end:1.44, prefix:"AED ", suffix:"M", decimals:2, detail:"Illustrative" },
  { label:"Modeled Monthly Referrals", end:1730, suffix:"", detail:"Across 8 partners" },
  { label:"Repeat Visit Potential", end:38, suffix:"%", detail:"Modeled output" },
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
  const metrics = [["Modeled value",business.revenue],["Partner count",business.partners.toString()],["Campaigns",business.campaigns.toString()],["Modeled referrals",business.referrals]];
  return <div className={`commerce-drawer absolute inset-y-3 right-3 z-40 w-[min(370px,calc(100%-24px))] overflow-y-auto rounded-[24px] border p-5 shadow-2xl backdrop-blur-2xl ${dark?"border-white/10 bg-[#171224]/90 text-white":"border-[#DDD5E8] bg-white/92 text-[#19152A]"}`}>
    <div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-[15px] text-xs font-bold text-white shadow-lg" style={{background:`linear-gradient(135deg,${business.color},#33235f)`}}>{business.initials}</span><div><p className={`text-[8px] font-bold uppercase tracking-[.14em] ${dark?"text-white/35":"text-[#9991A1]"}`}>{business.category}</p><h2 className="mt-1 text-[17px] font-semibold">{business.name}</h2><p className="mt-1 flex items-center gap-1 text-[8px] text-[#C6A451]">● Sample pilot participant</p></div></div><button type="button" onClick={onClose} aria-label={`Close ${business.name} details`} className={`grid h-8 w-8 place-items-center rounded-full text-sm ${dark?"bg-white/10":"bg-[#F3F0F6]"}`}>×</button></div>
    <div className="mt-6 grid grid-cols-2 gap-2">{metrics.map(([label,value])=><div key={label} className={`rounded-[14px] border p-3 ${dark?"border-white/8 bg-white/[.045]":"border-[#ECE7F0] bg-[#FAF9FB]"}`}><p className={`text-[7px] ${dark?"text-white/35":"text-[#99929F]"}`}>{label}</p><p className="mt-1.5 text-[14px] font-bold">{value}</p></div>)}</div>
    <div className="mt-6"><div className="flex items-center justify-between"><h3 className="text-[10px] font-semibold">Modeled value trend</h3><span className="rounded-full bg-[#46B98D]/15 px-2 py-1 text-[7px] font-bold text-[#55C99B]">↗ 24.8%</span></div><div className="mt-4 flex h-20 items-end gap-1.5">{[28,34,31,46,52,48,63,68,76,72,88,98].map((h,i)=><i key={i} className="chart-bar flex-1 rounded-t" style={{height:`${h}%`,background:`linear-gradient(to top,${business.color}88,${business.color})`,animationDelay:`${i*45}ms`}} />)}</div></div>
    <div className="mt-6"><h3 className="text-[10px] font-semibold">Top bundles</h3><div className="mt-3 space-y-2">{business.bundles.map((bundle,i)=><div key={bundle} className={`flex items-center gap-3 rounded-xl border p-3 ${dark?"border-white/8 bg-white/[.035]":"border-[#ECE7F0]"}`}><span className="text-[9px] font-medium">{bundle}</span><span className="ml-auto text-[8px] text-[#55C99B]">+{18-i*3}%</span></div>)}</div></div>
    <Link href="/uae-opportunity-map" className="mt-6 block w-full rounded-xl bg-gradient-to-r from-[#6B47EA] to-[#8A65F3] py-3 text-center text-[9px] font-semibold text-white shadow-[0_10px_24px_rgba(94,59,238,.25)] transition hover:-translate-y-0.5">View opportunity map profile →</Link>
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
  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    setDark(!dark);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem("nefe-theme", next);
    window.dispatchEvent(new CustomEvent("nefe-theme-change", { detail: next }));
  };

  useEffect(() => {
    const syncTheme = () => setDark(document.documentElement.dataset.theme === "dark");
    syncTheme();
    window.addEventListener("nefe-theme-change", syncTheme);
    return () => window.removeEventListener("nefe-theme-change", syncTheme);
  }, []);

  return <main className={`commerce-page min-h-screen transition-colors duration-500 ${dark?"commerce-dark bg-[#090710] text-white":"commerce-light bg-[#F5F2F8] text-[#171226]"}`}>
    <header className={`relative z-30 border-b backdrop-blur-xl ${dark?"border-white/[.07] bg-[#0B0813]/75":"border-[#E3DDE9] bg-white/75"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-7 lg:px-10"><div className="flex items-center gap-5"><Logo dark={dark}/><span className={`hidden h-6 w-px sm:block ${dark?"bg-white/10":"bg-[#DED7E5]"}`}/><div className="hidden sm:block"><p className={`text-[9px] ${dark?"text-white/30":"text-[#9B94A2]"}`}>Sample RAK scenario</p><p className="text-xs font-semibold">Commerce Graph</p></div></div><div className="flex items-center gap-2"><button type="button" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`} className={`grid h-9 w-9 place-items-center rounded-xl border text-sm ${dark?"border-white/10 bg-white/[.06] text-[#E9D27E]":"border-[#E0DAE6] bg-white text-[#5E3BEE]"}`}>{dark?"☼":"☾"}</button><Link href="/executive-insights" className={`hidden rounded-xl px-3 py-2.5 text-[9px] font-semibold md:block ${dark?"text-white/55 hover:bg-white/5 hover:text-white":"text-[#665F6E] hover:bg-white"}`}>Executive Insights</Link><Link href="/business-portal" className={`rounded-xl border px-4 py-2.5 text-[9px] font-semibold ${dark?"border-white/10 bg-white/[.06] text-white/75":"border-[#DED7E5] bg-white"}`}>← Business Portal</Link></div></div>
    </header>

    <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-7 sm:px-7 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className={`flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[8px] font-bold uppercase tracking-[.16em] ${dark?"border-[#7255CD]/35 bg-[#5E3BEE]/10 text-[#BDA9FF]":"border-[#D9CEF8] bg-white text-[#5E3BEE]"}`}><span className="h-2 w-2 rounded-full bg-[#C6A451]"/> {RAK_SCENARIO.label}</div><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-[40px]">Commerce Graph</h1><p className={`mt-2 max-w-2xl text-[11px] leading-5 ${dark?"text-white/40":"text-[#817A88]"}`}>Nodes represent pilot participants; connections show modeled referral paths and relative relationship strength. Missing or weaker links reveal opportunity gaps in the destination journey.</p><p className={`mt-2 max-w-2xl text-[7px] leading-4 ${dark?"text-white/25":"text-[#99929F]"}`}>{RAK_SCENARIO.disclaimer}</p></div><div className={`flex w-fit items-center gap-1 rounded-xl border p-1 ${dark?"border-white/8 bg-white/[.04]":"border-[#E0DAE6] bg-white"}`}><button onClick={()=>setPaused(!paused)} className={`rounded-lg px-3 py-2 text-[8px] font-semibold ${paused?"bg-[#D2A747]/15 text-[#E0BB62]":"bg-[#5E3BEE]/15 text-[#A98EFF]"}`}>{paused?"▶ Resume":"Ⅱ Pause"}</button>{(["customers","referrals","rewards"] as Flow[]).map((flow,i)=><button key={flow} onClick={()=>toggleFlow(flow)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[8px] font-semibold capitalize transition ${activeFlows.includes(flow)?(dark?"bg-white/8 text-white":"bg-[#F0ECFF] text-[#5E3BEE]"):(dark?"text-white/25":"text-[#AAA3AF]")}`}><i className="h-1.5 w-1.5 rounded-full" style={{background:["#B19AFB","#53CBA0","#E2BE68"][i]}}/>{flow}</button>)}</div></div>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{counterData.map(counter=><article key={counter.label} className={`commerce-glass rounded-[18px] border p-4 ${dark?"border-white/[.07] bg-white/[.035]":"border-[#E3DDE8] bg-white/80"}`}><div className="flex items-center justify-between"><p className={`text-[8px] font-medium ${dark?"text-white/35":"text-[#8D8693]"}`}>{counter.label}</p><span className="relative flex h-2 w-2"><i className="absolute h-full w-full animate-ping rounded-full bg-[#51C99B] opacity-30"/><i className="relative h-2 w-2 rounded-full bg-[#51C99B]"/></span></div><p className="mt-2 text-xl font-semibold tracking-[-.035em] sm:text-2xl"><Counter end={counter.end} prefix={counter.prefix} suffix={counter.suffix} decimals={counter.decimals}/></p><div className="mt-3 flex items-center gap-2"><span className="rounded-full bg-[#46B98D]/12 px-2 py-1 text-[7px] font-bold text-[#4DBF91]">{counter.detail}</span><span className={`text-[7px] ${dark?"text-white/20":"text-[#AAA3AF]"}`}>modeled</span></div></article>)}</section>

      <section className={`relative mt-4 min-h-[690px] overflow-hidden rounded-[30px] border ${dark?"border-white/[.07] bg-[#0D0916]/80 shadow-[0_35px_100px_rgba(0,0,0,.35)]":"border-[#E2DCE7] bg-white/75 shadow-[0_30px_80px_rgba(55,38,80,.1)]"}`}>
        <div className="commerce-orb one"/><div className="commerce-orb two"/><div className="commerce-grid absolute inset-0 opacity-40"/>
        <div className={`absolute left-5 top-5 z-20 rounded-xl border px-3 py-2 backdrop-blur ${dark?"border-white/8 bg-black/20":"border-[#E1DAE7] bg-white/70"}`}><p className={`text-[7px] font-bold uppercase tracking-[.14em] ${dark?"text-white/25":"text-[#9C95A2]"}`}>Modeled network activity</p><div className="mt-2 flex gap-4">{[["12","journey links"],["AED 1.44M","monthly value"],["92%","pilot readiness"]].map(([v,l])=><div key={l}><p className="text-[10px] font-bold">{v}</p><p className={`text-[6px] ${dark?"text-white/25":"text-[#AAA3AF]"}`}>{l}</p></div>)}</div></div>

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
            <span className="flex items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[7px] font-bold text-white shadow-lg" style={{background:`linear-gradient(135deg,${business.color},#33235f)`}}>{business.initials}</span><span className="min-w-0"><b className="block truncate text-[8px]">{business.name}</b><small className={`mt-1 block truncate text-[6px] ${dark?"text-white/35":"text-[#958E9B]"}`}>{business.category}</small></span></span><span className={`mt-2 flex items-center justify-between border-t pt-2 ${dark?"border-white/8":"border-[#EEEAF1]"}`}><small className={`text-[6px] ${dark?"text-white/25":"text-[#A39CA7]"}`}>Modeled value</small><b className="text-[7px] text-[#58C99B]">{business.revenue}</b></span>
          </button>)}

          {hovered&&(()=>{
            const from=nodeMap[hovered.from] as Business; const to=nodeMap[hovered.to] as Business;
            return <div className={`pointer-events-none absolute z-50 w-48 -translate-x-1/2 -translate-y-[110%] rounded-xl border p-3 shadow-2xl backdrop-blur-xl ${dark?"border-white/10 bg-[#171223]/95":"border-[#DED7E5] bg-white/95"}`} style={{left:`${(from.x+to.x)/20}%`,top:`${(from.y+to.y)/13.8}%`}}><p className="truncate text-[8px] font-semibold">{from.name} → {to.name}</p><div className="mt-2 grid grid-cols-3 gap-2">{[["Referrals",hovered.referrals],["Modeled value",hovered.revenue],["Conversion",hovered.conversion]].map(([l,v])=><div key={l}><p className={`text-[5px] ${dark?"text-white/30":"text-[#9B94A1]"}`}>{l}</p><p className="mt-1 text-[7px] font-bold">{v}</p></div>)}</div></div>;
          })()}
        </div>
        {selected&&<DetailDrawer business={selected} onClose={()=>setSelected(null)} dark={dark}/>}
        <div className={`absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border px-3 py-2 text-[7px] backdrop-blur ${dark?"border-white/8 bg-black/20 text-white/35":"border-[#E0D9E6] bg-white/75 text-[#8F8895]"}`}>Click any business to explore performance · Hover a connection for flow intelligence</div>
      </section>
    </div>
  </main>;
}
