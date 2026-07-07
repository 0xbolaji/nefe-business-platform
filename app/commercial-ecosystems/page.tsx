import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Commercial Ecosystems | NEFE",
  description: "Curated complementary business ecosystems for the NEFE Business Network.",
};

const ecosystems = [
  {
    name: "Luxury Travel Ecosystem",
    types: ["Hotel", "Chauffeur", "Fine Dining", "Yacht", "Spa", "Luxury Retail"],
    journey: "A premium guest arrives, moves through hospitality, dining, leisure and retail with one coordinated experience.",
    benefit: "Higher guest value without asking any partner to compete for the same core transaction.",
    bundle: "Dubai Signature Weekend: suite stay, chauffeur transfer, chef’s table, yacht afternoon and spa recovery.",
    referral: "High-value referrals across hotel, mobility, leisure and retail moments.",
    utility: "Tiered access, rewards recognition and campaign credits for premium activity.",
  },
  {
    name: "Family Weekend Ecosystem",
    types: ["Cinema", "Restaurant", "Ice Cream", "Indoor Playground", "Retail", "Transport"],
    journey: "A family day out becomes a complete itinerary from arrival to dining, entertainment and shopping.",
    benefit: "More visits per customer journey and stronger weekend retention.",
    bundle: "Family City Day: cinema seats, dining voucher, playground entry and return transport.",
    referral: "Frequent referrals across entertainment, food and family retail.",
    utility: "Family rewards, repeat-visit benefits and membership access.",
  },
  {
    name: "Wellness Ecosystem",
    types: ["Gym", "Spa", "Nutritionist", "Pharmacy", "Healthy Café", "Medical Clinic"],
    journey: "A health-conscious customer moves from fitness to recovery, nutrition and preventative care.",
    benefit: "Recurring customer relationships across complementary wellness needs.",
    bundle: "Wellness Reset: gym assessment, nutrition consult, spa recovery and healthy café credits.",
    referral: "Strong recurring referrals from trusted health and lifestyle moments.",
    utility: "Retention rewards, milestone access and partner benefit tiers.",
  },
  {
    name: "Tourism Ecosystem",
    types: ["Hotel", "Tour Operator", "Car Rental", "Museum", "Restaurant", "Souvenir Retail"],
    journey: "A visitor’s trip is coordinated from stay to mobility, culture, dining and local purchase.",
    benefit: "Turns fragmented tourist spend into measurable connected commerce.",
    bundle: "Discover UAE Pass: hotel stay, rental car, museum access, dinner and retail credit.",
    referral: "Visitor referrals routed between travel, culture, food and retail operators.",
    utility: "Visitor rewards, access passes and destination campaign credits.",
  },
  {
    name: "Real Estate Lifestyle Ecosystem",
    types: ["Property Developer", "Interior Design", "Furniture Retail", "Mortgage Partner", "Moving Service"],
    journey: "A buyer moves from property interest to financing, furnishing, design and moving support.",
    benefit: "Extends one major transaction into a full lifestyle revenue network.",
    bundle: "Move-In Concierge: property handover, interiors consult, furniture package and moving service.",
    referral: "High-value referrals with lower volume but strong commercial impact.",
    utility: "Premium placement, verified partner access and milestone rewards.",
  },
  {
    name: "Events Ecosystem",
    types: ["Event Venue", "Catering", "Hotel", "Transport", "Photography", "Luxury Styling"],
    journey: "An event organizer can coordinate venue, guests, service providers and travel through one network.",
    benefit: "More complete event packages and easier vendor coordination.",
    bundle: "Executive Event Night: venue, catering, hotel rooms, guest transfer and styling.",
    referral: "Multi-party referrals from every event booking and guest touchpoint.",
    utility: "Partner credits, booking incentives and loyalty recognition.",
  },
  {
    name: "Business Traveler Ecosystem",
    types: ["Hotel", "Airport Transfer", "Co-working Space", "Fine Dining", "Wellness", "Corporate Services"],
    journey: "A business traveler gets work, travel, recovery and client hosting support across one itinerary.",
    benefit: "Captures corporate spend across short, repeatable business trips.",
    bundle: "Executive Visit: airport pickup, hotel, meeting space, client dinner and wellness session.",
    referral: "Repeat corporate referrals across hospitality, mobility, workspace and dining.",
    utility: "Status access, company benefits and recurring membership perks.",
  },
  {
    name: "Beach & Leisure Ecosystem",
    types: ["Beach Club", "Hotel", "Restaurant", "Water Sports", "Spa", "Retail"],
    journey: "A leisure guest moves from hotel to beach, dining, activities, recovery and shopping.",
    benefit: "Creates higher-value leisure days from existing customer demand.",
    bundle: "Beach Escape: hotel day access, beach club, water sports, lunch and spa treatment.",
    referral: "Seasonal and weekend referrals across lifestyle and hospitality brands.",
    utility: "Access passes, rewards boosts and premium leisure benefits.",
  },
];

const flywheel = [
  "Shared customer",
  "Partner referral",
  "Bundled experience",
  "Rewards",
  "Repeat visit",
  "Higher customer value",
  "More partners join",
];

export default function CommercialEcosystemsPage() {
  return (
    <main className="commercial-ecosystems-page company-page contrast-audit-page overflow-hidden bg-[#FAF9FB] text-[#19152A]">
      <section className="hero-bg relative px-5 py-24 sm:px-8 sm:py-32">
        <div className="founder-grid absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-[1180px] text-center">
          <div className="eyebrow mx-auto">Curated Ecosystems</div>
          <h1 className="mx-auto mt-7 max-w-5xl text-[46px] font-semibold leading-[1.06] tracking-[-.055em] sm:text-[70px]">
            NEFE connects complementary businesses, <span className="gradient-text">not random competitors.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#625B68] sm:text-lg">
            Businesses participate when the network increases customer value around their core transaction. NEFE helps hotels, restaurants, mobility, wellness, retail and service providers build commercial ecosystems around shared customers.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/opportunity-engine" className="button-primary">Build an ecosystem →</Link>
            <Link href="/uae-opportunity-map" className="button-secondary">View UAE opportunities</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <div className="eyebrow">Why complementary businesses collaborate</div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              Partners win when they serve the same customer at different moments.
            </h2>
          </div>
          <div className="rounded-[30px] border border-[#E5DFE9] bg-white p-7 shadow-[0_18px_55px_rgba(42,28,72,.07)] sm:p-9">
            <p className="text-[13px] leading-7 text-[#625B68]">
              Businesses partner when they serve the same customer before, during, or after a purchase without directly competing for the same core transaction. A hotel is not giving a guest away to a chauffeur, restaurant, spa or yacht operator; it is making the guest journey more valuable, measurable and memorable.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["Before", "Discovery, planning, arrival and intent."],
                ["During", "Experience, purchase, access and movement."],
                ["After", "Rewards, retention, return visits and referrals."],
              ].map(([label, detail]) => (
                <div key={label} className="rounded-[18px] bg-[#F7F4FA] p-4">
                  <p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#6E4DDA]">{label}</p>
                  <p className="mt-3 text-[10px] leading-5 text-[#6D6572]">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#171122] px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="eyebrow eyebrow-dark">Commercial flywheel</div>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
                Shared customer value compounds across the ecosystem.
              </h2>
            </div>
            <p className="max-w-sm text-[11px] leading-6 text-white/68">
              The network grows because every useful referral makes the next partner more valuable.
            </p>
          </div>
          <div className="mt-14 grid gap-3 md:grid-cols-7">
            {flywheel.map((step, index) => (
              <div key={step} className="relative">
                <article className="h-full rounded-[20px] border border-white/10 bg-white/[.065] p-4 shadow-[0_16px_40px_rgba(0,0,0,.12)] backdrop-blur">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#5E3BEE]/24 text-[9px] font-bold text-[#C9B8FF]">{index + 1}</span>
                  <p className="mt-8 text-[11px] font-semibold leading-5">{step}</p>
                </article>
                {index < flywheel.length - 1 ? <span className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-[#D1A849] md:block">→</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1460px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow mx-auto">Curated ecosystem examples</div>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
            Start with business logic customers already understand.
          </h2>
          <p className="mt-5 text-[12px] leading-6 text-[#6D6572]">
            Each ecosystem is built around natural customer journeys, not forced partnerships.
          </p>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {ecosystems.map((ecosystem, index) => (
            <article key={ecosystem.name} className="group rounded-[30px] border border-[#E5DFE9] bg-white p-6 shadow-[0_14px_40px_rgba(42,28,72,.055)] transition hover:-translate-y-1 hover:border-[#CFC1F6] hover:shadow-[0_24px_60px_rgba(48,32,88,.11)] sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#8F8797]">Ecosystem 0{index + 1}</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-.04em]">{ecosystem.name}</h3>
                </div>
                <span className="rounded-full bg-[#F0ECFF] px-3 py-2 text-[8px] font-bold text-[#5E3BEE]">Complementary fit</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {ecosystem.types.map((type) => (
                  <span key={type} className="rounded-full border border-[#E6E0EA] bg-[#FAF8FC] px-3 py-2 text-[8px] font-semibold text-[#625A68]">{type}</span>
                ))}
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  ["Customer journey", ecosystem.journey],
                  ["Business benefit", ecosystem.benefit],
                  ["Suggested bundle", ecosystem.bundle],
                  ["Referral opportunity", ecosystem.referral],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] bg-[#F8F6FA] p-4">
                    <p className="text-[7px] font-bold uppercase tracking-[.13em] text-[#918A96]">{label}</p>
                    <p className="mt-2 text-[10px] leading-5 text-[#5E5664]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-[18px] border border-[#D8C592] bg-[#FFF8E8] p-4">
                <p className="text-[7px] font-bold uppercase tracking-[.13em] text-[#8C661D]">NEFE utility touchpoint</p>
                <p className="mt-2 text-[10px] leading-5 text-[#6B552A]">{ecosystem.utility}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[34px] bg-[#0E0914] p-8 text-white shadow-[0_28px_80px_rgba(38,23,62,.22)] sm:p-12">
          <div className="founder-dark-grid absolute inset-0" />
          <div className="relative grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <div className="eyebrow eyebrow-dark">CEO logic</div>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
                This is why NEFE starts with curated ecosystems instead of open-ended partnerships.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Clearer value", "Every partner understands why the customer journey connects."],
                ["Lower risk", "Businesses do not need to share customers with direct competitors."],
                ["Faster pilots", "Curated clusters are easier to recruit, launch and measure."],
                ["Better intelligence", "NEFE can score ecosystems by fit, value and repeatability."],
              ].map(([title, detail]) => (
                <article key={title} className="rounded-[20px] border border-white/10 bg-white/[.06] p-5">
                  <h3 className="text-[14px] font-semibold">{title}</h3>
                  <p className="mt-3 text-[9px] leading-5 text-white/68">{detail}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/ceo-demo" className="inline-flex h-13 items-center justify-center rounded-xl bg-white px-6 text-[10px] font-bold text-[#4F30C9] transition hover:-translate-y-1">Open CEO Demo</Link>
            <Link href="/platform" className="inline-flex h-13 items-center justify-center rounded-xl border border-white/12 bg-white/[.06] px-6 text-[10px] font-bold text-white transition hover:-translate-y-1">Explore Platform</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
