"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "./brand-logo";
import ThemeToggle from "./theme-toggle";

const links = [
  ["Platform", "/platform"],
  ["Solutions", "/solutions"],
  ["Merchants", "/merchants"],
  ["Businesses", "/businesses"],
  ["Consumers", "/consumers"],
  ["Developers", "/developers"],
  ["Docs", "/docs"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-[60] border-b border-[#EAE5EE] bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-4 sm:px-7 lg:px-9">
        <BrandLogo priority />
        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6">
          {links.map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative whitespace-nowrap py-2 text-[10px] font-semibold transition ${
                  active ? "text-[#5E3BEE]" : "text-[#6F6878] hover:text-[#5E3BEE]"
                }`}
              >
                {label}
                {active && <span className="absolute inset-x-0 -bottom-[17px] h-0.5 rounded-full bg-[#5E3BEE]" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/onboarding" className="hidden rounded-xl bg-[#5E3BEE] px-4 py-2.5 text-[9px] font-semibold text-white shadow-[0_8px_20px_rgba(94,59,238,.2)] transition hover:-translate-y-0.5 sm:block">
            Join the Network
          </Link>
          <button onClick={() => setOpen(!open)} aria-label="Toggle navigation" className="grid h-10 w-10 place-items-center rounded-xl border border-[#E4DFE8] text-lg text-[#5B5463] xl:hidden">
            {open ? "×" : "≡"}
          </button>
        </div>
      </div>
      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-[#E5E0E9] bg-white/96 p-4 shadow-xl backdrop-blur-xl xl:hidden">
          <div className="mx-auto grid max-w-[900px] gap-1 sm:grid-cols-2">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-[11px] font-semibold ${(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "bg-[#F0ECFF] text-[#5E3BEE]" : "text-[#625B6A] hover:bg-[#F8F6FA]"}`}>
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
