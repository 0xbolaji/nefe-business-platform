"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLogo from "../components/brand-logo";

const flywheel = [
  { title:"Business joins", detail:"A verified merchant enters the NEFE ecosystem.", metric:"+1 merchant", icon:"B" },
  { title:"Campaign created", detail:"Complementary businesses launch a shared offer.", metric:"+1 activation", icon:"C" },
  { title:"Customer participates", detail:"A customer discovers and purchases the experience.", metric:"+1 transaction", icon:"P" },
  { title:"Rewards issued", detail:"Value is recognized across the connected journey.", metric:"+1 utility event", icon:"R" },
  { title:"More partners join", detail:"Visible results attract adjacent businesses.", metric:"+3 new partners", icon:"+" },
  { title:"More activity generated", detail:"The network compounds commercial interactions.", metric:"+22% activity", icon:"↗" },
];

const botchainBenefits = [
  ["Infrastructure usage","Real merchant and customer interactions create persistent demand for underlying rails.","01"],
  ["Merchant ecosystem","NEFE becomes an adoption surface for premium businesses across multiple industries.","02"],
  ["Developer activity","APIs, intelligence products and enterprise integrations invite an expanding builder ecosystem.","03"],
  ["Long-term utility","Network value is tied to useful commercial activity rather than speculative participation.","04"],
];

const nefeBenefits = [
  ["Business subscriptions","Recurring software revenue funds the network before transaction infrastructure is required.","01"],
  ["Consumer growth","Connected experiences create a differentiated reason for customers to join and return.","02"],
  ["Rewards","A shared benefit layer recognizes valuable behavior across the entire ecosystem.","03"],
  ["Future payment layer","Transaction infrastructure can be introduced quietly when merchant value is already proven.","04"],
  ["Enterprise adoption","Groups, destinations and platforms gain one orchestration layer for connected commerce.","05"],
];

function Logo({ light=false }: { light?:boolean }) {
  return <BrandLogo variant={light ? "white" : "purple"} priority />;
}

function Label({ number,children,dark=false }: { number:string; children:React.ReactNode; dark?:boolean }) {
  return <div className={`flex items-center gap-3 text-[9px] font-bold uppercase tracking-[.18em] ${dark?"text-[#BCA8FA]":"text-[#694BD4]"}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-[7px] ${dark?"bg-white/10":"bg-[#EFEAFF]"}`}>{number}</span>{children}</div>;
}

export default function WhyBotchain() {
  const [active,setActive] = useState(0);
  const [paused,setPaused] = useState(false);

  useEffect(()=>{
    if(paused) return;
    const timer=window.setInterval(()=>setActive(value=>(value+1)%flywheel.length),2200);
    return()=>window.clearInterval(timer);
  },[paused]);

  return <main className="overflow-hidden bg-[#FAF9FB] text-[#181322]">
    <header className="absolute inset-x-0 top-0 z-40"><div className="mx-auto flex h-24 max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12"><Logo/><div className="flex items-center gap-3"><span className="hidden rounded-full border border-[#DDD5E7] bg-white/55 px-3 py-2 text-[8px] font-bold uppercase tracking-[.14em] text-[#756D7D] backdrop-blur sm:block">Strategic partner brief</span><Link href="/founder-room" className="hidden text-[9px] font-semibold text-[#655D6D] transition hover:text-[#5E3BEE] md:block">Founder Room</Link><Link href="/portal" className="rounded-xl bg-[#21172F] px-4 py-2.5 text-[9px] font-semibold text-white shadow-lg">Enter platform →</Link></div></div></header>

    <section className="botchain-hero relative grid min-h-[90vh] place-items-center px-5 pb-20 pt-32 text-center">
      <div className="founder-grid absolute inset-0"/><div className="botchain-orb one"/><div className="botchain-orb two"/>
      <div className="relative z-10 mx-auto max-w-[1030px]"><div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#DCD2FA] bg-white/65 px-3 py-2 text-[8px] font-bold uppercase tracking-[.16em] text-[#5E3BEE] shadow-sm backdrop-blur"><span className="text-[#C4993F]">✦</span>NEFE × Botchain</div><p className="mt-8 text-[10px] font-bold uppercase tracking-[.22em] text-[#9B93A3]">Shared Vision</p><h1 className="mt-5 text-[46px] font-semibold leading-[1.04] tracking-[-.06em] sm:text-[70px] lg:text-[88px]">Infrastructure meets<br/><span className="gradient-text">real-world commerce.</span></h1><p className="mx-auto mt-8 max-w-[720px] text-base leading-8 text-[#6F6876] sm:text-lg">NEFE creates the merchant adoption, business activity and customer utility that gives future transaction infrastructure a meaningful commercial purpose.</p><div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="#flywheel" className="inline-flex h-13 items-center gap-2 rounded-xl bg-[#5E3BEE] px-6 text-[10px] font-semibold text-white shadow-[0_15px_35px_rgba(94,59,238,.25)] transition hover:-translate-y-1">See the merchant flywheel <span>↓</span></Link><Link href="/commerce-graph" className="inline-flex h-13 items-center rounded-xl border border-[#DDD7E4] bg-white/70 px-6 text-[10px] font-semibold text-[#504956] backdrop-blur transition hover:-translate-y-1">View live Commerce Graph</Link></div></div>
    </section>

    <section className="mx-auto max-w-[1240px] px-5 py-28 sm:px-8 sm:py-36">
      <Label number="01">The Strategic Fit</Label><div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">Utility begins with activity.<br/><span className="text-[#9B94A1]">Activity begins with merchants.</span></h2><p className="max-w-sm text-[11px] leading-6 text-[#807985]">The strongest infrastructure is the infrastructure businesses use because it solves a commercial problem—not because they understand the technology beneath it.</p></div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
        ["Real-world commerce","Every campaign, referral and reward begins with a genuine customer and business interaction.","01","#7353E7"],
        ["Merchant adoption","Businesses join for revenue growth, giving infrastructure a practical path into daily operations.","02","#C39845"],
        ["Business activity","Connected journeys create recurring, measurable events across an expanding merchant network.","03","#4FA78A"],
        ["Future transaction infrastructure","Once value is proven, payment and settlement rails can become quietly embedded.","04","#557BCD"],
      ].map(([title,detail,n,color])=><article key={title} className="group rounded-[24px] border border-[#E8E3EB] bg-white p-6 shadow-[0_6px_24px_rgba(43,30,66,.03)] transition hover:-translate-y-2 hover:border-[#D2C6F7] hover:shadow-[0_20px_48px_rgba(53,36,96,.09)]"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-[14px] text-white shadow-lg" style={{background:color}}>✦</span><span className="text-[9px] font-bold text-[#B1AAB6]">{n}</span></div><h3 className="mt-8 text-[16px] font-semibold">{title}</h3><p className="mt-3 text-[9px] leading-5 text-[#817A86]">{detail}</p><div className="mt-6 h-1 overflow-hidden rounded-full bg-[#F0EDF3]"><div className="botchain-card-line h-full rounded-full" style={{background:color}}/></div></article>)}</div>
    </section>

    <section id="flywheel" className="relative overflow-hidden bg-[#0D0914] py-28 text-white sm:py-36">
      <div className="founder-dark-grid absolute inset-0"/><div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><Label number="02" dark>Merchant Flywheel</Label><h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">Commercial value compounds<br/>into infrastructure utility.</h2></div><div className="flex items-center gap-2"><button onClick={()=>setPaused(!paused)} className="rounded-xl border border-white/10 bg-white/[.05] px-3 py-2.5 text-[8px] font-semibold text-white/60">{paused?"▶ Play flywheel":"Ⅱ Pause"}</button><span className="rounded-xl border border-[#7152CD]/30 bg-[#5E3BEE]/10 px-3 py-2.5 text-[8px] font-bold text-[#BBA6F8]">Cycle {active+1} of {flywheel.length}</span></div></div>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div className="botchain-wheel relative mx-auto aspect-square w-full max-w-[650px]">
            <svg viewBox="0 0 650 650" className="absolute inset-0 h-full w-full"><defs><filter id="botGlow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="325" cy="325" r="225" fill="none" stroke="rgba(143,111,229,.18)" strokeWidth="1"/><circle cx="325" cy="325" r="174" fill="none" stroke="rgba(143,111,229,.10)" strokeWidth="1" strokeDasharray="5 8" className="commerce-dash"/>{flywheel.map((_,i)=>{const a=-Math.PI/2+i*Math.PI/3;const b=-Math.PI/2+(i+1)*Math.PI/3;const x1=325+225*Math.cos(a),y1=325+225*Math.sin(a),x2=325+225*Math.cos(b),y2=325+225*Math.sin(b);const path=`M${x1} ${y1} A225 225 0 0 1 ${x2} ${y2}`;return <g key={i}><path d={path} fill="none" stroke={i===active?"#8D6BEE":"rgba(141,107,238,.16)"} strokeWidth={i===active?3:1.2} className="transition-all"/><circle r="4" fill={i%2?"#E1BD67":"#5AD0A1"} filter="url(#botGlow)"><animateMotion dur="4s" repeatCount="indefinite" begin={`${i*-.65}s`} path={path}/></circle></g>})}</svg>
            <div className="botchain-core absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#8B6CE9]/30 bg-gradient-to-br from-[#5F3ED0] to-[#25164E] text-center shadow-[0_0_100px_rgba(99,62,213,.34)]"><div><span className="text-2xl text-[#E2C26D]">✦</span><b className="mt-2 block text-lg">Merchant<br/>Activity</b><small className="mt-2 block text-[6px] uppercase tracking-[.15em] text-[#BEABF4]">Compounding utility</small></div></div>
            {flywheel.map((step,i)=>{const angle=-90+i*60;const radius=43;const x=50+radius*Math.cos(angle*Math.PI/180);const y=50+radius*Math.sin(angle*Math.PI/180);return <button key={step.title} onClick={()=>{setActive(i);setPaused(true)}} className={`absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-[17px] border p-3 text-center backdrop-blur-xl transition ${active===i?"z-20 scale-110 border-[#9B7CF3] bg-[#5E3BEE]/25 shadow-[0_0_35px_rgba(101,65,218,.25)]":"border-white/10 bg-white/[.055] hover:border-white/20"}`} style={{left:`${x}%`,top:`${y}%`}}><span className={`mx-auto grid h-8 w-8 place-items-center rounded-[10px] text-[8px] font-bold ${active===i?"bg-[#7452E0] text-white":"bg-white/10 text-[#C9B9F8]"}`}>{step.icon}</span><span className="mt-2 block text-[8px] font-semibold">{step.title}</span></button>})}
          </div>
          <div><span className="text-[8px] font-bold uppercase tracking-[.16em] text-[#A68FF0]">Active flywheel event</span><div key={active} className="prototype-modal mt-4 rounded-[24px] border border-white/10 bg-white/[.055] p-6 backdrop-blur"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-[15px] bg-gradient-to-br from-[#7150DD] to-[#A77BC6] text-sm font-bold">{flywheel[active].icon}</span><span className="rounded-full bg-[#4BC293]/15 px-3 py-2 text-[8px] font-bold text-[#62D0A4]">{flywheel[active].metric}</span></div><p className="mt-8 text-[9px] font-bold uppercase tracking-[.14em] text-white/30">Step 0{active+1}</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.035em]">{flywheel[active].title}</h3><p className="mt-4 text-[11px] leading-6 text-white/45">{flywheel[active].detail}</p><div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#7653E6] to-[#E0BD67] transition-all duration-500" style={{width:`${(active+1)/flywheel.length*100}%`}}/></div></div><p className="mt-6 text-[10px] leading-5 text-white/35">Each completed cycle increases merchant density, customer relevance and the number of commercially useful infrastructure events.</p></div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1240px] px-5 py-28 sm:px-8 sm:py-36"><Label number="03">Benefits for Botchain</Label><div className="mt-5 grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><div><h2 className="text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">Infrastructure that businesses choose to use.</h2><p className="mt-6 max-w-md text-[11px] leading-6 text-[#7D7682]">NEFE offers Botchain a credible route from infrastructure capability to active merchants, developers and long-term commercial utility.</p><div className="mt-9 rounded-[22px] bg-gradient-to-br from-[#1E152F] to-[#5031B7] p-6 text-white shadow-[0_20px_48px_rgba(68,40,150,.2)]"><p className="text-[8px] font-bold uppercase tracking-[.15em] text-[#C8B8F9]">Illustrative network at scale</p><p className="mt-3 text-4xl font-semibold tracking-[-.04em]">48.3M</p><p className="mt-2 text-[8px] text-white/40">annual commercial infrastructure events</p><div className="mt-5 grid grid-cols-2 gap-2">{[["12,500","Merchants"],["4.8M","Customers"]].map(([v,l])=><div key={l} className="rounded-xl bg-white/[.07] p-3"><p className="text-sm font-bold">{v}</p><p className="mt-1 text-[7px] text-white/35">{l}</p></div>)}</div></div></div>
        <div className="grid gap-3 sm:grid-cols-2">{botchainBenefits.map(([title,detail,n],i)=><article key={title} className="group rounded-[22px] border border-[#E7E2EA] bg-white p-5 transition hover:-translate-y-1 hover:border-[#CEC1F6] hover:shadow-[0_16px_38px_rgba(53,36,96,.08)]"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#F0EBFF] text-[#5E3BEE]">✦</span><span className="text-[9px] font-bold text-[#AFA8B4]">{n}</span></div><h3 className="mt-7 text-[15px] font-semibold">{title}</h3><p className="mt-3 text-[9px] leading-5 text-[#817A86]">{detail}</p><div className="mt-5 flex items-center gap-2 text-[7px] font-bold text-[#5E3BEE]"><i className="h-1.5 w-1.5 rounded-full bg-[#50B98F]"/>Strategic value 0{i+1}</div></article>)}</div></div></section>

    <section className="border-y border-[#E6E1E9] bg-[#F2EFF5] py-28 sm:py-36"><div className="mx-auto max-w-[1240px] px-5 sm:px-8"><Label number="04">Benefits for NEFE</Label><div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">A commercial platform first.<br/><span className="gradient-text">Infrastructure-ready by design.</span></h2><p className="max-w-sm text-[11px] leading-6 text-[#7D7682]">NEFE can create immediate software value while preserving a clear path toward embedded infrastructure as the ecosystem matures.</p></div><div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{nefeBenefits.map(([title,detail,n],i)=><article key={title} className="rounded-[21px] border border-[#E3DEE7] bg-white p-5 shadow-[0_6px_20px_rgba(45,31,69,.025)] transition hover:-translate-y-2 hover:border-[#CEC1F6] hover:shadow-[0_18px_42px_rgba(53,36,96,.08)]"><span className="text-[9px] font-bold text-[#ADA6B2]">{n}</span><div className={`mt-8 grid h-9 w-9 place-items-center rounded-xl ${i===3?"bg-[#FFF2D7] text-[#A87A22]":"bg-[#EFEAFF] text-[#5E3BEE]"}`}>✦</div><h3 className="mt-5 text-[13px] font-semibold">{title}</h3><p className="mt-3 text-[8px] leading-4 text-[#817A86]">{detail}</p></article>)}</div></div></section>

    <section className="relative overflow-hidden bg-white py-28 sm:py-36"><div className="botchain-architecture-orb"/><div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8"><Label number="05">Shared Architecture</Label><div className="mt-5 grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><h2 className="text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">Complex underneath.<br/><span className="text-[#9A93A0]">Simple at the surface.</span></h2><p className="mt-6 max-w-md text-[11px] leading-6 text-[#7D7682]">Businesses see customers, campaigns, partners and revenue. The infrastructure layer can handle identity, rewards, settlement and verification without changing the merchant experience.</p></div><div className="space-y-3">{[
          ["Merchant experience","Profiles · campaigns · referrals · analytics","bg-[#5E3BEE] text-white"],
          ["NEFE orchestration","Intelligence · rewards · membership · enterprise APIs","bg-[#F0EBFF] text-[#5E3BEE]"],
          ["Botchain infrastructure","Verification · utility events · future transaction rails","bg-[#20162F] text-white"],
        ].map(([title,detail,tone],i)=><div key={title}><div className={`rounded-[18px] p-5 ${tone}`}><div className="flex items-center justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.14em] opacity-50">Layer 0{i+1}</p><h3 className="mt-2 text-[14px] font-semibold">{title}</h3></div><p className="max-w-xs text-right text-[8px] leading-4 opacity-60">{detail}</p></div></div>{i<2&&<div className="mx-auto h-5 w-px bg-gradient-to-b from-[#B4A5E3] to-[#D9D2DE]"/>}</div>)}</div></div></div></section>

    <section className="botchain-close relative grid min-h-[80vh] place-items-center overflow-hidden bg-[#09070E] px-5 py-28 text-center text-white"><div className="founder-dark-grid absolute inset-0"/><div className="founder-vision-orb"/><div className="relative z-10 mx-auto max-w-[1050px]"><span className="text-2xl text-[#E1C16B]">✦</span><p className="mt-7 text-[9px] font-bold uppercase tracking-[.2em] text-[#A88FF1]">The shared opportunity</p><h2 className="mt-8 text-[36px] font-semibold leading-[1.18] tracking-[-.05em] sm:text-[54px] lg:text-[66px]">This platform allows blockchain infrastructure to support commercial activity <span className="text-[#C7B6FA]">without requiring businesses to understand blockchain first.</span></h2><div className="mx-auto mt-12 h-px w-44 bg-gradient-to-r from-transparent via-[#8161E2] to-transparent"/><div className="mt-10 flex items-center justify-center gap-4"><Logo light/><span className="text-lg text-white/15">×</span><span className="text-[12px] font-semibold tracking-[.08em] text-white/70">BOTCHAIN</span></div></div></section>
  </main>;
}
