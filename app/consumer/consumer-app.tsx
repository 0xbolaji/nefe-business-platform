"use client";

import { useState } from "react";
import PrototypeAssistant from "../components/prototype-assistant";
import Image from "next/image";

type Tab = "Discover" | "Offers" | "Rewards" | "Wallet" | "Profile";
type IconName = "discover" | "offers" | "rewards" | "wallet" | "profile" | "search" | "bell" | "heart" | "pin" | "star" | "arrow" | "spark" | "ticket" | "chevron" | "bookmark" | "calendar" | "check" | "plane" | "gift";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    discover: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" /></>,
    offers: <><path d="M20 12 12 20 4 12V4h8l8 8Z" /><circle cx="8.5" cy="8.5" r="1" /></>,
    rewards: <><path d="M12 21s7-3.5 7-10V5l-7-2-7 2v6c0 6.5 7 10 7 10Z" /><path d="m9 12 2 2 4-5" /></>,
    wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12" /><path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    heart: <path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    ticket: <><path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 0 0-4V4H3v4Z" /><path d="M14 4v12" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plane: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
    gift: <><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M12 8H7.5a2.5 2.5 0 1 1 2-4c1.5 1.5 2.5 4 2.5 4ZM12 8h4.5a2.5 2.5 0 1 0-2-4c-1.5 1.5-2.5 4-2.5 4Z" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const categories = [
  ["Hotels", "🏨"], ["Dining", "✦"], ["Beach", "☼"], ["Cars", "◇"], ["Spas", "❋"], ["Events", "♪"],
];

const businesses = [
  { name: "The Celeste Dubai", type: "Luxury hotel · Palm Jumeirah", rating: "4.9", art: "hotel" },
  { name: "Maison D'Or", type: "Fine dining · DIFC", rating: "4.8", art: "dining" },
  { name: "Azure Beach Society", type: "Beach club · JBR", rating: "4.9", art: "beach" },
];

const offers = [
  { title: "Dinner + Event Access", partners: "Maison D'Or × The Foundry", price: "From AED 680", badge: "20% value", art: "dinner" },
  { title: "Hotel Stay + Airport Pickup", partners: "The Celeste × Aurum Drive", price: "From AED 1,950", badge: "Member rate", art: "hotel" },
  { title: "Beach Club + Spa Day", partners: "Azure Beach × Serein Wellness", price: "From AED 890", badge: "Save AED 240", art: "spa" },
  { title: "Shopping + Rewards", partners: "Lumé Joaillerie × NEFE", price: "Earn 3× points", badge: "Exclusive", art: "shopping" },
];

function StatusBar() {
  return <div className="flex h-8 shrink-0 items-end justify-between px-6 pb-1 text-[9px] font-bold"><span>9:41</span><div className="flex items-center gap-1"><span className="flex gap-[1px]">{[2,3,4,5].map(h => <i key={h} className="w-[2px] rounded-full bg-current" style={{height:`${h}px`}} />)}</span><span>⌁</span><span className="h-[7px] w-[14px] rounded-[2px] border border-current p-[1px]"><i className="block h-full w-[80%] rounded-[1px] bg-current" /></span></div></div>;
}

function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="flex items-center justify-between px-5 pb-4 pt-3"><div className="flex items-center gap-2.5"><Image src="/nefe-logo-purple.png" alt="" width={200} height={200} className="h-7 w-7 shrink-0 object-contain" /><div><p className="text-[10px] text-[#8C8595]">{subtitle}</p><h1 className="text-[24px] font-semibold tracking-[-.045em]">{title}</h1></div></div><button className="relative grid h-9 w-9 place-items-center rounded-full border border-[#EDE8F0] bg-white text-[#544E5D] shadow-sm"><Icon name="bell" className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#5E3BEE] ring-2 ring-white" /></button></div>;
}

function DiscoverScreen({ goOffers }: { goOffers: () => void }) {
  return <div className="pb-5">
    <AppHeader subtitle="Sunday, 5 July" title="Discover Dubai" />
    <div className="mx-5 flex h-10 items-center gap-2 rounded-xl border border-[#EAE5EE] bg-white px-3 shadow-[0_4px_15px_rgba(44,31,70,.03)]"><Icon name="search" className="h-4 w-4 text-[#918A99]" /><span className="text-[10px] text-[#AAA4AF]">Search places, experiences, offers</span></div>
    <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto px-5">{categories.map(([name,icon]) => <button key={name} className="group shrink-0 text-center"><span className="grid h-11 w-11 place-items-center rounded-[14px] border border-[#E9E4ED] bg-white text-base shadow-sm transition group-hover:border-[#CFC1FB] group-hover:bg-[#F1EDFF]">{icon}</span><span className="mt-1.5 block text-[8px] font-medium text-[#78717F]">{name}</span></button>)}</div>
    <div className="mt-6 flex items-end justify-between px-5"><div><h2 className="text-[15px] font-semibold">Curated for you</h2><p className="mt-0.5 text-[8px] text-[#9C96A2]">Exceptional places, selected by NEFE</p></div><button className="text-[9px] font-semibold text-[#5E3BEE]">See all</button></div>
    <div className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-2">{businesses.map((business) => <article key={business.name} className="w-[220px] shrink-0 snap-start overflow-hidden rounded-[18px] border border-[#EAE6ED] bg-white shadow-[0_8px_24px_rgba(46,31,75,.06)]">
      <div className={`consumer-art ${business.art}`}><span className="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-1 text-[7px] font-bold text-[#453C52] backdrop-blur">NEFE SELECT</span><button className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-[#514A59] backdrop-blur"><Icon name="heart" className="h-3.5 w-3.5" /></button><div className="consumer-scenery" /></div>
      <div className="p-3"><div className="flex items-start justify-between"><div><h3 className="text-[11px] font-semibold">{business.name}</h3><p className="mt-1 text-[8px] text-[#96909D]">{business.type}</p></div><span className="flex items-center gap-1 text-[8px] font-semibold"><Icon name="star" className="h-2.5 w-2.5 fill-[#D3A743] stroke-[#D3A743]" />{business.rating}</span></div></div>
    </article>)}</div>
    <div className="mx-5 mt-4 overflow-hidden rounded-[18px] bg-gradient-to-r from-[#241944] to-[#5533C8] p-4 text-white shadow-[0_12px_30px_rgba(70,43,165,.2)]"><div className="flex items-center justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#CDBFFF]">This weekend</p><h3 className="mt-1 text-[14px] font-semibold">Four moments. One perfect night.</h3><p className="mt-1 text-[8px] text-white/55">Dining, event access & private transfer</p></div><button onClick={goOffers} className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#5E3BEE]"><Icon name="arrow" className="h-4 w-4" /></button></div></div>
  </div>;
}

type Offer = (typeof offers)[number];

function OffersScreen({ onOffer, saved, onSave }: { onOffer: (offer: Offer) => void; saved: string[]; onSave: (offer: Offer) => void }) {
  return <div className="pb-5"><AppHeader subtitle="Made better together" title="Curated Offers" />
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">{["All offers","Experiences","Stays","Wellness"].map((item,i) => <button key={item} className={`shrink-0 rounded-full px-3 py-2 text-[8px] font-semibold ${i === 0 ? "bg-[#5E3BEE] text-white shadow-[0_6px_15px_rgba(94,59,238,.2)]" : "border border-[#E8E3EC] bg-white text-[#7C7583]"}`}>{item}</button>)}</div>
    <div className="mt-5 space-y-3 px-5">{offers.map((offer,i) => <article key={offer.title} onClick={() => onOffer(offer)} className="cursor-pointer overflow-hidden rounded-[19px] border border-[#E9E4ED] bg-white shadow-[0_7px_22px_rgba(45,31,70,.045)] transition hover:-translate-y-0.5 hover:border-[#D2C5FA]">
      <div className="flex h-[100px]"><div className={`consumer-offer-art ${offer.art}`}><span>{i === 0 ? "✦" : i === 1 ? "◇" : i === 2 ? "☼" : "◆"}</span></div><div className="flex flex-1 flex-col justify-center p-3"><div className="flex items-start justify-between gap-2"><span className="rounded-full bg-[#F2EEFF] px-2 py-1 text-[6px] font-bold uppercase tracking-wider text-[#5E3BEE]">{offer.badge}</span><button onClick={event => { event.stopPropagation(); onSave(offer); }}><Icon name="bookmark" className={`h-3.5 w-3.5 ${saved.includes(offer.title) ? "fill-[#5E3BEE] text-[#5E3BEE]" : "text-[#928B98]"}`} /></button></div><h3 className="mt-2 text-[11px] font-semibold">{offer.title}</h3><p className="mt-1 text-[7px] text-[#9B95A1]">{offer.partners}</p><p className="mt-2 text-[9px] font-bold text-[#5E3BEE]">{offer.price}</p></div></div>
    </article>)}</div>
  </div>;
}

function OfferModal({ offer, saved, onClose, onSave, onAction }: { offer: Offer; saved: boolean; onClose: () => void; onSave: () => void; onAction: (action: string) => void }) {
  const [stage, setStage] = useState<"view" | "booking" | "confirmed" | "redeemed">("view");
  return <div className="absolute inset-0 z-[70] flex items-end bg-[#151020]/45 backdrop-blur-[2px]" onClick={onClose}><div onClick={event => event.stopPropagation()} className="consumer-sheet max-h-[92%] w-full overflow-y-auto rounded-t-[28px] bg-white">
    <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[#DDD7E1]" />
    {stage === "view" && <><div className={`consumer-offer-art ${offer.art} mx-4 mt-3 !h-44 !w-[calc(100%-2rem)] rounded-[20px]`}><span className="!text-5xl">✦</span><button onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-sm">×</button></div><div className="p-5"><div className="flex items-center justify-between"><span className="rounded-full bg-[#F1EDFF] px-2.5 py-1.5 text-[7px] font-bold uppercase text-[#5E3BEE]">{offer.badge}</span><div className="flex gap-2"><button onClick={() => onAction("Offer link copied — ready to share")} className="grid h-8 w-8 place-items-center rounded-full border border-[#E8E3EC] text-[10px]">↗</button><button onClick={onSave} className="grid h-8 w-8 place-items-center rounded-full border border-[#E8E3EC]"><Icon name="bookmark" className={`h-4 w-4 ${saved ? "fill-[#5E3BEE] text-[#5E3BEE]" : "text-[#7C7481]"}`} /></button></div></div><h2 className="mt-4 text-[20px] font-semibold tracking-[-.04em]">{offer.title}</h2><p className="mt-1 text-[9px] text-[#918A98]">{offer.partners}</p><p className="mt-4 text-[9px] leading-5 text-[#6F6877]">A seamless premium experience curated by two exceptional NEFE partners. Every detail is coordinated for you, with member recognition throughout.</p><div className="mt-4 grid grid-cols-3 rounded-[14px] bg-[#F8F6FA] py-3 text-center">{[["4.9","Rating"],["2×","Points"],["Flexible","Booking"]].map(([v,l]) => <div key={l}><p className="text-[10px] font-bold">{v}</p><p className="mt-1 text-[6px] text-[#9A94A0]">{l}</p></div>)}</div><button onClick={() => setStage("booking")} className="mt-5 w-full rounded-[14px] bg-[#5E3BEE] py-3.5 text-[10px] font-semibold text-white shadow-[0_10px_25px_rgba(94,59,238,.23)]">Book experience · {offer.price.replace("From ","")}</button><button onClick={() => setStage("redeemed")} className="mt-2 w-full rounded-[14px] border border-[#E5DFEA] py-3 text-[9px] font-semibold text-[#5E3BEE]">Redeem with points</button></div></>}
    {stage === "booking" && <div className="p-5"><button onClick={() => setStage("view")} className="text-[9px] text-[#746D7B]">← Back</button><h2 className="mt-5 text-[20px] font-semibold">Book your experience</h2><p className="mt-1 text-[8px] text-[#98919D]">{offer.title}</p><div className="mt-5 space-y-3"><label className="block rounded-[14px] border border-[#E8E3EC] p-3"><span className="text-[6px] uppercase text-[#9A94A0]">Preferred date</span><p className="mt-1 text-[10px] font-semibold">Saturday, 18 July 2026</p></label><label className="block rounded-[14px] border border-[#E8E3EC] p-3"><span className="text-[6px] uppercase text-[#9A94A0]">Guests</span><p className="mt-1 text-[10px] font-semibold">2 guests</p></label><label className="block rounded-[14px] border border-[#E8E3EC] p-3"><span className="text-[6px] uppercase text-[#9A94A0]">Member benefit</span><p className="mt-1 text-[10px] font-semibold text-[#5E3BEE]">Preferred upgrade applied ✓</p></label></div><button onClick={() => setStage("confirmed")} className="mt-5 w-full rounded-[14px] bg-[#5E3BEE] py-3.5 text-[10px] font-semibold text-white">Confirm booking</button></div>}
    {(stage === "confirmed" || stage === "redeemed") && <div className="p-7 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E8F8F1] text-[#159268]"><Icon name="check" className="h-7 w-7" /></span><h2 className="mt-5 text-xl font-semibold">{stage === "confirmed" ? "You're booked." : "Offer redeemed."}</h2><p className="mx-auto mt-2 max-w-[260px] text-[9px] leading-5 text-[#8E8794]">{stage === "confirmed" ? "Your experience is confirmed for Saturday, 18 July. We added it to your NEFE Wallet." : "Your digital benefit is ready in Wallet. Present it when you arrive."}</p><div className="mt-5 rounded-[16px] bg-[#F6F3FC] p-4 text-left"><p className="text-[7px] font-bold uppercase tracking-wider text-[#7960DC]">Confirmation</p><p className="mt-2 text-[11px] font-semibold">{offer.title}</p><p className="mt-1 text-[7px] text-[#98919D]">NEFE-{stage === "confirmed" ? "260718" : "RWD8241"}</p></div><button onClick={() => { onAction(stage === "confirmed" ? "Booking added to your Wallet" : "Reward pass added to your Wallet"); onClose(); }} className="mt-5 w-full rounded-[14px] bg-[#211832] py-3.5 text-[10px] font-semibold text-white">View in Wallet</button></div>}
  </div></div>;
}

function RewardsScreen({ goWallet }: { goWallet: () => void }) {
  return <div className="pb-5"><AppHeader subtitle="Your world of privileges" title="Rewards" />
    <div className="mx-5 rounded-[22px] bg-gradient-to-br from-[#21163E] via-[#332064] to-[#6543D7] p-5 text-white shadow-[0_18px_35px_rgba(61,39,132,.22)]">
      <div className="flex items-start justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.16em] text-[#D4C7FF]">NEFE points</p><p className="mt-2 text-[30px] font-semibold tracking-[-.04em]">12,480</p><p className="mt-0.5 text-[8px] text-white/50">AED 624 in reward value</p></div><span className="grid h-10 w-10 place-items-center rounded-[13px] bg-white/10 text-[#E6C66F]"><Icon name="spark" className="h-5 w-5" /></span></div>
      <div className="mt-5"><div className="flex justify-between text-[7px]"><span className="text-white/50">Preferred</span><span>2,520 pts to Signature</span></div><div className="mt-2 h-1.5 rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#AA8CFD] to-[#E8C56B]" /></div></div>
      <button onClick={goWallet} className="mt-5 flex items-center gap-1 text-[8px] font-semibold text-white">View rewards wallet <Icon name="arrow" className="h-3 w-3" /></button>
    </div>
    <div className="mt-6 px-5"><div className="flex items-center justify-between"><h2 className="text-[14px] font-semibold">Preferred benefits</h2><span className="rounded-full bg-[#FFF3D8] px-2 py-1 text-[7px] font-bold text-[#956E20]">GOLD TIER</span></div>
      <div className="mt-3 grid grid-cols-3 gap-2">{[
        ["Gold","Priority offers + 2× points","ticket"],["Platinum","Upgrades + concierge","gift"],["Diamond","Bespoke access","spark"],
      ].map(([a,b,icon]) => <article key={a} className="rounded-[16px] border border-[#EAE5EE] bg-white p-3.5"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#F1EDFF] text-[#5E3BEE]"><Icon name={icon as IconName} className="h-4 w-4" /></span><h3 className="mt-3 text-[9px] font-semibold">{a}</h3><p className="mt-1 text-[7px] leading-3 text-[#99939F]">{b}</p></article>)}</div>
    </div>
    <div className="mx-5 mt-5 rounded-[16px] border border-[#E9DFC5] bg-[#FFFBF1] p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F2E4BC] text-[#9A7328]"><Icon name="gift" className="h-4 w-4" /></span><div><p className="text-[9px] font-semibold">A new benefit is waiting</p><p className="mt-1 text-[7px] text-[#91846A]">Complimentary welcome ritual at Serein Wellness</p></div><Icon name="chevron" className="ml-auto h-3.5 w-3.5 text-[#A89A7B]" /></div></div>
  </div>;
}

function WalletScreen() {
  const activity = [
    ["Maison D'Or","Points earned · Dinner","＋420","Today","MD"],
    ["The Celeste Dubai","Member benefit · Late checkout","Used","Yesterday","CD"],
    ["Azure Beach Society","Points earned · Day pass","＋280","2 Jul","AB"],
    ["Serein Wellness","Reward redeemed","−1,200","28 Jun","SW"],
  ];
  return <div className="pb-5"><AppHeader subtitle="All your benefits, together" title="Wallet" />
    <div className="mx-5 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#171222] to-[#3D2C58] p-5 text-white shadow-[0_18px_35px_rgba(35,23,53,.22)]">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#6B48E9] p-1"><Image src="/nefe-logo-white.png" alt="" width={200} height={200} className="h-full w-full object-contain" /></span><span className="text-[10px] font-semibold">NEFE Preferred</span></div><span className="text-[7px] tracking-widest text-[#D9BE72]">MEMBER</span></div>
      <div className="mt-9"><p className="text-[8px] text-white/45">REWARDS BALANCE</p><p className="mt-1 text-[25px] font-semibold">12,480 <span className="text-[9px] font-normal text-white/45">points</span></p></div>
      <div className="mt-7 flex items-end justify-between"><div><p className="text-[7px] text-white/35">MEMBER SINCE</p><p className="mt-1 text-[9px]">JAN 2026</p></div><div className="text-right"><p className="text-[7px] text-white/35">MEMBER</p><p className="mt-1 text-[9px] tracking-wider">OLIVIA HART</p></div></div>
    </div>
    <div className="mx-5 mt-5"><div className="flex items-center justify-between"><h2 className="text-[14px] font-semibold">Upcoming benefits</h2><button className="text-[8px] font-semibold text-[#5E3BEE]">View all</button></div>
      <div className="mt-3 flex gap-2">{[["14 Jul","Airport transfer","Aurum Drive"],["19 Jul","Suite upgrade","The Celeste"]].map(([date,name,place]) => <div key={name} className="flex flex-1 gap-2 rounded-[14px] border border-[#E9E4ED] bg-white p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#F1EDFF] text-center text-[6px] font-bold leading-3 text-[#5E3BEE]">{date}</span><div><p className="text-[8px] font-semibold">{name}</p><p className="mt-1 text-[6px] text-[#99939F]">{place}</p></div></div>)}</div>
    </div>
    <div className="mx-5 mt-5"><h2 className="text-[14px] font-semibold">Recent activity</h2><div className="mt-2 divide-y divide-[#EEEAF1]">{activity.map(([name,detail,value,date,initials]) => <div key={`${name}${date}`} className="flex items-center gap-3 py-3"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#F0ECFF] text-[7px] font-bold text-[#5E3BEE]">{initials}</span><div className="min-w-0 flex-1"><p className="text-[8px] font-semibold">{name}</p><p className="mt-1 text-[6px] text-[#9A94A0]">{detail}</p></div><div className="text-right"><p className={`text-[8px] font-bold ${value.includes("＋") ? "text-[#168E65]" : ""}`}>{value}</p><p className="mt-1 text-[6px] text-[#AAA4AF]">{date}</p></div></div>)}</div></div>
  </div>;
}

function ProfileScreen() {
  return <div className="pb-5"><div className="flex justify-end px-5 pb-1 pt-3"><button className="text-[9px] font-semibold text-[#5E3BEE]">Edit profile</button></div>
    <div className="px-5 text-center"><div className="relative mx-auto w-fit"><span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-gradient-to-br from-[#5E3BEE] to-[#B18EFA] text-xl font-semibold text-white shadow-[0_10px_25px_rgba(94,59,238,.2)]">OH</span><span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-[#F8F7FA] bg-[#D4A844] text-white"><Icon name="check" className="h-3 w-3" /></span></div><h1 className="mt-3 text-[20px] font-semibold tracking-[-.035em]">Olivia Hart</h1><p className="mt-1 text-[8px] text-[#96909C]">Preferred member · Dubai</p></div>
    <div className="mx-5 mt-5 grid grid-cols-3 rounded-[17px] border border-[#E9E4ED] bg-white py-4 text-center">{[["12","Saved"],["3","Active offers"],["Gold","Status"]].map(([value,label],i) => <div key={label} className={i ? "border-l border-[#EEEAF1]" : ""}><p className={`text-[13px] font-bold ${value === "Gold" ? "text-[#B48427]" : ""}`}>{value}</p><p className="mt-1 text-[7px] text-[#99939F]">{label}</p></div>)}</div>
    <div className="mx-5 mt-5"><h2 className="text-[13px] font-semibold">Your NEFE</h2><div className="mt-2 overflow-hidden rounded-[17px] border border-[#E9E4ED] bg-white divide-y divide-[#EEEAF1]">{[
      ["Saved businesses","12 places","heart"],["Active offers","3 ready to use","ticket"],["Membership","Preferred · 12,480 points","rewards"],["Preferences","Interests and notifications","profile"],
    ].map(([name,detail,icon]) => <button key={name} className="flex w-full items-center gap-3 p-3.5 text-left"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#F2EEFF] text-[#5E3BEE]"><Icon name={icon as IconName} className="h-4 w-4" /></span><div><p className="text-[9px] font-semibold">{name}</p><p className="mt-1 text-[7px] text-[#99939F]">{detail}</p></div><Icon name="chevron" className="ml-auto h-3.5 w-3.5 text-[#B1ABB5]" /></button>)}</div></div>
    <div className="mx-5 mt-5 overflow-hidden rounded-[17px] border border-[#E9E4ED] bg-white"><div className="consumer-art beach h-20"><div className="consumer-scenery" /></div><div className="flex items-center justify-between p-3"><div><p className="text-[9px] font-semibold">Your next saved place</p><p className="mt-1 text-[7px] text-[#99939F]">Azure Beach Society · JBR</p></div><Icon name="bookmark" className="h-4 w-4 fill-[#5E3BEE] text-[#5E3BEE]" /></div></div>
  </div>;
}

export default function ConsumerApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Discover");
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  const toggleSave = (offer: Offer) => {
    setSaved(items => items.includes(offer.title) ? items.filter(item => item !== offer.title) : [...items, offer.title]);
    notify(saved.includes(offer.title) ? "Removed from saved offers" : "Offer saved to your profile");
  };
  const screens: Record<Tab, React.ReactNode> = {
    Discover: <DiscoverScreen goOffers={() => setActiveTab("Offers")} />,
    Offers: <OffersScreen onOffer={setActiveOffer} saved={saved} onSave={toggleSave} />,
    Rewards: <RewardsScreen goWallet={() => setActiveTab("Wallet")} />,
    Wallet: <WalletScreen />,
    Profile: <ProfileScreen />,
  };
  const tabIcons: Record<Tab, IconName> = { Discover:"discover", Offers:"offers", Rewards:"rewards", Wallet:"wallet", Profile:"profile" };

  return <main className="consumer-page min-h-screen overflow-hidden text-[#1B1627]">
    <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-[1180px] items-center gap-12 px-4 pb-12 pt-5 lg:grid-cols-[1fr_470px] lg:px-8 lg:pb-16">
      <section className="hidden lg:block">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DED5F9] bg-white/60 px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#5E3BEE] backdrop-blur"><Icon name="spark" className="h-4 w-4" /> The city, connected</div>
        <h1 className="mt-7 max-w-[600px] text-[56px] font-semibold leading-[1.04] tracking-[-.055em]">Exceptional experiences, <span className="gradient-text">beautifully connected.</span></h1>
        <p className="mt-6 max-w-[510px] text-base leading-7 text-[#716A7B]">Discover Dubai&apos;s best businesses, unlock curated experiences, and enjoy recognition wherever you go.</p>
        <div className="mt-9 flex flex-wrap gap-3">{(["Discover","Offers","Rewards","Wallet","Profile"] as Tab[]).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition ${activeTab === tab ? "bg-[#5E3BEE] text-white shadow-[0_10px_25px_rgba(94,59,238,.22)]" : "border border-[#E1DBE8] bg-white/65 text-[#6E6777] hover:border-[#C6B9F5] hover:text-[#5E3BEE]"}`}><Icon name={tabIcons[tab]} className="h-4 w-4" />{tab}</button>)}</div>
        <div className="mt-10 flex items-center gap-3 text-[11px] text-[#88818F]"><div className="flex -space-x-2">{["OH","AR","SM","JK"].map((x,i) => <span key={x} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#F7F3FB] text-[7px] font-bold text-white ${["bg-[#5E3BEE]","bg-[#C0903C]","bg-[#4C9B8B]","bg-[#B46583]"][i]}`}>{x}</span>)}</div><span><b className="text-[#3E3747]">Invite-only preview</b><br />Designed for modern city life</span></div>
      </section>

      <section className="mx-auto w-full max-w-[420px]">
        <div className="consumer-phone relative mx-auto">
          <div className="consumer-phone-buttons left" /><div className="consumer-phone-buttons right" />
          <div className="relative flex h-full flex-col overflow-hidden rounded-[42px] bg-[#F8F7FA]">
            <div className="absolute left-1/2 top-2.5 z-50 h-[25px] w-[92px] -translate-x-1/2 rounded-full bg-[#141118]"><span className="absolute right-[17px] top-[9px] h-[6px] w-[6px] rounded-full bg-[#272237] ring-1 ring-[#383147]" /></div>
            <StatusBar />
            <div className="consumer-screen no-scrollbar flex-1 overflow-y-auto">{screens[activeTab]}</div>
            <nav className="relative z-40 grid h-[67px] shrink-0 grid-cols-5 border-t border-[#E9E5ED] bg-white/95 px-2 pb-2 pt-2 backdrop-blur-xl">
              {(["Discover","Offers","Rewards","Wallet","Profile"] as Tab[]).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`group flex flex-col items-center justify-center gap-1 transition ${activeTab === tab ? "text-[#5E3BEE]" : "text-[#9C96A2]"}`}><span className={`relative grid h-6 w-8 place-items-center rounded-lg transition ${activeTab === tab ? "bg-[#F0ECFF]" : ""}`}><Icon name={tabIcons[tab]} className="h-[17px] w-[17px]" />{tab === "Offers" && <i className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-[#D1A344] ring-1 ring-white" />}</span><span className="text-[7px] font-semibold">{tab}</span></button>)}
            </nav>
            <div className="absolute bottom-1 left-1/2 z-50 h-1 w-28 -translate-x-1/2 rounded-full bg-[#17131D]" />
            {activeOffer && <OfferModal offer={activeOffer} saved={saved.includes(activeOffer.title)} onClose={() => setActiveOffer(null)} onSave={() => toggleSave(activeOffer)} onAction={notify} />}
            {toast && <div className="prototype-toast absolute bottom-20 left-1/2 z-[90] flex w-max max-w-[90%] -translate-x-1/2 items-center gap-2 rounded-xl bg-[#211A31]/95 px-3 py-2.5 text-[8px] font-semibold text-white shadow-xl"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#35A77D] text-[8px]">✓</span>{toast}</div>}
          </div>
        </div>
        <p className="mt-5 text-center text-[10px] text-[#8B8493] lg:hidden">Tap the navigation inside the phone to explore</p>
      </section>
    </div>
    <PrototypeAssistant compact />
  </main>;
}
