"use client";

import { useState } from "react";

const responses: Record<string, { title: string; body: string; metrics: string[] }> = {
  "Suggest new business partnerships": {
    title: "Three high-fit opportunities",
    body: "Pair The Celeste Dubai with Lumé Joaillerie for proposal weekends, Azure Beach Society with Forme Athletic for recovery Sundays, and Maison D'Or with Aurum Drive for chauffeured dining.",
    metrics: ["AED 184K potential", "91% avg. fit", "3 concepts"],
  },
  "Predict campaign performance": {
    title: "Strong upside predicted",
    body: "Based on comparable partner activity, the next hospitality bundle is likely to reach 14,800 customers, convert at 11.6%, and generate AED 236K in its first 30 days.",
    metrics: ["11.6% conversion", "AED 236K revenue", "High confidence"],
  },
  "Recommend cross-selling ideas": {
    title: "Cross-sell moments worth testing",
    body: "Offer spa recovery after beach bookings, private transfers after fine dining reservations, and event access as a hotel checkout upgrade.",
    metrics: ["+18% basket size", "4 partner routes", "Low lift"],
  },
  "Improve customer retention": {
    title: "A focused retention play",
    body: "Trigger a Preferred-tier preview after a customer's second partner visit, then unlock a time-limited 2× points benefit at a complementary business.",
    metrics: ["+8.4% repeat rate", "2× points", "30-day test"],
  },
  "Generate new bundle ideas": {
    title: "A new signature bundle",
    body: "The Dubai Golden Weekend: chauffeured arrival by Aurum Drive, sunset dining at Maison D'Or, a Celeste suite, and next-day access to Azure Beach Society.",
    metrics: ["AED 3,850 price", "4 partners", "22% margin"],
  },
};

export default function PrototypeAssistant({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [answer, setAnswer] = useState<keyof typeof responses | null>(null);
  const [toast, setToast] = useState("");

  function ask(prompt: keyof typeof responses) {
    setThinking(true);
    setAnswer(null);
    window.setTimeout(() => {
      setThinking(false);
      setAnswer(prompt);
    }, 650);
  }

  function createCampaign() {
    setToast("Campaign concept added to the prototype workspace.");
    window.setTimeout(() => setToast(""), 2200);
  }

  return <>
    {open && <div className={`fixed z-[90] overflow-hidden rounded-[22px] border border-white/60 bg-white/90 shadow-[0_28px_80px_rgba(37,24,71,.24)] backdrop-blur-2xl ${compact ? "bottom-24 right-4 w-[min(350px,calc(100vw-32px))]" : "bottom-24 right-5 w-[min(390px,calc(100vw-32px))] sm:right-8"}`}>
      <div className="flex items-center justify-between border-b border-[#ECE7F0] bg-gradient-to-r from-[#251A4B] to-[#5A38D4] p-4 text-white">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[#E8D27E]">✦</span><div><p className="text-xs font-semibold">NEFE Intelligence</p><p className="mt-0.5 text-[8px] text-white/50">Partnership strategy assistant</p></div></div>
        <button onClick={() => setOpen(false)} className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-sm">×</button>
      </div>
      <div className="max-h-[480px] overflow-y-auto p-4">
        {!answer && !thinking && <><p className="text-[11px] font-semibold text-[#2D2735]">How can I help you grow?</p><p className="mt-1 text-[9px] leading-4 text-[#918A98]">Choose a prompt to generate a recommendation using your network performance.</p><div className="mt-4 space-y-2">{Object.keys(responses).map(prompt => <button key={prompt} onClick={() => ask(prompt as keyof typeof responses)} className="flex w-full items-center justify-between rounded-xl border border-[#EAE5EE] bg-white p-3 text-left text-[10px] font-medium text-[#514A59] transition hover:-translate-y-0.5 hover:border-[#CFC2F9] hover:bg-[#FAF8FF] hover:text-[#5E3BEE]"><span>{prompt}</span><span>→</span></button>)}</div></>}
        {thinking && <div className="py-5"><div className="flex items-center gap-2 text-[10px] font-semibold text-[#5E3BEE]"><span className="assistant-thinking">✦</span>Analyzing your partner network...</div><div className="mt-5 space-y-2"><div className="h-3 w-3/4 animate-pulse rounded bg-[#EEE9F6]" /><div className="h-3 animate-pulse rounded bg-[#EEE9F6]" /><div className="h-3 w-5/6 animate-pulse rounded bg-[#EEE9F6]" /></div></div>}
        {answer && <div><button onClick={() => setAnswer(null)} className="text-[9px] font-semibold text-[#7A7290]">← Ask another question</button><div className="mt-4 rounded-2xl bg-gradient-to-br from-[#F4F0FF] to-[#FFF9EC] p-4"><span className="text-[#B4882D]">✦</span><h3 className="mt-2 text-[14px] font-semibold">{responses[answer].title}</h3><p className="mt-2 text-[10px] leading-5 text-[#6F6878]">{responses[answer].body}</p><div className="mt-4 flex flex-wrap gap-2">{responses[answer].metrics.map(metric => <span key={metric} className="rounded-full border border-white bg-white/80 px-2.5 py-1.5 text-[8px] font-bold text-[#5E3BEE]">{metric}</span>)}</div></div><button onClick={createCampaign} className="mt-3 w-full rounded-xl bg-[#5E3BEE] py-3 text-[10px] font-semibold text-white shadow-[0_8px_18px_rgba(94,59,238,.2)]">Turn this into a campaign</button></div>}
      </div>
    </div>}
    {toast && <div className="prototype-toast fixed bottom-24 left-1/2 z-[110] -translate-x-1/2 rounded-xl bg-[#211A32]/95 px-4 py-3 text-[10px] font-semibold text-white shadow-2xl">{toast}</div>}
    <button onClick={() => setOpen(!open)} className="fixed bottom-5 right-5 z-[91] flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-br from-[#5E3BEE] to-[#3D22B0] px-4 text-white shadow-[0_15px_35px_rgba(74,43,190,.35)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(74,43,190,.42)] sm:right-8">
      <span className="text-lg text-[#E8D27E]">✦</span><span className="hidden text-[10px] font-semibold sm:block">Ask NEFE AI</span>{!open && <i className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#D5A947] ring-2 ring-white" />}
    </button>
  </>;
}
