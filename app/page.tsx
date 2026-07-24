import type { Metadata } from "next";
import Link from "next/link";
import PrototypeAssistant from "./components/prototype-assistant";
import BrandLogo from "./components/brand-logo";

export const metadata: Metadata = {
  title: "NEFE — The Operating Layer for Connected Commerce",
  description: "Connect complementary businesses, coordinate customer value, launch joint campaigns, and measure shared commercial growth with NEFE.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NEFE Business Network",
    description: "The operating layer for connected commerce.",
    url: "/",
  },
};

type IconName =
  | "arrow"
  | "spark"
  | "hotel"
  | "restaurant"
  | "car"
  | "retail"
  | "health"
  | "beauty"
  | "fitness"
  | "entertainment"
  | "search"
  | "campaign"
  | "referral"
  | "chart"
  | "reward"
  | "members"
  | "check"
  | "bell";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    hotel: <><path d="M4 21V5h11v16M15 10h5v11M8 9h3M8 13h3M8 17h3M2 21h20" /></>,
    restaurant: <><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3c2.5 2 3 6 0 9v9M16 3v9h3" /></>,
    car: <><path d="m5 17-1 3M19 17l1 3M3 13l2-6h14l2 6M5 17h14a2 2 0 0 0 2-2v-2H3v2a2 2 0 0 0 2 2ZM7 15h.01M17 15h.01" /></>,
    retail: <><path d="M6 8V6a6 6 0 0 1 12 0v2M4 8h16l-1 13H5L4 8Z" /></>,
    health: <><path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z" /><path d="M9 12h6M12 9v6" /></>,
    beauty: <><path d="M12 3c2.5 3 4 5.4 4 8a4 4 0 0 1-8 0c0-2.6 1.5-5 4-8Z" /><path d="M5 21c1.5-3 3.8-4.5 7-4.5S17.5 18 19 21" /></>,
    fitness: <><path d="M6 9v6M3 10v4M18 9v6M21 10v4M6 12h12" /></>,
    entertainment: <><path d="M4 6h16v12H4z" /><path d="m10 9 5 3-5 3V9ZM8 3l2 3M16 3l-2 3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    campaign: <><path d="m4 13 11-5v10L4 13ZM4 13v5M15 11h3a2 2 0 0 1 0 4h-3M7 17l1 4h4" /></>,
    referral: <><path d="M8 7h12M16 3l4 4-4 4M16 17H4M8 13l-4 4 4 4" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    reward: <><path d="M12 21s7-3.5 7-10V5l-7-2-7 2v6c0 6.5 7 10 7 10Z" /><path d="m9 12 2 2 4-5" /></>,
    members: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M18 15a6 6 0 0 1 4 6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const categories: { name: string; icon: IconName; color: string }[] = [
  { name: "Hotels", icon: "hotel", color: "lavender" },
  { name: "Restaurants", icon: "restaurant", color: "gold" },
  { name: "Car Rental", icon: "car", color: "blue" },
  { name: "Retail", icon: "retail", color: "pink" },
  { name: "Healthcare", icon: "health", color: "mint" },
  { name: "Beauty", icon: "beauty", color: "rose" },
  { name: "Fitness", icon: "fitness", color: "orange" },
  { name: "Entertainment", icon: "entertainment", color: "lavender" },
];

const features: { title: string; text: string; icon: IconName }[] = [
  { title: "Partner Discovery", text: "Find trusted businesses that complement your brand and share your ambitions.", icon: "search" },
  { title: "Campaign Builder", text: "Launch polished joint offers and bundled experiences in a few simple steps.", icon: "campaign" },
  { title: "Referral Exchange", text: "Create measurable referral programs that reward every successful connection.", icon: "referral" },
  { title: "Business Analytics", text: "See revenue, campaign, and partner performance in one elegant dashboard.", icon: "chart" },
  { title: "Customer Rewards", text: "Turn shared customers into loyal advocates with connected rewards.", icon: "reward" },
  { title: "Membership Management", text: "Manage access, benefits, and partner relationships from one workspace.", icon: "members" },
];

function HeroDashboard() {
  return (
    <div className="hero-dashboard relative mx-auto w-full max-w-[610px]">
      <div className="absolute -left-7 top-[23%] z-20 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_18px_50px_rgba(50,35,100,.14)] backdrop-blur xl:flex">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E9FFF5] text-[#14A46F]"><Icon name="chart" className="h-4 w-4" /></span>
        <div><p className="text-[10px] text-slate-400">Monthly growth</p><p className="text-sm font-bold text-slate-800">+28.4%</p></div>
      </div>
      <div className="absolute -right-5 bottom-[18%] z-20 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-[0_18px_50px_rgba(50,35,100,.14)] backdrop-blur sm:flex">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F2EEFF] text-[#5E3BEE]"><Icon name="check" className="h-4 w-4" /></span>
        <div><p className="text-[10px] text-slate-400">New partnership</p><p className="text-sm font-bold text-slate-800">Alba Hotels</p></div>
      </div>
      <div className="overflow-hidden rounded-[26px] border border-white/80 bg-white/88 p-2.5 shadow-[0_35px_90px_rgba(69,45,140,.18)] backdrop-blur-xl">
        <div className="overflow-hidden rounded-[19px] border border-slate-100 bg-[#FBFAFE]">
          <div className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-5">
            <BrandLogo size="sm" />
            <div className="flex items-center gap-3 text-slate-400"><Icon name="bell" className="h-4 w-4" /><span className="h-7 w-7 rounded-full bg-gradient-to-br from-[#5E3BEE] to-[#B89CFF]" /></div>
          </div>
          <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[120px_1fr]">
            <div className="border-r border-slate-100 bg-white p-3 sm:p-4">
              {["Overview", "Partners", "Campaigns", "Referrals"].map((item, i) => <div key={item} className={`mb-2 rounded-lg px-2 py-2 text-[8px] sm:text-[10px] ${i === 0 ? "bg-[#F0ECFF] font-semibold text-[#5E3BEE]" : "text-slate-400"}`}>{item}</div>)}
            </div>
            <div className="min-w-0 p-4 sm:p-6">
              <p className="text-[10px] text-slate-400">Welcome back, Olivia</p>
              <div className="mt-1 flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900 sm:text-lg">Business overview</h3><span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[8px] text-slate-500">Last 30 days</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[["Revenue", "$48,240", "+18.2%"], ["Partners", "24", "+3 this month"], ["Referrals", "1,429", "+24.5%"]].map(([a,b,c],i) => <div key={a} className={`rounded-xl border border-slate-100 bg-white p-3 ${i === 2 ? "hidden sm:block" : ""}`}><p className="text-[8px] text-slate-400">{a}</p><p className="mt-1 text-sm font-bold text-slate-800">{b}</p><p className="mt-1 text-[7px] text-emerald-500">{c}</p></div>)}
              </div>
              <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3">
                <div className="flex items-center justify-between"><p className="text-[9px] font-semibold text-slate-700">Revenue performance</p><p className="text-[7px] text-slate-400">Jan — Jun</p></div>
                <svg viewBox="0 0 320 100" className="mt-2 h-[78px] w-full" preserveAspectRatio="none">
                  <defs><linearGradient id="heroChart" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6D4AFF" stopOpacity=".25" /><stop offset="1" stopColor="#6D4AFF" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0 82 C35 75,40 56,75 64 S120 73,150 45 S205 65,235 30 S275 38,320 12 V100 H0Z" fill="url(#heroChart)" />
                  <path d="M0 82 C35 75,40 56,75 64 S120 73,150 45 S205 65,235 30 S275 38,320 12" fill="none" stroke="#6845F5" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-[#17132A]">
      <section className="hero-bg relative">
        <div className="hero-commerce-network" aria-hidden="true">
          <svg viewBox="0 0 1400 720" preserveAspectRatio="none">
            <path d="M80 545 C310 420 455 590 690 430 S1050 300 1320 410"/>
            <path d="M180 190 C390 285 535 165 755 275 S1080 340 1260 205"/>
            <circle cx="130" cy="520" r="5"/><circle cx="420" cy="500" r="4"/><circle cx="690" cy="430" r="5"/><circle cx="1015" cy="330" r="4"/><circle cx="1270" cy="400" r="5"/>
            <circle cx="220" cy="210" r="4"/><circle cx="550" cy="205" r="5"/><circle cx="820" cy="295" r="4"/><circle cx="1180" cy="250" r="5"/>
          </svg>
          <i className="commerce-referral-dot one"/><i className="commerce-referral-dot two"/><i className="commerce-referral-dot three"/>
        </div>
        <div className="landing-hero-shell grid min-h-[710px] items-center gap-14 pb-24 pt-16 lg:grid-cols-[minmax(0,.95fr)_minmax(460px,1.05fr)] lg:gap-10 lg:pb-32 lg:pt-20 xl:gap-16">
          <div className="relative z-10 min-w-0">
            <div className="eyebrow"><Icon name="spark" className="h-4 w-4" /> Built for ambitious businesses</div>
            <h1 className="mt-7 max-w-[650px] text-[44px] font-semibold leading-[1.08] tracking-[-.055em] text-[#181329] sm:text-[58px] lg:text-[67px]">Grow Your Business Through <span className="gradient-text">Connected Commerce.</span></h1>
            <p className="mt-7 max-w-[590px] text-base leading-7 text-[#686276] sm:text-lg sm:leading-8">Connect with trusted businesses, launch joint campaigns, exchange referrals, and create measurable growth opportunities.</p>
            <div className="hero-actions mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link id="access" href="/onboarding" className="button-primary">Request Early Access <Icon name="arrow" /></Link>
              <Link href="/platform" className="button-secondary">Explore Platform <Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="/solutions" className="button-secondary">Explore Solutions <Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[#746E80]">
              {["No credit card required", "Built for business", "Secure by design"].map((text) => <span key={text} className="flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#E9FFF5] text-[#16A36A]"><Icon name="check" className="h-3 w-3" /></span>{text}</span>)}
            </div>
          </div>
          <HeroDashboard />
        </div>
      </section>

      <section id="solutions" className="page-shell py-24 sm:py-32">
        <div className="section-heading">
          <div className="eyebrow">Built for every industry</div>
          <h2>Build with <span className="gradient-text">trusted partners.</span></h2>
          <p>Discover trusted partners across the industries your customers already love.</p>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {categories.map((item) => <article key={item.name} className="category-card"><div className={`icon-tile ${item.color}`}><Icon name={item.icon} /></div><h3>{item.name}</h3><span className="category-arrow">↗</span></article>)}
        </div>
      </section>

      <section id="platform" className="soft-section py-24 sm:py-32">
        <div className="page-shell">
          <div className="section-heading">
            <div className="eyebrow">Everything in one place</div>
            <h2>Connect businesses.<br /><span className="gradient-text">Increase customer value.</span></h2>
            <p>Create coordinated customer journeys, from first introduction to repeat purchase.</p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => <article key={feature.title} className="feature-card"><div className="feature-number">0{i + 1}</div><div className="feature-icon"><Icon name={feature.icon} /></div><h3>{feature.title}</h3><p>{feature.text}</p><Link href="/platform">Learn more <Icon name="arrow" className="h-4 w-4" /></Link></article>)}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="page-shell py-24 sm:py-32">
        <div className="section-heading">
          <div className="eyebrow">Simple by design</div>
          <h2>Turn customer flow into<br /><span className="gradient-text">shared growth.</span></h2>
        </div>
        <div className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          <div className="absolute left-[16.66%] right-[16.66%] top-11 hidden h-px bg-gradient-to-r from-transparent via-[#CABEFF] to-transparent md:block" />
          {[
            ["01", "Join", "Create your business profile and tell the network what makes your brand special.", "members"],
            ["02", "Partner", "Discover complementary businesses and launch opportunities that work for both sides.", "referral"],
            ["03", "Grow", "Track every campaign, referral, and dollar of shared growth in real time.", "chart"],
          ].map(([num,title,text,icon]) => <article key={title} className="step-card"><div className="step-icon"><Icon name={icon as IconName} /><span>{num}</span></div><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="page-shell py-20 sm:py-28">
        <div className="grid overflow-hidden rounded-[32px] border border-[#E5DFE9] bg-white shadow-[0_18px_55px_rgba(42,28,72,.07)] lg:grid-cols-[.9fr_1.1fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="eyebrow">Curated ecosystems</div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              Complementary businesses, not random competitors.
            </h2>
            <p className="mt-5 max-w-xl text-[12px] leading-6 text-[#675F6E]">
              NEFE helps businesses collaborate when they serve the same customer before, during or after a purchase without competing for the same core transaction.
            </p>
            <Link href="/commercial-ecosystems" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#5E3BEE] px-5 py-3 text-[10px] font-semibold text-white shadow-[0_12px_28px_rgba(94,59,238,.18)] transition hover:-translate-y-1">
              Explore Commercial Ecosystems <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 bg-gradient-to-br from-[#171122] to-[#3B2578] p-6 text-white sm:grid-cols-2 sm:p-8 lg:p-10">
            {["Luxury travel", "Wellness", "Family weekend", "Business traveler"].map((item, index) => (
              <div key={item} className="rounded-[20px] border border-white/10 bg-white/[.07] p-5 backdrop-blur">
                <span className="text-[8px] font-bold text-[#D9BB64]">0{index + 1}</span>
                <p className="mt-8 text-[15px] font-semibold">{item}</p>
                <p className="mt-2 text-[9px] leading-5 text-white/68">Built around shared customers and complementary moments.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="dashboard-section py-24 text-white sm:py-32">
        <div className="page-shell grid items-center gap-16 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <div className="eyebrow eyebrow-dark">Clarity at every turn</div>
            <h2 className="mt-7 text-4xl font-semibold leading-tight tracking-[-.045em] sm:text-5xl">Where customer flow becomes visible.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/60">Turn every connection into clear, actionable insight. NEFE brings your network, campaigns, customers, and revenue together.</p>
            <div className="mt-9 space-y-4">
              {["Real-time revenue attribution", "Partner and campaign insights", "Beautiful, exportable reports"].map(t => <div key={t} className="flex items-center gap-3 text-sm text-white/85"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[#C5B7FF]"><Icon name="check" className="h-3.5 w-3.5" /></span>{t}</div>)}
            </div>
            <Link href="/business-portal" className="mt-10 inline-flex items-center gap-2 font-semibold text-white">Explore the dashboard <Icon name="arrow" /></Link>
          </div>
          <div className="relative">
            <div className="dashboard-glow" />
            <div className="relative rounded-[26px] border border-white/10 bg-white/[.07] p-3 shadow-2xl backdrop-blur">
              <div className="rounded-[18px] bg-[#F8F7FC] p-5 text-[#19152A] sm:p-7">
                <div className="flex items-center justify-between"><div><p className="text-[10px] text-slate-400">PERFORMANCE</p><h3 className="mt-1 text-xl font-bold">Growth overview</h3></div><span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500">Last 6 months</span></div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[["Revenue Growth", "$84,290", "+24.8%", "lav"], ["Partner Businesses", "36", "+8", "gold"], ["Campaign Performance", "92.4%", "+12.1%", "mint"], ["Customer Referrals", "2,841", "+31.6%", "pink"]].map(([a,b,c,color]) => <div key={a} className="metric-card"><div className={`metric-dot ${color}`} /><p>{a}</p><div><strong>{b}</strong><span>{c}</span></div></div>)}
                </div>
                <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex items-center justify-between"><p className="text-xs font-semibold">Partnership revenue</p><div className="flex gap-3 text-[8px] text-slate-400"><span>● Revenue</span><span className="text-[#D3C9FA]">● Referrals</span></div></div>
                  <svg viewBox="0 0 500 155" className="mt-4 h-32 w-full" preserveAspectRatio="none">
                    {[25,65,105,145].map(y => <line key={y} x1="0" x2="500" y1={y} y2={y} stroke="#EEEAF5" strokeWidth="1" />)}
                    <path d="M0 125 C55 105 70 122 115 92 S185 115 230 65 S300 88 340 48 S420 70 500 18" fill="none" stroke="#6441ED" strokeWidth="4" strokeLinecap="round" />
                    <path d="M0 140 C55 128 85 135 125 115 S190 128 235 100 S310 115 355 88 S430 100 500 72" fill="none" stroke="#D5CAFA" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-24 sm:py-32">
        <div className="cta-card relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="cta-orb cta-orb-one" /><div className="cta-orb cta-orb-two" />
          <div className="relative z-10">
            <div className="eyebrow mx-auto w-fit border-white/15 bg-white/10 text-white/85"><Icon name="spark" className="h-4 w-4" /> Your next opportunity is waiting</div>
            <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-semibold leading-tight tracking-[-.045em] text-white sm:text-5xl">Start with one valuable connection.</h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60">Join the early access list and help shape the first generation of cross-business customer journeys.</p>
            <Link href="/onboarding" className="mt-9 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#4F30D7] shadow-xl transition hover:-translate-y-1">Request Early Access <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <PrototypeAssistant />
    </main>
  );
}
