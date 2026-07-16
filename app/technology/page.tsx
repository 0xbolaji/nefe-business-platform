import type { Metadata } from "next";
import Link from "next/link";
import Logo from "../components/brand-logo";

export const metadata: Metadata = {
  title: "Technology Foundation | NEFE",
  description: "The commercial-first technology foundation supporting the NEFE Business Network.",
};

const foundations = [
  ["Built on BNB Chain", "NEFE can anchor future utility, settlement and verification events on a proven public infrastructure layer."],
  ["Modular architecture", "Commercial products, rewards, analytics, settlement and integrations can evolve independently without forcing merchants into technical complexity."],
  ["Commercial-first infrastructure", "Businesses interact with familiar workflows first: partners, campaigns, referrals, rewards and reporting."],
  ["Secure digital settlement layer", "The platform can support trusted value movement, attribution and future settlement workflows as commercial activity matures."],
  ["Future interoperability", "NEFE is designed to remain adaptable as enterprise systems, payment rails and digital identity standards develop."],
  ["Enterprise scalability", "The architecture supports multi-location operators, destinations, partner networks and white-label deployments."],
];

const architecture = [
  ["Business interface", "Merchant portal · campaigns · referrals · rewards"],
  ["Commercial intelligence", "Partner matching · opportunity scoring · ROI modeling"],
  ["Utility services", "Memberships · access · incentives · campaign credits"],
  ["Settlement layer", "Digital records · attribution · future value movement"],
  ["BNB Chain foundation", "Infrastructure for scalable utility and verification events"],
];

export default function TechnologyPage() {
  return (
    <main className="technology-page company-page contrast-audit-page overflow-hidden bg-[#FAF9FB] text-[#19152A]">
      <section className="technology-hero relative grid min-h-[82vh] place-items-center px-5 py-28 text-center sm:px-8">
        <div className="founder-grid absolute inset-0" />
        <div className="technology-orb one" />
        <div className="technology-orb two" />
        <div className="relative z-10 mx-auto max-w-[1060px]">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#DCD2FA] bg-white/70 px-3 py-2 text-[8px] font-bold uppercase tracking-[.16em] text-[#5E3BEE] shadow-sm backdrop-blur">
            <span className="text-[#C4993F]">✦</span> Platform Architecture
          </div>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[.22em] text-[#8F8797]">Technology Foundation</p>
          <h1 className="mt-5 text-[46px] font-semibold leading-[1.04] tracking-[-.06em] sm:text-[72px] lg:text-[88px]">
            Commercial software on a <span className="gradient-text">secure digital foundation.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-[760px] text-base leading-8 text-[#625B68] sm:text-lg">
            NEFE keeps the merchant experience simple while the underlying infrastructure supports utility, attribution, settlement readiness and enterprise scale.
          </p>
          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/platform" className="button-primary">Explore Platform →</Link>
            <Link href="/token-utility-economics" className="button-secondary">View Token Utility</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <div className="eyebrow">Infrastructure principles</div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              Built for commercial adoption first.
            </h2>
            <p className="mt-6 max-w-md text-[12px] leading-6 text-[#6D6572]">
              Merchants do not need to understand the infrastructure to benefit from the platform. They use NEFE to grow; the technology layer quietly improves trust, attribution and future interoperability.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {foundations.map(([title, detail], index) => (
              <article key={title} className="group rounded-[24px] border border-[#E8E3EB] bg-white p-6 shadow-[0_8px_28px_rgba(43,30,66,.04)] transition hover:-translate-y-1 hover:border-[#CEC1F6] hover:shadow-[0_20px_48px_rgba(53,36,96,.09)]">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#F0ECFF] text-[9px] font-bold text-[#5E3BEE]">0{index + 1}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C69B42]" />
                </div>
                <h3 className="mt-8 text-[16px] font-semibold">{title}</h3>
                <p className="mt-3 text-[9px] leading-5 text-[#746D7A]">{detail}</p>
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-[#F0EDF3]">
                  <div className="technology-card-line h-full rounded-full bg-gradient-to-r from-[#5E3BEE] to-[#C69B42]" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#171122] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="founder-dark-grid absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <div className="eyebrow eyebrow-dark">Architecture view</div>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
                Complex underneath. Simple at the business surface.
              </h2>
              <p className="mt-6 max-w-md text-[12px] leading-6 text-white/72">
                Businesses see customers, campaigns, partners and revenue. The implementation layer can support verification, utility events, settlement readiness and future integrations without changing the merchant workflow.
              </p>
            </div>
            <div className="space-y-3">
              {architecture.map(([title, detail], index) => (
                <div key={title} className={`grid gap-4 rounded-[20px] border p-5 sm:grid-cols-[150px_1fr] ${index === architecture.length - 1 ? "border-[#D1AA50]/35 bg-[#D1AA50]/10" : "border-white/10 bg-white/[.06]"}`}>
                  <p className={index === architecture.length - 1 ? "text-[10px] font-bold text-[#E0C06B]" : "text-[10px] font-bold text-[#C8B8F9]"}>{title}</p>
                  <p className="text-[9px] leading-5 text-white/72">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["Businesses", "Use the commercial platform: partner discovery, referrals, campaigns, rewards and analytics."],
            ["Infrastructure", "Supports secure digital records, utility events, future settlement and interoperability."],
            ["Enterprise", "Gains scalable architecture for destinations, groups, multi-location operators and integrations."],
          ].map(([title, detail]) => (
            <article key={title} className="rounded-[26px] border border-[#E5DFE9] bg-white p-7 shadow-[0_14px_40px_rgba(42,28,72,.055)]">
              <h3 className="text-xl font-semibold tracking-[-.03em]">{title}</h3>
              <p className="mt-4 text-[10px] leading-5 text-[#746D7A]">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="technology-close relative grid min-h-[68vh] place-items-center overflow-hidden bg-[#09070E] px-5 py-24 text-center text-white">
        <div className="founder-dark-grid absolute inset-0" />
        <div className="founder-vision-orb" />
        <div className="relative z-10 mx-auto max-w-[980px]">
          <span className="text-2xl text-[#E1C16B]">✦</span>
          <p className="mt-7 text-[9px] font-bold uppercase tracking-[.2em] text-[#A88FF1]">Commercial-first architecture</p>
          <h2 className="mt-8 text-[36px] font-semibold leading-[1.18] tracking-[-.05em] sm:text-[54px] lg:text-[66px]">
            The platform wins on commercial value. <span className="text-[#C7B6FA]">The technology foundation makes it scalable.</span>
          </h2>
          <div className="mx-auto mt-12 h-px w-44 bg-gradient-to-r from-transparent via-[#8161E2] to-transparent" />
          <div className="mt-10 flex items-center justify-center gap-4">
            <Logo variant="white" />
            <span className="text-lg text-white/15">×</span>
            <span className="text-[12px] font-semibold tracking-[.08em] text-white/70">BNB CHAIN READY</span>
          </div>
        </div>
      </section>
    </main>
  );
}
