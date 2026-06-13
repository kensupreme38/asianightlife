/**
 * City configuration for landing pages, venue URLs, and filtering.
 */

export interface CityConfig {
  /** URL slug for city landing page, e.g. singapore-nightlife */
  slug: string;
  /** Short code for venue URLs, e.g. singapore */
  code: string;
  name: string;
  country: string;
  /** ISO 3166-1 alpha-2 for flag image (e.g. sg, vn) */
  countryCode: string;
  /** @deprecated Use countryCode + CountryFlag — emoji flags break on Windows */
  flag: string;
  /** Filter key matching use-venues CITY_PATTERNS */
  filterKey: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

export const CITY_PATTERNS: Record<string, string[]> = {
  hanoi: ["hanoi", "hà nội", "hoan kiem district", "tho nhuom", "tran hung dao ward", "ba đình", "ba dinh"],
  "ho chi minh city": [
    "ho chi minh", "hồ chí minh", "ho chi minh city", "hcm", "saigon", "sài gòn",
    "district 1", "district 3", "district 5", "district 6", "quận 1", "quận 3", "quận 5", "quận 6",
    "trần hưng đạo", "phạm viết chánh", "đề thám", "an duong vuong", "bui thi xuan",
    "cho lon", "võ thị sáu", "hoang sa", "le thanh ton", "lê thánh tôn", "ben nghe ward", "hcmc",
  ],
  danang: ["da nang", "đà nẵng", "da nang city"],
  "nha trang": ["nha trang"],
  "vung tau": ["vung tau", "vũng tàu"],
  "can tho": ["can tho", "cần thơ"],
  "phu quoc": ["phu quoc", "phú quốc"],
  singapore: ["singapore", "selegie", "orchard", "clarke quay", "boat quay", "tanjong pagar"],
  bangkok: ["bangkok", "sukhumvit", "silom", "thonglor", "ekkamai", "asok", "nana"],
  "chiang mai": ["chiang mai", "chiangmai"],
  pattaya: ["pattaya"],
  phuket: ["phuket"],
  "hat yai": ["hat yai"],
  penang: ["penang"],
  "kuala lumpur": ["kuala lumpur", "kl", "bukit bintang"],
  "johor bahru": ["johor bahru", "jb", "johor"],
  kuching: ["kuching"],
  "kota kinabalu": ["kota kinabalu", "kk sabah"],
};

export const CITIES: CityConfig[] = [
  {
    slug: "singapore-nightlife",
    code: "singapore",
    name: "Singapore",
    country: "Singapore",
    countryCode: "sg",
    flag: "🇸🇬",
    filterKey: "singapore",
    seoTitle: "Singapore Nightlife – Best KTVs, Clubs & VIP Lounges | Asia Night Life",
    seoDescription:
      "Book verified KTVs, clubs, live houses and VIP lounges in Singapore. Compare prices, read reviews, and reserve via WhatsApp concierge 24/7.",
    seoKeywords: ["singapore ktv booking", "singapore nightlife", "singapore clubs", "ktv singapore", "vip room singapore"],
    heroTitle: "Singapore Nightlife",
    heroSubtitle: "KTVs • Clubs • Live Houses • VIP Lounges",
    intro:
      "Singapore is Southeast Asia's premium nightlife hub — from Orchard KTV lounges to Clarke Quay clubs. Asia Night Life connects you with verified venues, transparent pricing, and instant WhatsApp booking.",
    faqs: [
      { question: "How do I book a KTV in Singapore?", answer: "Choose a venue on this page, fill in your date, time and group size, then confirm via WhatsApp. Our concierge handles the rest 24/7." },
      { question: "What is the average KTV price in Singapore?", answer: "Most KTV sessions range from SGD 300–900+ depending on room size, drinks package and timing. Each venue listing shows indicative pricing." },
      { question: "Do I need to book in advance?", answer: "Weekends and public holidays fill up fast. We recommend booking at least 24 hours ahead for guaranteed VIP rooms." },
    ],
  },
  {
    slug: "ho-chi-minh-city-nightlife",
    code: "hcmc",
    name: "Ho Chi Minh City",
    country: "Vietnam",
    countryCode: "vn",
    flag: "🇻🇳",
    filterKey: "ho chi minh city",
    seoTitle: "Ho Chi Minh City Nightlife – District 1 KTVs & Clubs | Asia Night Life",
    seoDescription:
      "Discover HCMC nightlife in District 1, District 3 and beyond. Book KTVs, live houses and VIP lounges with verified listings and WhatsApp concierge.",
    seoKeywords: ["hcmc nightlife", "saigon ktv", "district 1 nightlife", "ho chi minh clubs", "vietnam nightlife"],
    heroTitle: "Ho Chi Minh City Nightlife",
    heroSubtitle: "Saigon • District 1 • Live Houses • KTV",
    intro:
      "Saigon never sleeps. From District 1 rooftop bars to legendary KTV lounges, HCMC offers some of Vietnam's most vibrant nightlife. Book with confidence through Asia Night Life.",
    faqs: [
      { question: "Which area is best for nightlife in HCMC?", answer: "District 1 (Bui Vien, Le Thanh Ton) is the main hub. District 3 and District 5 (Chinatown) also have excellent KTV options." },
      { question: "Can tourists book KTV in Vietnam?", answer: "Yes. Our concierge assists international visitors with venue selection, pricing guidance and WhatsApp confirmation in English." },
      { question: "How much does KTV cost in HCMC?", answer: "Typical sessions range from VND 2–5 million+ depending on venue tier and package. Check individual venue pages for details." },
    ],
  },
  {
    slug: "bangkok-nightlife",
    code: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    countryCode: "th",
    flag: "🇹🇭",
    filterKey: "bangkok",
    seoTitle: "Bangkok Nightlife – Best Clubs in Sukhumvit & RCA | Asia Night Life",
    seoDescription:
      "Book Bangkok clubs, KTVs and sky bars in Sukhumvit, Thonglor and RCA. Verified venues with pricing, hours and WhatsApp booking.",
    seoKeywords: ["bangkok clubs", "bangkok nightlife", "sukhumvit clubs", "bangkok ktv", "rca bangkok"],
    heroTitle: "Bangkok Nightlife",
    heroSubtitle: "Sukhumvit • Thonglor • RCA • Sky Bars",
    intro:
      "Bangkok's nightlife scene spans world-class clubs on Sukhumvit, trendy Thonglor lounges and iconic RCA party zones. Find and book the best venues with Asia Night Life.",
    faqs: [
      { question: "What are the best club areas in Bangkok?", answer: "Sukhumvit (Soi 11), Thonglor/Ekkamai, and RCA are the top zones. Each has a different vibe — our concierge can recommend based on your preferences." },
      { question: "Is there a dress code for Bangkok clubs?", answer: "Most upscale clubs require smart casual — no flip-flops or sleeveless shirts for men. Check individual venue listings for specifics." },
      { question: "Can I book VIP tables in advance?", answer: "Yes. Use our booking form or WhatsApp concierge to reserve VIP tables with bottle service packages." },
    ],
  },
  {
    slug: "kuala-lumpur-nightlife",
    code: "kuala-lumpur",
    name: "Kuala Lumpur",
    country: "Malaysia",
    countryCode: "my",
    flag: "🇲🇾",
    filterKey: "kuala lumpur",
    seoTitle: "Kuala Lumpur Nightlife – KTVs & Clubs in KL | Asia Night Life",
    seoDescription:
      "Explore KL nightlife — Bukit Bintang clubs, premium KTV lounges and rooftop bars. Book verified venues across Kuala Lumpur.",
    seoKeywords: ["kuala lumpur nightlife", "kl clubs", "kl ktv", "bukit bintang nightlife"],
    heroTitle: "Kuala Lumpur Nightlife",
    heroSubtitle: "Bukit Bintang • KLCC • KTV Lounges",
    intro:
      "Kuala Lumpur blends Malay, Chinese and international nightlife cultures. From Bukit Bintang clubs to premium KTV lounges, Asia Night Life helps you book the best spots in KL.",
    faqs: [
      { question: "Where is the main nightlife area in KL?", answer: "Bukit Bintang and Changkat are the primary nightlife streets, with clubs and bars open until late." },
      { question: "Do KL venues accept card payment?", answer: "Most premium KTVs and clubs accept cards. Some smaller venues are cash-only — check venue details or ask our concierge." },
    ],
  },
  {
    slug: "johor-bahru-nightlife",
    code: "johor-bahru",
    name: "Johor Bahru",
    country: "Malaysia",
    countryCode: "my",
    flag: "🇲🇾",
    filterKey: "johor bahru",
    seoTitle: "Johor Bahru Nightlife Guide – KTVs & Entertainment Near Singapore | Asia Night Life",
    seoDescription:
      "JB nightlife guide for Singapore visitors. Book KTVs and entertainment venues in Johor Bahru with easy cross-border access.",
    seoKeywords: ["johor bahru nightlife", "jb ktv", "johor nightlife guide", "jb entertainment"],
    heroTitle: "Johor Bahru Nightlife",
    heroSubtitle: "Cross-Border • KTV • Entertainment",
    intro:
      "Just across the causeway from Singapore, Johor Bahru offers value-packed nightlife popular with weekend visitors. Browse verified JB venues and book via WhatsApp.",
    faqs: [
      { question: "Is JB nightlife popular with Singaporeans?", answer: "Yes — many Singapore visitors cross the border for KTV and entertainment at competitive prices, especially on weekends." },
      { question: "How do I get to JB nightlife venues?", answer: "Most venues are accessible by Grab from CIQ/Checkpoint. Our concierge can recommend venues near your location." },
    ],
  },
  {
    slug: "kuching-nightlife",
    code: "kuching",
    name: "Kuching",
    country: "Malaysia",
    countryCode: "my",
    flag: "🇲🇾",
    filterKey: "kuching",
    seoTitle: "Kuching Nightlife – Sarawak Entertainment Guide | Asia Night Life",
    seoDescription:
      "Discover Kuching nightlife and entertainment venues in Sarawak. Book KTVs and lounges with Asia Night Life.",
    seoKeywords: ["kuching nightlife", "sarawak entertainment", "kuching ktv"],
    heroTitle: "Kuching Nightlife",
    heroSubtitle: "Sarawak • KTV • Local Entertainment",
    intro:
      "Kuching offers a laid-back nightlife scene with local KTV lounges and entertainment spots. Explore Sarawak's best venues through Asia Night Life.",
    faqs: [
      { question: "What nightlife options exist in Kuching?", answer: "Kuching has several KTV lounges and bars, popular with locals and visitors exploring Sarawak." },
    ],
  },
  {
    slug: "kota-kinabalu-nightlife",
    code: "kota-kinabalu",
    name: "Kota Kinabalu",
    country: "Malaysia",
    countryCode: "my",
    flag: "🇲🇾",
    filterKey: "kota kinabalu",
    seoTitle: "Kota Kinabalu Nightlife – Sabah Entertainment Guide | Asia Night Life",
    seoDescription:
      "Book Kota Kinabalu nightlife — KTVs, clubs and beach bars in Sabah. Popular with Singapore and regional travellers.",
    seoKeywords: ["kota kinabalu nightlife", "kk nightlife", "sabah entertainment", "kk ktv"],
    heroTitle: "Kota Kinabalu Nightlife",
    heroSubtitle: "Sabah • Beach Bars • KTV",
    intro:
      "KK combines island vibes with vibrant nightlife. Popular with Singapore travellers flying in for weekends, Kota Kinabalu has growing KTV and club options.",
    faqs: [
      { question: "Is KK popular for Singapore weekend trips?", answer: "Yes — short flights from Singapore make KK a popular weekend destination combining beaches and nightlife." },
    ],
  },
  {
    slug: "hanoi-nightlife",
    code: "hanoi",
    name: "Hanoi",
    country: "Vietnam",
    countryCode: "vn",
    flag: "🇻🇳",
    filterKey: "hanoi",
    seoTitle: "Hanoi Nightlife – Old Quarter Bars & KTV Guide | Asia Night Life",
    seoDescription:
      "Explore Hanoi nightlife from the Old Quarter to Tay Ho. Book KTVs, live houses and lounges with verified listings.",
    seoKeywords: ["hanoi nightlife", "hanoi ktv", "old quarter bars", "vietnam nightlife hanoi"],
    heroTitle: "Hanoi Nightlife",
    heroSubtitle: "Old Quarter • Tay Ho • Live Houses",
    intro:
      "Hanoi's nightlife blends Old Quarter beer streets with upscale KTV lounges and live music venues. Discover and book through Asia Night Life.",
    faqs: [
      { question: "Where do locals go for nightlife in Hanoi?", answer: "Ta Hien (Beer Street) in the Old Quarter is iconic. For KTV and upscale venues, Ba Dinh and Tay Ho areas are popular." },
    ],
  },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);
export const CITY_CODES = CITIES.map((c) => c.code);

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getCityByCode(code: string): CityConfig | undefined {
  return CITIES.find((c) => c.code === code);
}

export function matchesCity(address: string, filterKey: string): boolean {
  const patterns = CITY_PATTERNS[filterKey];
  if (!patterns) return false;
  const lower = address.toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

export function detectCityFromVenue(country: string, address: string): CityConfig | undefined {
  const countryLower = country.toLowerCase();

  for (const city of CITIES) {
    if (city.country.toLowerCase() !== countryLower) continue;
    if (matchesCity(address, city.filterKey)) return city;
  }

  // Country-only fallback for single-city countries
  if (countryLower === "singapore") return getCityByCode("singapore");
  if (countryLower === "thailand" && matchesCity(address, "bangkok")) return getCityByCode("bangkok");

  return CITIES.find((c) => c.country.toLowerCase() === countryLower);
}

export function getVenuePath(cityCode: string, venueSlug: string): string {
  return `/${cityCode}/${venueSlug}`;
}
