"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandLogo from "../components/brand-logo";

type Inputs = {
  customers:number;
  orderValue:number;
  repeatRate:number;
  referralRate:number;
  marketingSpend:number;
  partners:number;
};

const inputConfig: { key:keyof Inputs; label:string; description:string; min:number; max:number; step:number; prefix?:string; suffix?:string }[] = [
  { key:"customers", label:"Monthly customers", description:"Customers served across all channels", min:200, max:20000, step:100 },
  { key:"orderValue", label:"Average order value", description:"Typical customer transaction value", min:50, max:5000, step:10, prefix:"AED " },
  { key:"repeatRate", label:"Repeat purchase rate", description:"Customers who return within 90 days", min:5, max:80, step:1, suffix:"%" },
  { key:"referralRate", label:"Referral rate", description:"Customers likely to visit a partner", min:1, max:40, step:1, suffix:"%" },
  { key:"marketingSpend", label:"Marketing spend", description:"Current monthly acquisition budget", min:5000, max:500000, step:5000, prefix:"AED " },
  { key:"partners", label:"Number of partner businesses", description:"Complementary businesses in your network", min:2, max:50, step:1 },
];

function Logo() {
  return <BrandLogo priority />;
}

function AnimatedValue({ value, prefix = "", suffix = "", decimals = 0 }: { value:number; prefix?:string; suffix?:string; decimals?:number }) {
  const previous = useRef(value);
  const [display,setDisplay] = useState(value);
  useEffect(()=>{
    const from=previous.current;
    const start=performance.now();
    let frame=0;
    const tick=(now:number)=>{
      const progress=Math.min((now-start)/450,1);
      const eased=1-Math.pow(1-progress,3);
      setDisplay(from+(value-from)*eased);
      if(progress<1) frame=requestAnimationFrame(tick);
      else previous.current=value;
    };
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[value]);
  return <>{prefix}{display.toLocaleString("en-US",{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}{suffix}</>;
}

function Slider({ config, value, onChange }: { config:(typeof inputConfig)[number]; value:number; onChange:(value:number)=>void }) {
  const progress=(value-config.min)/(config.max-config.min)*100;
  return <div className="rounded-[18px] border border-[#E9E5ED] bg-white p-4 transition hover:border-[#D7CCF8] hover:shadow-[0_10px_28px_rgba(53,37,96,.055)]">
    <div className="flex items-start justify-between gap-4"><div><label htmlFor={config.key} className="text-[11px] font-semibold">{config.label}</label><p className="mt-1 text-[8px] text-[#99939F]">{config.description}</p></div><output className="shrink-0 rounded-[10px] bg-[#F1EDFF] px-3 py-2 text-[10px] font-bold text-[#5E3BEE]">{config.prefix}{value.toLocaleString()}{config.suffix}</output></div>
    <input id={config.key} type="range" min={config.min} max={config.max} step={config.step} value={value} onChange={event=>onChange(Number(event.target.value))} className="roi-slider mt-5 w-full" style={{background:`linear-gradient(to right,#5E3BEE 0%,#8D70ED ${progress}%,#E9E4EE ${progress}%,#E9E4EE 100%)`}}/>
    <div className="mt-2 flex justify-between text-[7px] text-[#ADA7B1]"><span>{config.prefix}{config.min.toLocaleString()}{config.suffix}</span><span>{config.prefix}{config.max.toLocaleString()}{config.suffix}</span></div>
  </div>;
}

export default function RoiCalculator() {
  const [inputs,setInputs] = useState<Inputs>({ customers:2400, orderValue:420, repeatRate:28, referralRate:12, marketingSpend:90000, partners:12 });
  const [period,setPeriod] = useState<"Monthly"|"Annual">("Monthly");
  const [toast,setToast] = useState("");

  const results = useMemo(()=>{
    const networkFactor=1+Math.min(inputs.partners,30)*0.032;
    const referrals=Math.round(inputs.customers*(inputs.referralRate/100)*networkFactor);
    const conversion=0.58+Math.min(inputs.repeatRate,60)*0.003;
    const additionalCustomers=Math.round(referrals*conversion);
    const repeatMultiplier=1+inputs.repeatRate/100*0.68;
    const monthlyRevenue=Math.round(additionalCustomers*inputs.orderValue*repeatMultiplier);
    const clv=Math.round(inputs.orderValue/(1-Math.min(inputs.repeatRate/100,.82))*1.18);
    const annualInvestment=36000+monthlyRevenue*.025*12;
    const annualValue=monthlyRevenue*12+inputs.marketingSpend*.14*12;
    const roi=Math.round((annualValue-annualInvestment)/annualInvestment*100);
    const monthlyNet=monthlyRevenue+inputs.marketingSpend*.14-annualInvestment/12;
    const payback=Math.max(.4,annualInvestment/12/Math.max(monthlyNet,1));
    return { referrals,additionalCustomers,monthlyRevenue,clv,roi,payback,annualValue,annualInvestment };
  },[inputs]);

  const chartData=useMemo(()=>Array.from({length:12},(_,i)=>Math.round(results.monthlyRevenue*(1+i*.025+Math.pow(i,1.35)*.006))),[results.monthlyRevenue]);
  const maxChart=Math.max(...chartData);
  const points=chartData.map((value,i)=>`${25+i*(650/11)},${190-(value/maxChart)*155}`).join(" ");
  const areaPoints=`25,190 ${points} 675,190`;
  const displayMultiplier=period==="Annual"?12:1;

  function update(key:keyof Inputs,value:number){setInputs(current=>({...current,[key]:value}));}
  function notify(message:string){setToast(message);window.setTimeout(()=>setToast(""),2400);}

  return <main className="roi-page min-h-screen bg-[#F7F6FA] text-[#18142A]">
    <header className="sticky top-0 z-30 border-b border-[#E7E3EB] bg-white/85 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-4 sm:px-7 lg:px-10"><div className="flex items-center gap-5"><Logo/><span className="hidden h-6 w-px bg-[#E4DFE8] sm:block"/><div className="hidden sm:block"><p className="text-[9px] text-[#9A94A0]">Growth Tools</p><p className="text-xs font-semibold">ROI Calculator</p></div></div><div className="flex items-center gap-2"><Link href="/founder-room" className="hidden rounded-xl px-3 py-2.5 text-[9px] font-semibold text-[#6B6472] transition hover:bg-[#F3F0F7] hover:text-[#5E3BEE] md:block">Founder Room</Link><Link href="/business-portal" className="rounded-xl border border-[#E2DDE6] bg-white px-4 py-2.5 text-[9px] font-semibold text-[#5C5564] shadow-sm transition hover:border-[#C7B9F5] hover:text-[#5E3BEE]">← Business Portal</Link></div></div></header>

    <div className="mx-auto max-w-[1480px] px-4 py-8 sm:px-7 lg:px-10 lg:py-11">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex w-fit items-center gap-2 rounded-full border border-[#DDD3FA] bg-white px-3 py-2 text-[8px] font-bold uppercase tracking-[.15em] text-[#5E3BEE]"><span className="text-[#C2973E]">✦</span>Interactive business model</div><h1 className="mt-4 text-3xl font-semibold tracking-[-.05em] sm:text-[42px]">Estimate your NEFE opportunity.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#817A87]">Model how connected partnerships can create new customers, revenue and lifetime value for your business.</p></div><div className="flex w-fit rounded-xl border border-[#E3DEE7] bg-white p-1">{(["Monthly","Annual"] as const).map(item=><button key={item} onClick={()=>setPeriod(item)} className={`rounded-lg px-4 py-2.5 text-[9px] font-semibold transition ${period===item?"bg-[#F0ECFF] text-[#5E3BEE]":"text-[#8C8592]"}`}>{item}</button>)}</div></div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[460px_1fr]">
        <section className="h-fit rounded-[24px] border border-[#E7E3EB] bg-[#FCFBFD] p-4 shadow-[0_8px_30px_rgba(43,30,67,.035)] sm:p-5 xl:sticky xl:top-24"><div className="flex items-center justify-between px-1 pb-4"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#7257D7]">Your business</p><h2 className="mt-1.5 text-lg font-semibold">Commercial inputs</h2></div><button onClick={()=>setInputs({ customers:2400, orderValue:420, repeatRate:28, referralRate:12, marketingSpend:90000, partners:12 })} className="text-[8px] font-semibold text-[#8C8592] hover:text-[#5E3BEE]">Reset assumptions</button></div><div className="space-y-3">{inputConfig.map(config=><Slider key={config.key} config={config} value={inputs[config.key]} onChange={value=>update(config.key,value)}/>)}</div></section>

        <div className="space-y-5">
          <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#201641] via-[#34216F] to-[#6542D8] p-6 text-white shadow-[0_24px_60px_rgba(57,34,132,.2)] sm:p-7">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#B69DFC]/20 blur-3xl"/><div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#D0A44C]/10 blur-3xl"/>
            <div className="relative"><div className="flex items-start justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.15em] text-[#C9BAFA]">Projected incremental value</p><p className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl"><AnimatedValue value={results.monthlyRevenue*displayMultiplier} prefix="AED "/></p><p className="mt-2 text-[9px] text-white/40">{period.toLowerCase()} revenue created through the NEFE ecosystem</p></div><span className="rounded-full bg-[#4CC495]/15 px-3 py-2 text-[8px] font-bold text-[#6AD5AB]">↗ Strong potential</span></div>
            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3">{[
              ["Projected additional customers",results.additionalCustomers*displayMultiplier,"",""],
              ["Projected monthly revenue",results.monthlyRevenue*displayMultiplier,"AED ",""],
              ["Projected customer lifetime value",results.clv,"AED ",""],
              ["Projected referrals",results.referrals*displayMultiplier,"",""],
              ["Estimated ROI",results.roi,"","%"],
              ["Estimated payback period",results.payback,""," months"],
            ].map(([label,value,prefix,suffix],i)=><article key={label as string} className="rounded-[15px] border border-white/10 bg-white/[.065] p-3 backdrop-blur"><div className="flex items-center justify-between"><p className="text-[7px] leading-3 text-white/40">{label as string}</p><span className={`h-1.5 w-1.5 rounded-full ${i<4?"bg-[#A891F4]":"bg-[#E1BF68]"}`}/></div><p className="mt-2 text-[16px] font-semibold"><AnimatedValue value={value as number} prefix={prefix as string} suffix={suffix as string} decimals={i===5?1:0}/></p></article>)}</div></div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
            <article className="rounded-[23px] border border-[#E7E3EB] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#7257D7]">Revenue projection</p><h2 className="mt-1.5 text-[16px] font-semibold">Compounding network value</h2><p className="mt-1 text-[8px] text-[#99939F]">Illustrative incremental revenue over 12 months.</p></div><span className="rounded-full bg-[#EAF9F2] px-2.5 py-1.5 text-[8px] font-bold text-[#159166]">+{Math.round((chartData[11]/chartData[0]-1)*100)}% velocity</span></div>
              <div className="relative mt-5 h-56"><div className="absolute inset-0 flex flex-col justify-between">{["AED 240K","AED 180K","AED 120K","AED 60K","AED 0"].map(label=><div key={label} className="flex items-center gap-3"><span className="w-12 text-[6px] text-[#A49DA8]">{label}</span><i className="h-px flex-1 bg-[#F0EDF3]"/></div>)}</div><svg viewBox="0 0 700 210" className="absolute bottom-0 left-14 h-[205px] w-[calc(100%-3.5rem)]" preserveAspectRatio="none"><defs><linearGradient id="roiArea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6845E8" stopOpacity=".22"/><stop offset="1" stopColor="#6845E8" stopOpacity="0"/></linearGradient></defs><polygon points={areaPoints} fill="url(#roiArea)" className="transition-all duration-500"/><polyline points={points} fill="none" stroke="#5E3BEE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-500"/>{chartData.map((value,i)=><circle key={i} cx={25+i*(650/11)} cy={190-(value/maxChart)*155} r={i===11?5:2.5} fill="white" stroke="#5E3BEE" strokeWidth={i===11?3:2}/>)}</svg></div><div className="ml-14 mt-2 flex justify-between text-[7px] text-[#A49DA8]"><span>Month 1</span><span>Month 3</span><span>Month 6</span><span>Month 9</span><span>Month 12</span></div>
            </article>
            <article className="rounded-[23px] border border-[#E7E3EB] bg-white p-5 sm:p-6"><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#7257D7]">Return profile</p><h2 className="mt-1.5 text-[16px] font-semibold">Value composition</h2><div className="relative mx-auto mt-7 grid h-40 w-40 place-items-center rounded-full" style={{background:`conic-gradient(#5E3BEE 0 62%,#D1A247 62% 80%,#4EA88B 80% 93%,#EEEAF2 93% 100%)`}}><div className="grid h-[102px] w-[102px] place-items-center rounded-full bg-white text-center"><div><p className="text-[7px] text-[#99939F]">Estimated ROI</p><p className="mt-1 text-2xl font-bold"><AnimatedValue value={results.roi} suffix="%"/></p></div></div></div><div className="mt-7 space-y-3">{[["New customer revenue","62%","#5E3BEE"],["Repeat purchases","18%","#D1A247"],["Marketing efficiency","13%","#4EA88B"],["Other","7%","#DAD4DF"]].map(([label,value,color])=><div key={label} className="flex items-center text-[8px]"><i className="mr-2 h-2 w-2 rounded-full" style={{background:color}}/><span className="text-[#7F7884]">{label}</span><b className="ml-auto">{value}</b></div>)}</div></article>
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[22px] border border-[#E7E3EB] bg-white p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#7257D7]">Customer impact</p><h3 className="mt-1.5 text-[14px] font-semibold">Acquisition without isolation</h3></div><span className="text-xl text-[#D0A44A]">✦</span></div><div className="mt-6 space-y-4">{[["Current monthly customers",inputs.customers,inputs.customers+results.additionalCustomers,"#DAD4E0"],["NEFE-connected customers",results.additionalCustomers,inputs.customers+results.additionalCustomers,"#6542E5"],["Qualified referrals",results.referrals,inputs.customers+results.additionalCustomers,"#C79A43"]].map(([label,value,max,color])=><div key={label as string}><div className="flex justify-between text-[8px]"><span className="text-[#7F7885]">{label as string}</span><b>{(value as number).toLocaleString()}</b></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F0EDF3]"><div className="h-full rounded-full transition-all duration-500" style={{width:`${Math.max(6,(value as number)/(max as number)*100)}%`,background:color as string}}/></div></div>)}</div></article>
            <article className="rounded-[22px] border border-[#DDD3F8] bg-gradient-to-br from-[#F5F1FF] to-[#FFFAEE] p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#5E3BEE] text-[#E6C76F] shadow-[0_9px_20px_rgba(94,59,238,.2)]">✦</span><div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#674BD1]">NEFE Intelligence</p><h3 className="mt-1.5 text-[14px] font-semibold">Your strongest growth lever is partner reach.</h3><p className="mt-2 text-[9px] leading-5 text-[#746D79]">With {inputs.partners} compatible partners and a {inputs.referralRate}% referral rate, your business could add approximately <b className="text-[#4C3A91]">{results.additionalCustomers.toLocaleString()} customers</b> every month without proportionally increasing paid acquisition.</p></div></div><button onClick={()=>notify("Personalized ROI report prepared")} className="mt-5 w-full rounded-xl bg-white/75 py-3 text-[9px] font-semibold text-[#5E3BEE] shadow-sm transition hover:-translate-y-0.5">Generate personalized report →</button></article>
          </section>
        </div>
      </div>

      <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#E3DEE7] py-7 text-center sm:flex-row sm:text-left"><div><p className="text-[9px] font-semibold text-[#5D5664]">Based on current ecosystem assumptions.</p><p className="mt-1 text-[7px] text-[#A09AA4]">Illustrative projections use mock data and should not be interpreted as a guarantee of performance.</p></div><button onClick={()=>notify("Assumptions and methodology opened")} className="text-[8px] font-semibold text-[#5E3BEE]">View calculation methodology →</button></footer>
    </div>
    {toast&&<div className="prototype-toast fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#211A32]/95 px-4 py-3 text-[10px] font-semibold text-white shadow-2xl"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#31A477] text-[10px]">✓</span>{toast}</div>}
  </main>;
}
