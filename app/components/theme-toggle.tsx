"use client";

export default function ThemeToggle(){
  const toggle=()=>{
    const root=document.documentElement;
    const next=root.dataset.theme==="dark"?"light":"dark";
    root.dataset.theme=next;
    root.style.colorScheme=next;
    window.localStorage.setItem("nefe-theme",next);
    window.dispatchEvent(new CustomEvent("nefe-theme-change",{detail:next}));
  };
  return <button type="button" onClick={toggle} aria-label="Toggle light and dark mode" title="Toggle theme" className="theme-toggle grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#E4DFE8] bg-white/70 text-[#5B5463] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#C8BAF2]"><svg className="theme-icon-light h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg><svg className="theme-icon-dark hidden h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z"/></svg></button>;
}

