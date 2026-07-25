"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "./brand-logo";
import ThemeToggle from "./theme-toggle";

type NavItem = { label: string; href: string; description?: string };
type NavGroup = { label: string; href: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    label: "Platform",
    href: "/platform",
    items: [
      { label: "Platform Overview", href: "/platform", description: "How NEFE connects commercial systems." },
      { label: "Commerce Graph", href: "/commerce-graph", description: "Map businesses, relationships, and journeys." },
      { label: "Opportunity Engine", href: "/opportunity-engine", description: "Identify explainable growth opportunities." },
      { label: "Analytics", href: "/docs/platform/analytics", description: "Measure outcomes against a clear baseline." },
      { label: "Merchant Network", href: "/merchants", description: "Operate campaigns and partner activity." },
      { label: "Consumer Experience", href: "/consumers", description: "Connect discovery, rewards, and redemption." },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    items: [
      { label: "Solutions Overview", href: "/solutions", description: "Use cases across connected commerce." },
      { label: "Merchants", href: "/merchants", description: "Onboarding, campaigns, rewards, and operations." },
      { label: "Businesses", href: "/businesses", description: "Partnerships, network growth, and pilots." },
      { label: "Consumers", href: "/consumers", description: "Relevant offers and connected experiences." },
      { label: "Industries", href: "/solutions#industries", description: "Tourism, hospitality, retail, and events." },
    ],
  },
  {
    label: "Resources",
    href: "/docs",
    items: [
      { label: "Documentation", href: "/docs", description: "Product, business, and operating guidance." },
      { label: "Developers", href: "/developers", description: "Integration direction and readiness." },
      { label: "Security", href: "/docs/security", description: "Governance, privacy, roles, and permissions." },
      { label: "FAQ", href: "/docs/reference/faq", description: "Answers to common platform questions." },
    ],
  },
  {
    label: "Company",
    href: "/about",
    items: [
      { label: "About", href: "/about", description: "Mission, philosophy, and long-term direction." },
      { label: "Roadmap", href: "/about#roadmap", description: "An evidence-led path from foundation to enterprise." },
      { label: "Founder’s Collection", href: "/docs/ecosystem/founders-collection", description: "The founder-aligned ecosystem framework." },
    ],
  },
];

function isActive(pathname: string, href: string) {
  const route = href.split("#")[0];
  return route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`);
}

export default function SiteNavbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopOpen(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-[60] border-b border-[#EAE5EE] bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-4 sm:px-7 lg:px-9">
        <BrandLogo priority />

        <nav aria-label="Primary navigation" className="hidden items-stretch self-stretch xl:flex">
          {groups.map((group) => {
            const expanded = desktopOpen === group.label;
            const active = isActive(pathname, group.href) || group.items.some((item) => isActive(pathname, item.href));
            return (
              <div
                key={group.label}
                className="relative flex items-center"
                onMouseEnter={() => setDesktopOpen(group.label)}
                onMouseLeave={() => setDesktopOpen(null)}
                onFocus={() => setDesktopOpen(group.label)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDesktopOpen(null);
                }}
              >
                <div className="flex items-center">
                  <Link
                    href={group.href}
                    className={`relative px-4 py-3 text-[10px] font-semibold transition ${active ? "text-[#5E3BEE]" : "text-[#6F6878] hover:text-[#5E3BEE]"}`}
                  >
                    {group.label}
                    {active && <span className="absolute inset-x-4 -bottom-[13px] h-0.5 rounded-full bg-[#5E3BEE]" />}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Open ${group.label} menu`}
                    aria-expanded={expanded}
                    aria-controls={`desktop-${group.label.toLowerCase()}-menu`}
                    onClick={() => setDesktopOpen(expanded ? null : group.label)}
                    className="-ml-2 grid h-8 w-7 place-items-center rounded-lg text-[9px] text-[#817A88] transition hover:bg-[#F4F1F7] hover:text-[#5E3BEE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E3BEE]"
                  >
                    <span aria-hidden className={`transition-transform ${expanded ? "rotate-180" : ""}`}>⌄</span>
                  </button>
                </div>
                <div
                  id={`desktop-${group.label.toLowerCase()}-menu`}
                  className={`absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-2 transition duration-150 ${expanded ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
                >
                  <div className="rounded-2xl border border-[#E7E1EB] bg-white p-2 shadow-[0_18px_48px_rgba(45,31,70,.13)]">
                    {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setDesktopOpen(null)} className="group block rounded-xl px-4 py-3 transition hover:bg-[#F7F4FA] focus-visible:bg-[#F7F4FA] focus-visible:outline-2 focus-visible:outline-[#5E3BEE]">
                        <span className="block text-[10px] font-semibold text-[#403848] group-hover:text-[#5E3BEE]">{item.label}</span>
                        {item.description && <span className="mt-1 block text-[8px] leading-4 text-[#8B8491]">{item.description}</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <Link href="/contact" className={`relative flex items-center px-4 text-[10px] font-semibold transition ${isActive(pathname, "/contact") ? "text-[#5E3BEE]" : "text-[#6F6878] hover:text-[#5E3BEE]"}`}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/docs" className="hidden px-2 py-2 text-[9px] font-semibold text-[#5E3BEE] transition hover:text-[#4728C8] sm:block xl:hidden">Docs</Link>
          <ThemeToggle />
          <Link href="/onboarding" className="rounded-xl bg-[#5E3BEE] px-3 py-2.5 text-[8px] font-semibold text-white shadow-[0_8px_20px_rgba(94,59,238,.2)] transition hover:-translate-y-0.5 sm:px-4 sm:text-[9px]">
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#E4DFE8] text-lg text-[#5B5463] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E3BEE] xl:hidden"
          >
            {mobileOpen ? "×" : "≡"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-b border-[#E5E0E9] bg-white p-4 shadow-xl xl:hidden">
          <div className="mx-auto max-w-[760px]">
            {groups.map((group) => {
              const expanded = mobileGroup === group.label;
              return (
                <div key={group.label} className="border-b border-[#EEEAF1] py-1">
                  <div className="flex items-center">
                    <Link href={group.href} onClick={() => setMobileOpen(false)} className={`flex-1 rounded-xl px-4 py-3 text-[11px] font-semibold ${isActive(pathname, group.href) ? "text-[#5E3BEE]" : "text-[#514A59]"}`}>{group.label}</Link>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-${group.label.toLowerCase()}-menu`}
                      aria-label={`${expanded ? "Collapse" : "Expand"} ${group.label}`}
                      onClick={() => setMobileGroup(expanded ? null : group.label)}
                      className="grid h-11 w-11 place-items-center rounded-xl text-[#6C6474] focus-visible:outline-2 focus-visible:outline-[#5E3BEE]"
                    >
                      <span aria-hidden className={`transition-transform ${expanded ? "rotate-180" : ""}`}>⌄</span>
                    </button>
                  </div>
                  {expanded && (
                    <div id={`mobile-${group.label.toLowerCase()}-menu`} className="grid gap-1 pb-3 pl-3">
                      {group.items.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-[10px] font-medium text-[#706879] transition hover:bg-[#F7F4FA] focus-visible:outline-2 focus-visible:outline-[#5E3BEE]">{item.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex pt-4">
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-xl border border-[#DED8E4] px-4 py-3 text-center text-[10px] font-semibold text-[#514A59]">Contact</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
