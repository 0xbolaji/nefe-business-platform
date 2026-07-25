import Link from "next/link";
import BrandLogo from "./brand-logo";
import UAEFlag from "./uae-flag";

const columns = [
  {
    title: "Explore",
    links: [["Platform", "/platform"], ["Solutions", "/solutions"], ["Merchants", "/merchants"], ["Businesses", "/businesses"], ["Consumers", "/consumers"]],
  },
  {
    title: "Resources",
    links: [["Documentation", "/docs"], ["Developers", "/developers"], ["Security", "/docs/security"], ["FAQ", "/docs/reference/faq"]],
  },
  {
    title: "Company",
    links: [["About", "/about"], ["Roadmap", "/about#roadmap"], ["Contact", "/contact"]],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer relative z-20 border-t border-[#E8E3EB] bg-white text-[#211A2A]">
      <div className="mx-auto max-w-[1480px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 border-b border-[#EEEAF1] pb-12 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-sm text-[11px] leading-6 text-[#77707D]">The commercial intelligence network helping businesses share customer value, coordinate growth, and build stronger local economies.</p>
            <Link href="/contact" className="mt-6 inline-flex text-[9px] font-semibold text-[#5E3BEE] transition hover:text-[#4728C8]">Start a conversation →</Link>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-7 gap-y-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[9px] font-bold uppercase tracking-[.16em] text-[#8D8693]">{column.title}</h3>
                <div className="mt-5 grid gap-3.5">
                  {column.links.map(([label, href]) => (
                    <Link key={`${column.title}-${label}`} href={href} className="text-[10px] font-medium text-[#655E6C] transition hover:translate-x-0.5 hover:text-[#5E3BEE]">{label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-5 pt-7 text-[8px] text-[#918A97] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <p>© 2026 NEFE Business Network</p>
            <p className="inline-flex items-center gap-2"><UAEFlag className="h-3.5 w-auto" title="United Arab Emirates flag" />Built in the United Arab Emirates.</p>
          </div>
          <div className="flex items-center gap-4" aria-label="Prototype status">
            <span className="font-semibold text-[#6F6876]">Private executive preview</span>
            <span className="hidden text-[#B1AAB6] sm:inline">Sample data environment</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#EEEAF1]">
        <p className="mx-auto max-w-[1480px] px-5 py-4 text-[7px] text-[#A09AA4] sm:px-8 lg:px-10">Interactive product prototype using sample commercial data. Not a live financial or transactional service.</p>
      </div>
    </footer>
  );
}
