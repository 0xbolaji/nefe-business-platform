import Link from "next/link";
import BrandLogo from "./brand-logo";

const quickLinks = [["Home","/"],["Founder Room","/founder-room"],["Why Botchain","/why-botchain"],["Executive Insights","/executive-insights"]];
const platformLinks = [["Platform","/platform"],["Commerce Graph","/commerce-graph"],["ROI Calculator","/roi-calculator"],["Business Portal","/business-portal"],["Consumer App","/consumer"],["Experience Builder","/experience-builder"]];

export default function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-[#E8E3EB] bg-white text-[#211A2A]">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div><BrandLogo /><p className="mt-5 max-w-sm text-[11px] leading-6 text-[#77707D]">NEFE is the commercial network where businesses collaborate, customers benefit, and intelligent infrastructure turns connections into growth.</p></div>
        <div><h3 className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8D8693]">Quick links</h3><div className="mt-4 grid gap-3">{quickLinks.map(([label,href])=><Link key={href} href={href} className="text-[10px] font-medium text-[#655E6C] transition hover:text-[#5E3BEE]">{label}</Link>)}</div></div>
        <div><h3 className="text-[9px] font-bold uppercase tracking-[.14em] text-[#8D8693]">Platform</h3><div className="mt-4 grid grid-cols-2 gap-3">{platformLinks.map(([label,href])=><Link key={href} href={href} className="text-[10px] font-medium text-[#655E6C] transition hover:text-[#5E3BEE]">{label}</Link>)}</div></div>
      </div>
      <div className="border-t border-[#EEEAF1]"><div className="mx-auto flex max-w-[1480px] flex-col gap-2 px-5 py-5 text-[7px] text-[#99929E] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><p>© 2026 NEFE. All rights reserved.</p><p>Interactive prototype using illustrative mock data. Not a live financial or transactional service.</p></div></div>
    </footer>
  );
}
