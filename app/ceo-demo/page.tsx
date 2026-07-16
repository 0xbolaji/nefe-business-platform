import type { Metadata } from "next";
import Link from "next/link";
import { PilotDecisionActions } from "./pilot-decision-actions";

export const metadata: Metadata = {
  title: "CEO Demo | NEFE",
  description: "A boardroom-ready executive presentation for the NEFE Business Network.",
};

const chapters = [
  ["01", "What is this?", "Opening"],
  ["02", "Why this exists", "Problem"],
  ["03", "Why now", "Timing"],
  ["04", "How big", "Market"],
  ["05", "How NEFE solves it", "Solution"],
  ["06", "How it grows", "Flywheel"],
  ["07", "What is built", "Product"],
  ["08", "Why GoldenRock", "Position"],
  ["09", "Where NEFE fits", "Utility"],
  ["10", "How we start", "Pilot"],
  ["11", "What follows", "Roadmap"],
  ["12", "Decision required", "CEO decision"],
];

const whyNow = [
  ["AI makes commercial intelligence practical", "Partner matching, campaign logic and opportunity scoring can now be operational, not manual."],
  ["UAE businesses compete on premium customer experiences", "Hospitality, retail, mobility and lifestyle brands need differentiated customer journeys."],
  ["Connected sectors already serve the same customer", "Tourism, dining, wellness, transport, property and events naturally reinforce each other."],
  ["Businesses need measurable growth", "NEFE is not another directory. It is a commercial operating layer with trackable outcomes."],
];

const opportunitySectors = [
  ["Hospitality", "Pilot-ready"],
  ["Restaurants", "High-frequency"],
  ["Mobility", "Referral-rich"],
  ["Tourism", "Experience-led"],
  ["Retail", "Upsell-ready"],
  ["Wellness", "Retention-led"],
  ["Real Estate", "High-value"],
  ["Luxury Services", "Premium fit"],
];

const tourCards = [
  { title: "Platform", href: "/platform", number: "01", detail: "Merchant workspace for partner discovery, referrals and campaign execution.", tone: "purple" },
  { title: "Commerce Graph", href: "/commerce-graph", number: "02", detail: "Executive visual for how customers, rewards and revenue move through the network.", tone: "dark" },
  { title: "Commercial Ecosystems", href: "/commercial-ecosystems", number: "03", detail: "Clarifies why businesses participate: they are not giving customers away, they are increasing customer value together.", tone: "gold" },
  { title: "Experience Builder", href: "/experience-builder", number: "04", detail: "Proof that businesses can package services into higher-value customer journeys.", tone: "gold" },
  { title: "ROI Calculator", href: "/roi-calculator", number: "05", detail: "Merchant-facing value model for estimating the upside of joining NEFE.", tone: "mint" },
  { title: "Executive Insights", href: "/executive-insights", number: "06", detail: "Board-level dashboard for ecosystem growth, partner activity and revenue impact.", tone: "blue" },
  { title: "Opportunity Engine", href: "/opportunity-engine", number: "07", detail: "Investor-ready scenario builder for selecting partners and simulating pilot outcomes.", tone: "purple" },
  { title: "UAE Opportunity Map", href: "/uae-opportunity-map", number: "08", detail: "Commercial intelligence layer for identifying which UAE businesses to connect first.", tone: "blue" },
  { title: "Business Model", href: "/business-model", number: "09", detail: "Strategic explanation of how NEFE earns from subscriptions, referrals and enterprise services.", tone: "gold" },
  { title: "Pricing", href: "/pricing", number: "10", detail: "Simple merchant entry points for pilot adoption and future commercial scale.", tone: "mint" },
  { title: "Financial Model", href: "/financial-model", number: "11", detail: "Leadership view of assumptions, scenarios, margin profile and expansion economics.", tone: "blue" },
  { title: "Token Utility", href: "/token-utility-economics", number: "12", detail: "Clear role for utility through rewards, access, incentives and future payment readiness.", tone: "gold" },
  { title: "Technology Foundation", href: "/technology", number: "13", detail: "Shows how businesses use the commercial platform while blockchain infrastructure remains an implementation layer.", tone: "rose" },
];

const flywheel = [
  "Business joins",
  "Partner match discovered",
  "Joint campaign launched",
  "Customer moves through network",
  "Referral value captured",
  "Rewards increase retention",
  "More businesses join",
  "Network value compounds",
];

const pilotKpis = [
  "Businesses onboarded",
  "Campaigns launched",
  "Referrals generated",
  "Repeat customers",
  "Revenue tracked",
  "Partner satisfaction",
];

const roadmap = [
  ["Phase 1", "CEO approval and pilot partner selection"],
  ["Phase 2", "UAE pilot launch"],
  ["Phase 3", "Merchant portal and referral tracking"],
  ["Phase 4", "Consumer app and rewards"],
  ["Phase 5", "NEFE utility integration"],
  ["Phase 6", "GCC expansion"],
];

function QuestionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <div className={dark ? "eyebrow eyebrow-dark" : "eyebrow"}>
      Question answered · {children}
    </div>
  );
}

export default function CeoDemoPage() {
  return (
    <main className="ceo-demo-page overflow-hidden bg-[#FAF9FB] text-[#19152A]">
      <div className="fixed bottom-5 left-5 z-40 hidden rounded-[18px] border border-[#E3DDE8] bg-white/88 p-3 shadow-[0_16px_45px_rgba(42,28,72,.12)] backdrop-blur-xl 2xl:block">
        <p className="px-2 text-[7px] font-bold uppercase tracking-[.16em] text-[#6D6574]">Boardroom flow</p>
        <nav className="mt-2 space-y-0.5">
          {chapters.map(([number, question, label]) => (
            <a key={number} href={`#chapter-${number}`} className="flex w-52 items-center gap-2 rounded-lg px-2 py-2 text-[8px] text-[#706879] transition hover:bg-[#F2EEFF] hover:text-[#5E3BEE]">
              <span className="font-bold text-[#918799]">{number}</span>
              <span>{label}</span>
              <span className="ml-auto max-w-[82px] truncate text-[6px] text-[#9D95A5]">{question}</span>
            </a>
          ))}
        </nav>
      </div>

      <section id="chapter-01" className="ceo-demo-hero relative grid min-h-[82vh] place-items-center px-5 py-28 text-center">
        <div className="founder-grid absolute inset-0" />
        <div className="founder-glow one" />
        <div className="founder-glow two" />
        <div className="relative z-10 mx-auto max-w-[1060px]">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#DED4F9] bg-white/78 px-3 py-2 text-[8px] font-bold uppercase tracking-[.17em] text-[#5E3BEE] shadow-sm backdrop-blur">
            <span className="text-[#C39840]">✦</span> Executive decision presentation
          </div>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[.22em] text-[#8A8190]">What is this?</p>
          <h1 className="mt-5 text-[48px] font-semibold leading-[1.03] tracking-[-.06em] sm:text-[72px] lg:text-[88px]">
            A commercial system where <span className="gradient-text">businesses grow together.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-[760px] text-base leading-8 text-[#5E5664] sm:text-lg">
            NEFE Business Network connects businesses, customers, partnerships, rewards, and future utility into one operating model.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#chapter-02" className="button-primary">Begin boardroom flow ↓</a>
            <Link href="/opportunity-engine" className="button-secondary">Open Opportunity Engine</Link>
          </div>
        </div>
      </section>

      <section id="chapter-02" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <QuestionLabel>Why does this opportunity exist?</QuestionLabel>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              Businesses serve the same customers, but operate separately.
            </h2>
            <p className="mt-6 max-w-lg text-[12px] leading-6 text-[#665E6C]">
              Customer journeys are fragmented. Partner opportunities are unmanaged. Customer value is trapped inside individual businesses.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Customer journeys", "Fragmented after the first purchase."],
              ["Partner opportunities", "Handled manually, if at all."],
              ["Customer value", "Captured by one business at a time."],
            ].map(([title, detail], i) => (
              <article key={title} className="rounded-[24px] border border-[#E4DEE8] bg-white p-6 shadow-[0_12px_34px_rgba(43,30,67,.06)]">
                <span className="text-[8px] font-bold text-[#9B90A4]">0{i + 1}</span>
                <h3 className="mt-10 text-[16px] font-semibold">{title}</h3>
                <p className="mt-3 text-[10px] leading-5 text-[#726A77]">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-03" className="bg-[#F5F1EA] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1240px]">
          <QuestionLabel>Why is now the right time?</QuestionLabel>
          <div className="mt-6 grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <h2 className="text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              The timing is commercial, not speculative.
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {whyNow.map(([title, detail]) => (
                <article key={title} className="rounded-[22px] border border-[#E2D7C5] bg-white/82 p-5 shadow-[0_10px_30px_rgba(77,55,29,.06)] backdrop-blur">
                  <h3 className="text-[14px] font-semibold">{title}</h3>
                  <p className="mt-3 text-[10px] leading-5 text-[#6F6470]">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="chapter-04" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <QuestionLabel>How big can this become?</QuestionLabel>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              A UAE-first opportunity model with GCC expansion potential.
            </h2>
            <p className="mt-6 max-w-lg text-[12px] leading-6 text-[#665E6C]">
              This is a sample opportunity model built from pilot assumptions. The initial goal is proof of repeatable commercial activity, then expansion across the UAE and GCC.
            </p>
          </div>
          <div className="rounded-[32px] border border-[#E7E0EA] bg-white p-5 shadow-[0_18px_55px_rgba(42,28,72,.08)]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {opportunitySectors.map(([sector, label]) => (
                <div key={sector} className="rounded-[18px] border border-[#ECE6EF] bg-[#FAF8FC] p-4">
                  <p className="text-[13px] font-semibold">{sector}</p>
                  <p className="mt-2 text-[8px] font-bold uppercase tracking-[.12em] text-[#8B7F94]">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[["Sample model", "10–20 businesses"], ["Pilot period", "90 days"], ["Expansion logic", "City by city"]].map(([label, value]) => (
                <div key={label} className="rounded-[18px] bg-gradient-to-br from-[#F3EEFF] to-[#FFF9EB] p-4">
                  <p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#8D8294]">{label}</p>
                  <p className="mt-2 text-[18px] font-semibold tracking-[-.03em]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="chapter-05" className="relative overflow-hidden bg-[#171122] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="founder-dark-grid absolute inset-0" />
        <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <QuestionLabel dark>How does NEFE solve it?</QuestionLabel>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              NEFE becomes the coordination layer between businesses.
            </h2>
            <p className="mt-6 max-w-lg text-[12px] leading-6 text-white/70">
              Partner discovery, campaigns, referrals, customer journeys, intelligence and rewards become one shared workflow.
            </p>
          </div>
          <div className="relative mx-auto h-[440px] w-full max-w-[610px]">
            <svg viewBox="0 0 610 440" className="absolute inset-0 h-full w-full">
              {[[305,220,90,80], [305,220,305,48], [305,220,520,80], [305,220,545,300], [305,220,410,392], [305,220,205,392], [305,220,65,300], [305,220,100,180]].map((p, i) => (
                <g key={i}>
                  <path d={`M${p[0]} ${p[1]} Q305 220 ${p[2]} ${p[3]}`} fill="none" stroke="rgba(165,138,239,.3)" strokeDasharray="5 7" className="commerce-dash" />
                  <circle r="3" fill={i % 2 ? "#E0BD67" : "#5BD0A2"}>
                    <animateMotion dur={`${4 + i * .35}s`} repeatCount="indefinite" path={`M${p[0]} ${p[1]} Q305 220 ${p[2]} ${p[3]}`} />
                  </circle>
                </g>
              ))}
            </svg>
            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#6845DF] to-[#2C1A5A] text-center shadow-[0_0_80px_rgba(103,65,223,.38)]">
              <div><b className="text-lg">NEFE</b><small className="mt-1 block text-[6px] uppercase tracking-wider text-[#C7B5FA]">Commerce core</small></div>
            </div>
            {[
              ["Hotel", "left-[5%] top-[8%]"], ["Restaurant", "left-1/2 top-0 -translate-x-1/2"], ["Mobility", "right-[4%] top-[8%]"], ["Wellness", "right-0 bottom-[18%]"],
              ["Experience", "right-[25%] bottom-0"], ["Retail", "left-[25%] bottom-0"], ["Real Estate", "left-0 bottom-[18%]"], ["Luxury Services", "left-[4%] top-[38%]"],
            ].map(([name, pos]) => (
              <div key={name} className={`absolute ${pos} w-26 rounded-[14px] border border-white/10 bg-white/[.075] p-3 text-center text-[8px] font-semibold backdrop-blur`}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-06" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <QuestionLabel>How does the network grow?</QuestionLabel>
        <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
          The commercial flywheel compounds with every useful connection.
        </h2>
        <div className="mt-14 grid gap-3 md:grid-cols-4">
          {flywheel.map((step, i) => (
            <article key={step} className="relative rounded-[22px] border border-[#E5DFE9] bg-white p-5 shadow-[0_12px_32px_rgba(43,30,67,.055)]">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F1EDFF] text-[9px] font-bold text-[#5E3BEE]">{i + 1}</span>
              <p className="mt-8 text-[14px] font-semibold">{step}</p>
              <div className="mt-5 h-1 rounded-full bg-[#F0EBF4]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#5E3BEE] to-[#D1A849]" style={{ width: `${34 + i * 8}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="chapter-07" className="bg-[#F4F1F6] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <QuestionLabel>What has been built?</QuestionLabel>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">A working prototype of the commercial operating model.</h2>
            <p className="mx-auto mt-5 max-w-xl text-[11px] leading-6 text-[#675F6E]">Each view supports one business question: adoption, intelligence, revenue, utility or scale.</p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tourCards.map((card) => (
              <Link key={card.href} href={card.href} className={`ceo-tour-card ${card.tone} group relative min-h-56 overflow-hidden rounded-[24px] border p-6 transition hover:-translate-y-2 hover:shadow-[0_22px_50px_rgba(48,32,88,.12)]`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold opacity-60">{card.number}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-current/10 bg-white/10 transition group-hover:translate-x-1">↗</span>
                </div>
                <h3 className="mt-14 text-xl font-semibold tracking-[-.03em]">{card.title}</h3>
                <p className="mt-3 max-w-xs text-[9px] leading-5 opacity-75">{card.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-08" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <QuestionLabel>Why is GoldenRock positioned to lead this?</QuestionLabel>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              GoldenRock can coordinate the first controlled commercial network.
            </h2>
            <p className="mt-6 max-w-lg text-[12px] leading-6 text-[#665E6C]">
              The opportunity requires credibility, relationship access and disciplined execution—not just software.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Existing UAE relationships",
              "Business credibility",
              "Ability to coordinate partners",
              "NEFE ecosystem advantage",
              "Long-term commercial infrastructure opportunity",
            ].map((item, i) => (
              <article key={item} className={i === 4 ? "rounded-[22px] border border-[#D1AA50]/35 bg-gradient-to-br from-[#191027] to-[#4D31B7] p-5 text-white shadow-[0_18px_50px_rgba(54,32,108,.18)] sm:col-span-2" : "rounded-[22px] border border-[#E5DFE9] bg-white p-5 shadow-[0_12px_34px_rgba(43,30,67,.055)]"}>
                <span className={i === 4 ? "text-[8px] font-bold text-[#E7C76D]" : "text-[8px] font-bold text-[#9B90A4]"}>0{i + 1}</span>
                <h3 className="mt-8 text-[15px] font-semibold">{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-09" className="bg-[#F1EEF4] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <QuestionLabel>Where does NEFE fit?</QuestionLabel>
              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
                Useful first.<br /><span className="gradient-text">Infrastructure-ready.</span>
              </h2>
              <p className="mt-5 text-[11px] leading-6 text-[#6B6370]">
                Businesses join for commercial value first. NEFE utility can later support participation without making the product feel technical.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Rewards", "Access", "Incentives", "Memberships", "Discounts", "Campaign credits", "Future payments"].map((title, i) => (
                <article key={title} className={i === 6 ? "rounded-[20px] border border-[#6D4BE0] bg-gradient-to-br from-[#22163D] to-[#5030B7] p-5 text-white sm:col-span-2" : "rounded-[20px] border border-[#E2DDE6] bg-white p-5"}>
                  <span className={i === 6 ? "grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[9px] font-bold text-[#E2C26D]" : "grid h-9 w-9 place-items-center rounded-xl bg-[#F0ECFF] text-[9px] font-bold text-[#5E3BEE]"}>0{i + 1}</span>
                  <h3 className="mt-5 text-[14px] font-semibold">{title}</h3>
                  <p className={i === 6 ? "mt-2 text-[9px] leading-5 text-white/70" : "mt-2 text-[9px] leading-5 text-[#746C7A]"}>
                    A quiet layer that becomes more valuable as verified commercial activity grows.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="chapter-10" className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <QuestionLabel>How do we start with low risk?</QuestionLabel>
        <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
          Start with 10–20 UAE businesses. Validate for 90 days. Expand city by city.
        </h2>
        <div className="relative mt-14 grid gap-4 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-[#BFAFF1] via-[#D2A64A] to-[#61AB91] md:block" />
          {[
            ["01", "Curated pilot group", "Hotels, restaurants, mobility, wellness, retail, events and luxury services."],
            ["02", "Measured commercial impact", "Track referrals, campaign revenue, repeat behavior and merchant satisfaction."],
            ["03", "Repeatable expansion playbook", "Use the learnings to expand across Dubai, the UAE and selected GCC markets."],
          ].map(([number, title, detail], i) => (
            <article key={number} className="relative text-center">
              <span className={`relative z-10 mx-auto grid h-18 w-18 place-items-center rounded-[22px] border bg-white text-sm font-bold shadow-[0_12px_30px_rgba(52,35,95,.08)] ${i === 0 ? "border-[#BCAAF4] text-[#5E3BEE]" : i === 1 ? "border-[#E2CB93] text-[#A97B21]" : "border-[#A7D2C1] text-[#28856A]"}`}>{number}</span>
              <h3 className="mt-6 text-[16px] font-semibold">{title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-[9px] leading-5 text-[#756D7B]">{detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {pilotKpis.map((kpi) => (
            <div key={kpi} className="rounded-[18px] border border-[#E5DFE9] bg-white p-4 text-center shadow-[0_10px_28px_rgba(43,30,67,.045)]">
              <p className="text-[9px] font-semibold leading-4 text-[#625A68]">{kpi}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="chapter-11" className="bg-[#100B18] px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="mx-auto max-w-[1240px]">
          <QuestionLabel dark>What happens after approval?</QuestionLabel>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
            A staged roadmap from CEO approval to GCC expansion.
          </h2>
          <div className="mt-14 grid gap-3 lg:grid-cols-6">
            {roadmap.map(([phase, title], i) => (
              <article key={phase} className="rounded-[22px] border border-white/10 bg-white/[.065] p-5 shadow-[0_16px_40px_rgba(0,0,0,.12)] backdrop-blur">
                <p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#D9B95F]">{phase}</p>
                <p className="mt-8 text-[13px] font-semibold leading-5 text-white">{title}</p>
                <div className="mt-6 h-1 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#D1A849] to-[#8D6BFF]" style={{ width: `${42 + i * 9}%` }} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="chapter-12" className="ceo-demo-close relative overflow-hidden bg-[#0B0811] px-5 py-32 text-center text-white sm:px-8 sm:py-40">
        <div className="founder-dark-grid absolute inset-0" />
        <div className="founder-vision-orb" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <span className="text-2xl text-[#E1C16B]">✦</span>
          <QuestionLabel dark>What decision is required?</QuestionLabel>
          <h2 className="mt-7 text-[40px] font-semibold leading-tight tracking-[-.05em] sm:text-[62px]">
            The next step is a controlled commercial pilot.
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Pilot Scope", "10–20 UAE businesses"],
              ["Duration", "90 days"],
              ["Primary Goal", "Prove partner revenue"],
              ["Required Decision", "Approve pilot direction"],
              ["Next Action", "Select partners and owner"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-white/10 bg-white/[.065] p-4 backdrop-blur">
                <p className="text-[7px] font-bold uppercase tracking-[.14em] text-[#B9A9D7]">{label}</p>
                <p className="mt-3 text-[12px] font-semibold leading-5 text-white">{value}</p>
              </div>
            ))}
          </div>
          <PilotDecisionActions />
        </div>
      </section>
    </main>
  );
}
