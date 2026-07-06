export type Merchant = {
  name: string;
  category: string;
  city: string;
  location: string;
  fit: number;
  referrals: number;
  value: number;
  priority: "Very High" | "High" | "Medium";
  bundle: string;
  ceo: boolean;
  meeting: string;
  outreach: string;
};

const categoryBundles: Record<string, string> = {
  Hotels: "Premium Stay + Curated City Access",
  Restaurants: "Dining + Event Access",
  "Luxury Dining": "Chef's Table + Chauffeured Arrival",
  "Beach Clubs": "Beach Day + Wellness Ritual",
  "Car Rentals": "Luxury Drive + Hotel Stay",
  Spas: "Spa Ritual + Premium Stay",
  Retail: "Private Shopping + Member Rewards",
  Healthcare: "Executive Health + Recovery Stay",
  Events: "Premium Event + Dining",
  "Real Estate": "Resident Welcome Collection",
  "Luxury Experiences": "Bespoke UAE Weekend",
};

const raw: [string, string, string, string, number, number, boolean?][] = [
  ["One&Only One Za'abeel","Hotels","Dubai","One Za'abeel",97,285],["The Lana","Hotels","Dubai","Business Bay",95,264],["Atlantis The Royal","Hotels","Dubai","Palm Jumeirah",96,306],["Bulgari Resort Dubai","Hotels","Dubai","Jumeirah Bay",94,238],["Address Beach Resort","Hotels","Dubai","Dubai Marina",92,214],["Emirates Palace Mandarin Oriental","Hotels","Abu Dhabi","West Corniche",94,210],["W Abu Dhabi","Hotels","Abu Dhabi","Yas Island",89,164],["The Chedi Al Bait","Hotels","Sharjah","Heart of Sharjah",84,92],["Waldorf Astoria RAK","Hotels","Ras Al Khaimah","Al Hamra",88,146],
  ["Trèsind Studio","Luxury Dining","Dubai","Palm Jumeirah",96,242],["Ossiano","Luxury Dining","Dubai","Palm Jumeirah",95,226],["Il Ristorante - Niko Romito","Luxury Dining","Dubai","Jumeirah Bay",93,194],["Zuma Dubai","Restaurants","Dubai","DIFC",92,218],["Orfali Bros Bistro","Restaurants","Dubai","Jumeirah",90,178],["Hakkasan Abu Dhabi","Luxury Dining","Abu Dhabi","Emirates Palace",91,186],
  ["Nammos Dubai","Beach Clubs","Dubai","Jumeirah",93,198],["Azure Beach","Beach Clubs","Dubai","JBR",91,184],["WHITE Beach","Beach Clubs","Dubai","Palm Jumeirah",92,206],["Saadiyat Beach Club","Beach Clubs","Abu Dhabi","Saadiyat Island",89,158],
  ["VIP Rent A Car","Car Rentals","Dubai","Business Bay",94,316],["Uptown Rent A Car","Car Rentals","Dubai","Dubai Marina",90,232],["Paddock Luxury","Car Rentals","Dubai","Al Quoz",88,196],["Superior Car Rental","Car Rentals","Abu Dhabi","Al Bateen",86,142],
  ["Talise Ottoman Spa","Spas","Dubai","Palm Jumeirah",91,174],["Dior Spa The Lana","Spas","Dubai","Business Bay",94,208],["Armani/SPA","Spas","Dubai","Downtown Dubai",92,186],["Anantara Spa","Spas","Abu Dhabi","Eastern Mangroves",87,138],
  ["Level Shoes Private","Retail","Dubai","Dubai Mall",89,156],["Lumé Joaillerie","Retail","Dubai","DIFC",91,172],["The Edit Dubai","Retail","Dubai","Dubai Marina",86,126],["Tryano","Retail","Abu Dhabi","Yas Mall",85,118],
  ["King's College Hospital","Healthcare","Dubai","Dubai Hills",86,118],["American Hospital Dubai","Healthcare","Dubai","Oud Metha",88,136],["Healthpoint","Healthcare","Abu Dhabi","Zayed Sports City",84,104],
  ["Coca-Cola Arena","Events","Dubai","City Walk",92,228],["The Foundry","Events","Dubai","Al Quoz",88,164],["Yas Marina Circuit","Events","Abu Dhabi","Yas Island",90,186],["Aljada Events District","Events","Sharjah","Aljada",83,96],
  ["OMNIYAT Residences","Real Estate","Dubai","Downtown Dubai",88,132],["Muraba Residences","Real Estate","Dubai","Palm Jumeirah",87,126],["Aldar Experience Centre","Real Estate","Abu Dhabi","Yas Island",89,148],
  ["The Lana Concierge","Luxury Experiences","Dubai","Business Bay",95,264],["Hero Balloon Flights","Luxury Experiences","Dubai","Dubai Desert",89,172],["Platinum Heritage","Luxury Experiences","Dubai","Dubai Desert",91,188],["Xclusive Yachts","Luxury Experiences","Dubai","Dubai Marina",93,216],
  ["RAK Resort Development","Real Estate","Ras Al Khaimah","Al Marjan Island",99,338,true],["F10 Car Rental","Car Rentals","Ras Al Khaimah","Al Hamra",98,294,true],["RAK Hotel Partner","Hotels","Ras Al Khaimah","Al Marjan Island",99,326,true],
];

export const merchantSlug = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const merchants: Merchant[] = raw.map(([name, category, city, location, fit, referrals, ceo = false], index) => ({
  name,
  category,
  city,
  location,
  fit,
  referrals,
  ceo,
  priority: ceo ? "Very High" : fit >= 89 ? "High" : "Medium",
  bundle: ceo ? "RAK Stay + Car Rental + Resort Experience" : categoryBundles[category],
  value: ceo ? Math.round((referrals * 920) / 1000) * 1000 : Math.round((referrals * (540 + (index % 5) * 85)) / 1000) * 1000,
  outreach: ceo ? "Use the CEO network connection for a private pilot-cluster introduction and commercial workshop." : fit >= 93 ? "Founder-led introduction with a tailored commercial opportunity brief." : "Invite the commercial lead to a focused 30-minute partnership discovery session.",
  meeting: ceo ? "CEO + Development Director + Commercial Lead" : fit >= 92 ? "Commercial Director + Guest Experience Lead" : "Partnerships or Marketing Director",
}));

export const merchantBySlug = (slug: string) => merchants.find(merchant => merchantSlug(merchant.name) === slug);

export const compatibleMerchants = (merchant: Merchant, count = 6) => merchants
  .filter(candidate => candidate.name !== merchant.name)
  .map(candidate => ({
    ...candidate,
    compatibility: Math.min(99, Math.round((candidate.fit + merchant.fit) / 2 + (candidate.city === merchant.city ? 3 : 0) + (candidate.ceo === merchant.ceo ? 1 : 0))),
  }))
  .sort((a, b) => (b.city === merchant.city ? 1 : 0) - (a.city === merchant.city ? 1 : 0) || b.compatibility - a.compatibility)
  .slice(0, count);

