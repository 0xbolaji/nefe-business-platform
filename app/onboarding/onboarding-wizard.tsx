"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BrandLogo from "../components/brand-logo";

const industries = [
  ["Hotels","Boutique, luxury and resort hospitality","HT"],
  ["Restaurants","Dining, cafés and culinary concepts","RS"],
  ["Retail","Luxury, lifestyle and specialist retail","RT"],
  ["Mobility","Car rental, transfers and transport","MB"],
  ["Wellness","Spa, fitness and beauty businesses","WL"],
  ["Healthcare","Clinics and premium medical services","HC"],
  ["Entertainment","Events, venues and experiences","EN"],
  ["Real Estate","Residential and commercial property","RE"],
];

const goals = [
  ["More customers","Reach high-intent customers from trusted partners.","↗"],
  ["Referrals","Build a measurable flow of customer introductions.","⇄"],
  ["Loyalty","Give customers more reasons to return and stay connected.","♡"],
  ["Packages","Create premium bundled experiences across businesses.","◇"],
  ["Rewards","Share meaningful benefits throughout the ecosystem.","✦"],
];

const recommendedPartners = [
  { name:"The Celeste Dubai", category:"Luxury Hotel", location:"Palm Jumeirah", score:96, initials:"CD", color:"from-[#5E3BEE] to-[#9A7CF5]" },
  { name:"Maison D'Or", category:"Fine Dining", location:"DIFC", score:94, initials:"MD", color:"from-[#9E7029] to-[#D9B362]" },
  { name:"Aurum Drive", category:"Luxury Mobility", location:"Downtown Dubai", score:91, initials:"AD", color:"from-[#343B4B] to-[#7A8190]" },
  { name:"Serein Wellness", category:"Premium Spa", location:"Jumeirah", score:89, initials:"SW", color:"from-[#A65F7D] to-[#DB9EB5]" },
];

function Logo() {
  return <BrandLogo priority />;
}

export default function OnboardingWizard() {
  const [step,setStep] = useState(1);
  const [analyzing,setAnalyzing] = useState(false);
  const [business,setBusiness] = useState({ name:"", website:"", location:"Dubai, UAE", customers:"1,000–5,000 monthly customers" });
  const [industry,setIndustry] = useState("Hotels");
  const [selectedGoals,setSelectedGoals] = useState(["More customers","Referrals","Packages"]);
  const [selectedPartners,setSelectedPartners] = useState(["The Celeste Dubai","Maison D'Or","Aurum Drive"]);
  const progress=step/5*100;

  const projections=useMemo(()=>{
    const factor=selectedGoals.length;
    return { revenue:138000+factor*18000, referrals:246+factor*60 };
  },[selectedGoals]);

  function toggleGoal(goal:string) {
    setSelectedGoals(items=>items.includes(goal)?(items.length>1?items.filter(item=>item!==goal):items):[...items,goal]);
  }

  function next() {
    if(step===3){
      setAnalyzing(true);
      window.setTimeout(()=>{setAnalyzing(false);setStep(4)},1050);
      return;
    }
    setStep(current=>Math.min(5,current+1));
  }

  if(analyzing) return <main className="onboarding-page grid min-h-screen place-items-center px-5 text-[#19152A]"><div className="text-center"><div className="onboarding-ai mx-auto grid h-20 w-20 place-items-center rounded-[24px] bg-gradient-to-br from-[#5E3BEE] to-[#8E6BEA] text-3xl text-[#E8CE79] shadow-[0_20px_50px_rgba(94,59,238,.28)]">✦</div><h1 className="mt-7 text-2xl font-semibold tracking-[-.04em]">Finding your highest-value partners...</h1><p className="mt-2 text-[11px] text-[#8D8693]">Analyzing industry fit, audience overlap and commercial potential</p><div className="mx-auto mt-7 h-1.5 w-72 overflow-hidden rounded-full bg-[#E8E3EC]"><div className="experience-progress h-full rounded-full bg-gradient-to-r from-[#5E3BEE] to-[#D0A648]"/></div><div className="mt-8 flex justify-center gap-2">{["Industry profile","Customer signals","Partner compatibility"].map((item,i)=><span key={item} className="rounded-full border border-[#E5E0E9] bg-white/70 px-3 py-2 text-[7px] font-semibold text-[#746D7A]" style={{animationDelay:`${i*200}ms`}}>✓ {item}</span>)}</div></div></main>;

  return <main className="onboarding-page min-h-screen text-[#19152A]">
    <header className="relative z-20 mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:px-8"><Logo/><div className="flex items-center gap-3"><span className="hidden text-[9px] text-[#96909C] sm:block">Already a partner?</span><Link href="/portal" className="rounded-xl border border-[#E1DCE6] bg-white/75 px-4 py-2.5 text-[9px] font-semibold text-[#5B5463] shadow-sm backdrop-blur transition hover:border-[#C8BAF6] hover:text-[#5E3BEE]">View portal</Link></div></header>

    <div className="relative z-10 mx-auto max-w-[1080px] px-5 pb-16 pt-5 sm:px-8">
      <div className="mx-auto max-w-[820px]">
        <div className="flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#6C50D4]">Business onboarding</p><p className="text-[9px] font-semibold text-[#8E8794]">Step {step} of 5</p></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E8E3EC]"><div className="h-full rounded-full bg-gradient-to-r from-[#5E3BEE] via-[#8A6AEA] to-[#D0A647] transition-all duration-500 ease-out" style={{width:`${progress}%`}}/></div>
        <div className="mt-3 flex justify-between">{["Business","Industry","Goals","Partners","Complete"].map((item,i)=><span key={item} className={`text-[7px] font-semibold transition ${step>=i+1?"text-[#5E3BEE]":"text-[#B0AAB4]"}`}>{item}</span>)}</div>
      </div>

      <section className="prototype-modal mx-auto mt-8 max-w-[820px] overflow-hidden rounded-[28px] border border-white/70 bg-white/88 shadow-[0_30px_90px_rgba(50,33,88,.13)] backdrop-blur-2xl">
        {step===1&&<div className="p-6 sm:p-9"><div className="flex items-start justify-between gap-4"><div><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#F0ECFF] text-lg text-[#5E3BEE]">◇</span><h1 className="mt-5 text-2xl font-semibold tracking-[-.04em] sm:text-[30px]">Tell us about your business.</h1><p className="mt-2 text-[11px] leading-5 text-[#89828F]">This helps NEFE build a relevant profile for your ecosystem debut.</p></div><span className="hidden rounded-full bg-[#EAF9F2] px-3 py-2 text-[8px] font-bold text-[#158F66] sm:block">Takes 2 minutes</span></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="onboarding-field sm:col-span-2"><span>Business name</span><input autoFocus value={business.name} onChange={event=>setBusiness({...business,name:event.target.value})} placeholder="e.g. Celeste Hospitality Group"/></label><label className="onboarding-field"><span>Website</span><input value={business.website} onChange={event=>setBusiness({...business,website:event.target.value})} placeholder="www.yourbusiness.com"/></label><label className="onboarding-field"><span>Primary location</span><input value={business.location} onChange={event=>setBusiness({...business,location:event.target.value})}/></label><label className="onboarding-field sm:col-span-2"><span>Customer volume</span><select value={business.customers} onChange={event=>setBusiness({...business,customers:event.target.value})}><option>Under 1,000 monthly customers</option><option>1,000–5,000 monthly customers</option><option>5,000–20,000 monthly customers</option><option>20,000+ monthly customers</option></select></label></div>
        </div>}

        {step===2&&<div className="p-6 sm:p-9"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#FFF3DA] text-lg text-[#A77A24]">✦</span><h1 className="mt-5 text-2xl font-semibold tracking-[-.04em] sm:text-[30px]">Choose your industry.</h1><p className="mt-2 text-[11px] text-[#89828F]">We&apos;ll use this to identify the strongest adjacent business categories.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{industries.map(([name,detail,initials])=><button key={name} onClick={()=>setIndustry(name)} className={`flex items-center gap-3 rounded-[17px] border p-3.5 text-left transition hover:-translate-y-0.5 ${industry===name?"border-[#BFAFF4] bg-[#F7F4FF] shadow-[0_8px_20px_rgba(68,43,137,.06)]":"border-[#E9E5ED] hover:border-[#D7CDE0]"}`}><span className={`grid h-10 w-10 place-items-center rounded-[12px] text-[8px] font-bold ${industry===name?"bg-[#5E3BEE] text-white":"bg-[#F1EEF4] text-[#756E7C]"}`}>{initials}</span><span className="flex-1"><b className="block text-[10px]">{name}</b><small className="mt-1 block text-[7px] text-[#96909C]">{detail}</small></span><span className={`grid h-5 w-5 place-items-center rounded-full border text-[9px] ${industry===name?"border-[#5E3BEE] bg-[#5E3BEE] text-white":"border-[#DAD4DE] text-transparent"}`}>✓</span></button>)}</div></div>}

        {step===3&&<div className="p-6 sm:p-9"><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#EAF9F2] text-lg text-[#168E66]">↗</span><h1 className="mt-5 text-2xl font-semibold tracking-[-.04em] sm:text-[30px]">What should partnerships unlock?</h1><p className="mt-2 text-[11px] text-[#89828F]">Select every goal that matters. NEFE will optimize recommendations around them.</p><div className="mt-7 space-y-3">{goals.map(([goal,detail,icon])=>{const active=selectedGoals.includes(goal);return <button key={goal} onClick={()=>toggleGoal(goal)} className={`flex w-full items-center gap-4 rounded-[17px] border p-4 text-left transition hover:-translate-y-0.5 ${active?"border-[#BFAFF4] bg-gradient-to-r from-[#F7F4FF] to-[#FFFBF1] shadow-[0_8px_20px_rgba(68,43,137,.05)]":"border-[#E8E4EC]"}`}><span className={`grid h-10 w-10 place-items-center rounded-[12px] text-base ${active?"bg-[#5E3BEE] text-white":"bg-[#F2EFF4] text-[#7F7785]"}`}>{icon}</span><span className="flex-1"><b className="block text-[11px]">{goal}</b><small className="mt-1 block text-[8px] text-[#96909C]">{detail}</small></span><span className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] ${active?"border-[#5E3BEE] bg-[#5E3BEE] text-white":"border-[#D9D3DD] text-transparent"}`}>✓</span></button>})}</div></div>}

        {step===4&&<div className="p-6 sm:p-9"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><span className="grid h-11 w-11 place-items-center rounded-[14px] bg-gradient-to-br from-[#5E3BEE] to-[#8D6AEA] text-lg text-[#E7CC75] shadow-[0_8px_20px_rgba(94,59,238,.2)]">✦</span><h1 className="mt-5 text-2xl font-semibold tracking-[-.04em] sm:text-[30px]">Your partner network is ready.</h1><p className="mt-2 text-[11px] text-[#89828F]">AI-ranked using compatibility, customer overlap and revenue potential.</p></div><div className="rounded-[16px] border border-[#DDD3F8] bg-[#F5F1FF] px-4 py-3 text-center"><p className="text-2xl font-bold text-[#5E3BEE]">12</p><p className="mt-1 text-[7px] font-semibold text-[#746A84]">compatible businesses found</p></div></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">{recommendedPartners.map(partner=>{const active=selectedPartners.includes(partner.name);return <button key={partner.name} onClick={()=>setSelectedPartners(items=>items.includes(partner.name)?items.filter(item=>item!==partner.name):[...items,partner.name])} className={`rounded-[17px] border p-4 text-left transition hover:-translate-y-1 ${active?"border-[#C1B1F4] bg-[#FAF8FF] shadow-[0_10px_25px_rgba(55,37,100,.07)]":"border-[#E8E4EC]"}`}><div className="flex items-start gap-3"><span className={`grid h-11 w-11 place-items-center rounded-[13px] bg-gradient-to-br ${partner.color} text-[9px] font-bold text-white`}>{partner.initials}</span><span className="min-w-0 flex-1"><b className="block truncate text-[10px]">{partner.name}</b><small className="mt-1 block text-[7px] text-[#96909C]">{partner.category} · {partner.location}</small></span><span className="rounded-full bg-[#EAF9F2] px-2 py-1 text-[7px] font-bold text-[#158F66]">{partner.score}% fit</span></div><div className="mt-4 flex items-center justify-between border-t border-[#EEEAF1] pt-3"><span className="text-[7px] text-[#99939F]">Verified NEFE partner</span><span className={`text-[8px] font-semibold ${active?"text-[#5E3BEE]":"text-[#AAA4AF]"}`}>{active?"Selected ✓":"Select +"}</span></div></button>})}</div>
          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-[16px] bg-gradient-to-br from-[#221740] to-[#5030BB] p-4 text-white"><p className="text-[7px] uppercase tracking-wider text-white/40">Estimated revenue increase</p><p className="mt-2 text-xl font-semibold">AED {projections.revenue.toLocaleString()}</p><p className="mt-1 text-[7px] text-[#68D3AA]">+18.4% monthly potential</p></div><div className="rounded-[16px] border border-[#E4DCC5] bg-[#FFFBF1] p-4"><p className="text-[7px] uppercase tracking-wider text-[#998D73]">Projected referrals</p><p className="mt-2 text-xl font-semibold">{projections.referrals}</p><p className="mt-1 text-[7px] text-[#A57823]">qualified referrals / month</p></div></div>
        </div>}

        {step===5&&<div className="relative overflow-hidden p-7 text-center sm:p-12"><div className="onboarding-success-glow"/><div className="relative z-10"><div className="onboarding-success mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#5E3BEE] to-[#8B68E8] text-white shadow-[0_20px_55px_rgba(94,59,238,.3)]"><svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m5 12 4 4L19 6"/></svg></div><div className="onboarding-confetti">{Array.from({length:18},(_,i)=><i key={i} style={{"--i":i} as React.CSSProperties}/>)}</div><p className="mt-7 text-[9px] font-bold uppercase tracking-[.17em] text-[#6B4FD3]">Welcome to the ecosystem</p><h1 className="mx-auto mt-3 max-w-xl text-3xl font-semibold tracking-[-.045em] sm:text-[38px]">{business.name||"Your business"} is now connected.</h1><p className="mx-auto mt-4 max-w-md text-[11px] leading-5 text-[#837C89]">Your profile is ready, your partner recommendations are saved, and your first growth opportunities are waiting.</p><div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">{[["12","Compatible businesses"],[`AED ${projections.revenue.toLocaleString()}`,"Revenue potential"],[projections.referrals.toString(),"Monthly referrals"]].map(([value,label])=><div key={label} className="rounded-[16px] border border-[#E8E3EC] bg-white/75 p-3"><p className="text-[16px] font-bold text-[#5E3BEE]">{value}</p><p className="mt-1 text-[7px] text-[#918A97]">{label}</p></div>)}</div><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/portal" className="inline-flex h-12 items-center justify-center rounded-xl bg-[#5E3BEE] px-6 text-[10px] font-semibold text-white shadow-[0_12px_28px_rgba(94,59,238,.24)] transition hover:-translate-y-1">Enter Business Portal →</Link><Link href="/experience-builder" className="inline-flex h-12 items-center justify-center rounded-xl border border-[#DED8E4] bg-white px-6 text-[10px] font-semibold text-[#5B5463] transition hover:-translate-y-1">Create first experience</Link></div></div></div>}

        {step<5&&<footer className="flex items-center justify-between border-t border-[#ECE8EF] bg-[#FCFBFD] px-6 py-4 sm:px-9"><button onClick={()=>setStep(current=>Math.max(1,current-1))} disabled={step===1} className="rounded-xl px-4 py-3 text-[9px] font-semibold text-[#746D79] disabled:opacity-30">← Back</button><div className="hidden items-center gap-2 text-[7px] text-[#A29CA7] sm:flex"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#EAF9F2] text-[#168E66]">✓</span>Your progress is saved automatically</div><button onClick={next} disabled={(step===1&&!business.name)||selectedPartners.length===0} className="rounded-xl bg-[#5E3BEE] px-5 py-3 text-[9px] font-semibold text-white shadow-[0_8px_20px_rgba(94,59,238,.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">{step===4?"Join ecosystem":"Continue"} →</button></footer>}
      </section>
      <p className="mt-5 text-center text-[7px] text-[#A49DA8]">Secure by design · No payment required · You control your business profile</p>
    </div>
  </main>;
}
