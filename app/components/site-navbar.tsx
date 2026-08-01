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
      { label: "Platform Overview", href: "/platform", description: "See how NEFE turns connected journeys into measurable growth." },
      { label: "Commerce Graph", href: "/commerce-graph", description: "Visualize businesses, relationships, journeys, and permitted signals." },
      { label: "Opportunity Engine", href: "/opportunity-engine", description: "Evaluate explainable partner and campaign opportunities." },
      { label: "Analytics", href: "/docs/platform/analytics", description: "Track referrals, conversion, attributed value, and exceptions." },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    items: [
      { label: "Solutions Overview", href: "/solutions", description: "Explore commercial use cases by audience and industry." },
      { label: "Merchants", href: "/merchants", description: "Run onboarding, partner campaigns, rewards, and performance." },
      { label: "Businesses", href: "/businesses", description: "Build partnerships, test pilots, and scale network growth." },
      { label: "Consumers", href: "/consumers", description: "Follow discovery, offers, rewards, and redemption." },
      { label: "Industries", href: "/solutions#industries", description: "See applications across hospitality, tourism, retail, and events." },
    ],
  },
  {
    label: "Resources",
    href: "/docs",
    items: [
      { label: "Documentation", href: "/docs", description: "Read platform, workflow, deployment, and reference guides." },
      { label: "Developers", href: "/developers", description: "Review integration concepts, boundaries, and technical readiness." },
      { label: "Security", href: "/docs/security", description: "Understand privacy, data protection, roles, and permissions." },
      { label: "FAQ", href: "/docs/reference/faq", description: "Get concise answers about participation and platform readiness." },
    ],
  },
  {
    label: "Company",
    href: "/about",
    items: [
      { label: "About", href: "/about", description: "Meet NEFE’s mission, founder, and business-first philosophy." },
      { label: "Roadmap", href: "/about#roadmap", description: "Follow the evidence-led path from pilot to enterprise readiness." },
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
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const menu = mobileNavRef.current;
    const focusable = () => Array.from(menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []).filter((element) => element.tabIndex !== -1);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        window.requestAnimationFrame(() => mobileToggleRef.current?.focus());
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const openDesktopGroup = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setDesktopOpen(label);
  };

  const closeDesktopGroup = () => {
    closeTimerRef.current = setTimeout(() => setDesktopOpen(null), 120);
  };

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
                onMouseEnter={() => openDesktopGroup(group.label)}
                onMouseLeave={closeDesktopGroup}
                onFocus={() => openDesktopGroup(group.label)}
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
          <ThemeToggle />
          <Link href="/onboarding" className="hidden rounded-xl px-3 py-2.5 text-[9px] font-semibold text-[#5E3BEE] transition hover:bg-[#F4F1F7] xl:inline-flex">
            Apply as a business
          </Link>
          <Link href="/sign-in" className="hidden rounded-xl px-3 py-2.5 text-[9px] font-semibold text-[#5E3BEE] transition hover:bg-[#F4F1F7] xl:inline-flex">
            Sign in
          </Link>
          <Link href="/sign-up" className="rounded-xl bg-[#5E3BEE] px-3 py-2.5 text-[8px] font-semibold text-white shadow-[0_8px_20px_rgba(94,59,238,.2)] transition hover:-translate-y-0.5 sm:px-4 sm:text-[9px]">
            Get Started
          </Link>
          <button
            ref={mobileToggleRef}
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
        <>
          <button
            type="button"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-x-0 bottom-0 top-[72px] z-0 bg-[#171122]/5 xl:hidden"
          />
          <nav ref={mobileNavRef} id="mobile-navigation" aria-label="Mobile navigation" className="absolute inset-x-0 top-full z-10 max-h-[min(76vh,calc(100vh-84px))] overflow-y-auto rounded-b-2xl border-b border-[#E5E0E9] bg-white px-4 pb-4 pt-2 shadow-[0_18px_42px_rgba(41,28,63,.12)] xl:hidden">
          <div className="mx-auto max-w-[760px]">
            {groups.map((group) => {
              const expanded = mobileGroup === group.label;
              return (
                <div key={group.label} className="border-b border-[#EEEAF1] py-0.5">
                  <div className="flex items-center">
                    <Link href={group.href} onClick={() => setMobileOpen(false)} className={`flex-1 rounded-xl px-3 py-2.5 text-[11px] font-semibold ${isActive(pathname, group.href) ? "text-[#5E3BEE]" : "text-[#514A59]"}`}>{group.label}</Link>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`mobile-${group.label.toLowerCase()}-menu`}
                      aria-label={`${expanded ? "Collapse" : "Expand"} ${group.label}`}
                      onClick={() => setMobileGroup(expanded ? null : group.label)}
                      className="grid h-10 w-10 place-items-center rounded-xl text-[#6C6474] focus-visible:outline-2 focus-visible:outline-[#5E3BEE]"
                    >
                      <span aria-hidden className={`transition-transform ${expanded ? "rotate-180" : ""}`}>⌄</span>
                    </button>
                  </div>
                  <div id={`mobile-${group.label.toLowerCase()}-menu`} aria-hidden={!expanded} className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="grid min-h-0 gap-0.5 overflow-hidden pb-2 pl-2">
                      {group.items.map((item) => (
                        <Link key={item.href} href={item.href} tabIndex={expanded ? undefined : -1} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-2.5 text-[10px] font-medium text-[#706879] transition hover:bg-[#F7F4FA] focus-visible:outline-2 focus-visible:outline-[#5E3BEE]">{item.label}</Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="grid gap-2 pt-3 min-[380px]:grid-cols-2">
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-xl border border-[#DED8E4] px-4 py-3 text-center text-[10px] font-semibold text-[#514A59]">Contact</Link>
              <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="rounded-xl border border-[#DED8E4] px-4 py-3 text-center text-[10px] font-semibold text-[#514A59]">Sign in</Link>
              <Link href="/onboarding" onClick={() => setMobileOpen(false)} className="rounded-xl border border-[#CFC2F4] bg-[#F8F5FF] px-4 py-3 text-center text-[10px] font-semibold text-[#5E3BEE]">Apply as a business</Link>
              <Link href="/sign-up" onClick={() => setMobileOpen(false)} className="rounded-xl bg-[#5E3BEE] px-4 py-3 text-center text-[10px] font-semibold text-white shadow-[0_8px_20px_rgba(94,59,238,.18)]">Get Started</Link>
            </div>
          </div>
        </nav>
        </>
      )}
    </header>
  );
}
