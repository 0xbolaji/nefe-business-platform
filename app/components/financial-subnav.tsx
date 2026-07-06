"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [["Pricing","/pricing"],["Business Model","/business-model"],["Financial Model","/financial-model"],["Token Utility","/token-utility-economics"]];

export default function FinancialSubnav(){
  const pathname=usePathname();
  return <nav className="no-scrollbar sticky top-0 z-40 overflow-x-auto border-b border-[#E6E0EA] bg-white/90 backdrop-blur-xl"><div className="mx-auto flex h-14 min-w-max max-w-[1540px] items-center gap-2 px-4 sm:px-7 lg:px-9"><span className="mr-3 text-[7px] font-bold uppercase tracking-[.14em] text-[#9A939F]">Financial Intelligence</span>{links.map(([label,href])=><Link key={href} href={href} className={`rounded-lg px-3 py-2 text-[8px] font-semibold transition ${pathname===href?"bg-[#F0ECFF] text-[#5E3BEE]":"text-[#6D6673] hover:bg-[#F8F6FA] hover:text-[#5E3BEE]"}`}>{label}</Link>)}</div></nav>;
}

