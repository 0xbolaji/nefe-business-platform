export const RAK_SCENARIO = {
  title: "Ras Al Khaimah Connected Destination Pilot",
  label: "Sample RAK destination scenario",
  description:
    "A destination anchor connects hospitality, mobility, dining, beach, wellness, and retail partners into one modeled customer journey.",
  coreParticipants: [
    "RAK Resort Development",
    "RAK Hotel Partner",
    "F10 Car Rental",
    "Waldorf Astoria RAK",
  ],
  disclaimer:
    "Illustrative commercial data for a release candidate demo. It does not represent live financial or transactional activity.",
} as const;

export type ScenarioEntity = {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  revenue: string;
  partners: number;
  campaigns: number;
  referrals: string;
  bundles: string[];
  initials: string;
  color: string;
};

export const RAK_SCENARIO_ENTITIES: ScenarioEntity[] = [
  { id: "resort", name: "RAK Resort Development", category: "Destination Anchor", x: 500, y: 95, revenue: "AED 311,000", partners: 7, campaigns: 3, referrals: "338", bundles: ["RAK Connected Escape", "Destination Welcome", "Resort + Mobility"], initials: "RR", color: "#8B6CF0" },
  { id: "hotel", name: "RAK Hotel Partner", category: "Hospitality", x: 760, y: 160, revenue: "AED 300,000", partners: 6, campaigns: 3, referrals: "326", bundles: ["RAK Connected Escape", "Stay + Dining", "Hotel + Beach"], initials: "RH", color: "#D1A34D" },
  { id: "beach", name: "Beach Club Partner", category: "Beach Experience", x: 870, y: 365, revenue: "AED 128,000", partners: 4, campaigns: 2, referrals: "184", bundles: ["Hotel + Beach", "Coast + Wellness", "Sunset Dining"], initials: "BC", color: "#42B2C2" },
  { id: "mobility", name: "F10 Car Rental", category: "Mobility", x: 720, y: 565, revenue: "AED 270,000", partners: 6, campaigns: 3, referrals: "294", bundles: ["Resort + Mobility", "Executive Arrival", "RAK Connected Escape"], initials: "F10", color: "#7290D7" },
  { id: "wellness", name: "Wellness Partner", category: "Wellness", x: 280, y: 565, revenue: "AED 96,000", partners: 3, campaigns: 2, referrals: "138", bundles: ["Coast + Wellness", "Recovery Stay", "Wellness Weekend"], initials: "WP", color: "#CE7D9D" },
  { id: "retail", name: "Retail Partner", category: "Retail", x: 130, y: 365, revenue: "AED 78,000", partners: 3, campaigns: 1, referrals: "118", bundles: ["Destination Welcome", "Private Shopping", "Member Rewards"], initials: "RP", color: "#C59A51" },
  { id: "restaurant", name: "Premium Restaurant Partner", category: "Dining", x: 240, y: 160, revenue: "AED 142,000", partners: 5, campaigns: 2, referrals: "186", bundles: ["Stay + Dining", "Sunset Dining", "Chef + Chauffeur"], initials: "PR", color: "#58A98D" },
  { id: "anchor-hotel", name: "Waldorf Astoria RAK", category: "Anchor Hotel", x: 500, y: 610, revenue: "AED 118,000", partners: 5, campaigns: 2, referrals: "146", bundles: ["RAK Connected Escape", "Wellness Weekend", "Destination Welcome"], initials: "WA", color: "#A075E1" },
];
