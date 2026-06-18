import { BROWSE_COUNTRIES, browseImage } from "./browse-cards-data";

export interface CountryConfig {
  slug: string;
  /** DB filter value, e.g. "Singapore" */
  id: string;
  name: string;
  countryCode: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

const slugForCountry = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-");

const countryExtras: Record<
  string,
  Pick<
    CountryConfig,
    | "seoTitle"
    | "seoDescription"
    | "seoKeywords"
    | "heroTitle"
    | "heroSubtitle"
    | "intro"
    | "faqs"
  >
> = {
  Singapore: {
    seoTitle: "Singapore Nightlife – KTVs, Clubs & VIP Lounges | Asia Night Life",
    seoDescription:
      "Explore verified KTVs, nightclubs, live houses and VIP lounges across Singapore. Compare venues, check pricing and book via WhatsApp concierge 24/7.",
    seoKeywords: ["singapore nightlife", "singapore ktv", "singapore clubs", "book ktv singapore"],
    heroTitle: "Singapore Nightlife",
    heroSubtitle: "KTVs • Clubs • Live Houses • VIP Lounges",
    intro:
      "Singapore is Southeast Asia's premium nightlife hub — from Orchard KTV lounges to Clarke Quay clubs. Browse verified venues and book instantly with Asia Night Life.",
    faqs: [
      {
        question: "How do I book nightlife in Singapore?",
        answer:
          "Pick a venue on this page, submit your booking details, and confirm via WhatsApp. Our concierge supports you 24/7 in English.",
      },
      {
        question: "What types of venues are available in Singapore?",
        answer:
          "Singapore listings include KTV lounges, nightclubs, live houses, sky bars, hotels and restaurants across the island.",
      },
    ],
  },
  Vietnam: {
    seoTitle: "Vietnam Nightlife – HCMC, Hanoi KTVs & Clubs | Asia Night Life",
    seoDescription:
      "Discover nightlife across Vietnam — Ho Chi Minh City, Hanoi and more. Book KTVs, live houses and VIP lounges with verified listings.",
    seoKeywords: ["vietnam nightlife", "saigon ktv", "hanoi nightlife", "vietnam clubs"],
    heroTitle: "Vietnam Nightlife",
    heroSubtitle: "Saigon • Hanoi • Coastal Cities • KTV",
    intro:
      "From Saigon's District 1 to Hanoi's Old Quarter, Vietnam offers vibrant KTV lounges, live houses and rooftop bars. Find and book verified venues here.",
    faqs: [
      {
        question: "Which cities have the most nightlife in Vietnam?",
        answer:
          "Ho Chi Minh City and Hanoi have the largest selection. Danang, Nha Trang and Can Tho are growing hubs for visitors.",
      },
      {
        question: "Can tourists book KTV in Vietnam?",
        answer:
          "Yes. Our concierge assists international visitors with venue selection, pricing guidance and WhatsApp confirmation in English.",
      },
    ],
  },
  Thailand: {
    seoTitle: "Thailand Nightlife – Bangkok Clubs & KTVs | Asia Night Life",
    seoDescription:
      "Book Bangkok clubs, KTVs and sky bars. Explore Thailand nightlife in Sukhumvit, RCA, Pattaya, Phuket and Chiang Mai.",
    seoKeywords: ["thailand nightlife", "bangkok clubs", "thailand ktv", "pattaya nightlife"],
    heroTitle: "Thailand Nightlife",
    heroSubtitle: "Bangkok • Pattaya • Phuket • Chiang Mai",
    intro:
      "Thailand's nightlife spans world-class Bangkok clubs, beach-town parties and premium KTV lounges. Browse verified venues and book with confidence.",
    faqs: [
      {
        question: "Where is the best nightlife in Thailand?",
        answer:
          "Bangkok (Sukhumvit, Thonglor, RCA) is the main hub. Pattaya, Phuket and Chiang Mai each have distinct scenes.",
      },
    ],
  },
  Malaysia: {
    seoTitle: "Malaysia Nightlife – KL, Penang & Johor KTVs | Asia Night Life",
    seoDescription:
      "Explore nightlife in Kuala Lumpur, Penang, Johor Bahru and East Malaysia. Verified KTV lounges and clubs with WhatsApp booking.",
    seoKeywords: ["malaysia nightlife", "kuala lumpur ktv", "kl clubs", "penang nightlife"],
    heroTitle: "Malaysia Nightlife",
    heroSubtitle: "Kuala Lumpur • Penang • Johor • East Malaysia",
    intro:
      "Malaysia combines cosmopolitan KL nightlife with cross-border entertainment in Johor Bahru and local scenes in Penang and Borneo.",
    faqs: [
      {
        question: "What nightlife is popular in Malaysia?",
        answer:
          "KTV lounges are especially popular in KL and Johor Bahru. Bukit Bintang and KLCC are key zones for clubs and bars.",
      },
    ],
  },
  Indonesia: {
    seoTitle: "Indonesia Nightlife – Jakarta & Beyond | Asia Night Life",
    seoDescription:
      "Discover Indonesia nightlife — Jakarta clubs, KTVs and entertainment venues. Verified listings coming to Asia Night Life.",
    seoKeywords: ["indonesia nightlife", "jakarta clubs", "jakarta ktv"],
    heroTitle: "Indonesia Nightlife",
    heroSubtitle: "Jakarta • Bali • Surabaya",
    intro:
      "Indonesia's nightlife scene is centred on Jakarta's mega-clubs and growing entertainment districts. More verified venues are being added.",
    faqs: [],
  },
  Cambodia: {
    seoTitle: "Cambodia Nightlife – Phnom Penh Venues | Asia Night Life",
    seoDescription:
      "Explore nightlife in Cambodia. Browse verified KTV and entertainment venues in Phnom Penh and beyond.",
    seoKeywords: ["cambodia nightlife", "phnom penh ktv", "cambodia clubs"],
    heroTitle: "Cambodia Nightlife",
    heroSubtitle: "Phnom Penh • Siem Reap",
    intro:
      "Cambodia offers a growing nightlife scene in Phnom Penh with KTV lounges and riverside bars for locals and visitors.",
    faqs: [],
  },
  Japan: {
    seoTitle: "Japan Nightlife – Tokyo Clubs & KTVs | Asia Night Life",
    seoDescription:
      "Discover Japan nightlife in Tokyo, Osaka and beyond. KTV, clubs and premium lounges — listings expanding on Asia Night Life.",
    seoKeywords: ["japan nightlife", "tokyo clubs", "tokyo ktv"],
    heroTitle: "Japan Nightlife",
    heroSubtitle: "Tokyo • Osaka • Night Districts",
    intro:
      "Japan's nightlife ranges from neon-lit Tokyo districts to premium karaoke and club culture. Verified listings are expanding.",
    faqs: [],
  },
  Macao: {
    seoTitle: "Macao Nightlife – Casinos & Entertainment | Asia Night Life",
    seoDescription:
      "Explore Macao nightlife — casinos, clubs and entertainment venues. Verified listings on Asia Night Life.",
    seoKeywords: ["macao nightlife", "macau clubs", "macau entertainment"],
    heroTitle: "Macao Nightlife",
    heroSubtitle: "Cotai • Macau Peninsula • Nightlife",
    intro:
      "Macao blends world-famous casino resorts with clubs and lounges. Discover entertainment venues across the SAR.",
    faqs: [],
  },
  Philippines: {
    seoTitle: "Philippines Nightlife – Manila & Beyond | Asia Night Life",
    seoDescription:
      "Discover Philippines nightlife in Manila, Cebu and more. KTV, clubs and lounges — verified listings on Asia Night Life.",
    seoKeywords: ["philippines nightlife", "manila clubs", "manila ktv"],
    heroTitle: "Philippines Nightlife",
    heroSubtitle: "Manila • Cebu • Metro Areas",
    intro:
      "The Philippines offers vibrant metro nightlife centred on Manila, with growing scenes in Cebu and other cities.",
    faqs: [],
  },
  "South Korea": {
    seoTitle: "South Korea Nightlife – Seoul Clubs & KTVs | Asia Night Life",
    seoDescription:
      "Explore Seoul nightlife — clubs, KTV (noraebang) and lounges. Verified entertainment venues on Asia Night Life.",
    seoKeywords: ["seoul nightlife", "korea clubs", "seoul ktv", "noraebang"],
    heroTitle: "South Korea Nightlife",
    heroSubtitle: "Seoul • Gangnam • Hongdae",
    intro:
      "Seoul's nightlife spans Gangnam lounges, Hongdae clubs and premium noraebang (KTV). Verified listings are expanding.",
    faqs: [],
  },
  Taiwan: {
    seoTitle: "Taiwan Nightlife – Taipei Clubs & KTVs | Asia Night Life",
    seoDescription:
      "Discover Taiwan nightlife in Taipei and beyond. KTV, clubs and night markets — verified venues on Asia Night Life.",
    seoKeywords: ["taiwan nightlife", "taipei clubs", "taipei ktv"],
    heroTitle: "Taiwan Nightlife",
    heroSubtitle: "Taipei • Xinyi • Night Markets",
    intro:
      "Taipei's nightlife mixes rooftop bars, KTV lounges and legendary night markets. Browse verified entertainment venues.",
    faqs: [],
  },
};

export const COUNTRIES: CountryConfig[] = BROWSE_COUNTRIES.map((c) => {
  const slug = slugForCountry(c.id === "South Korea" ? "south-korea" : c.name.toLowerCase());
  const imageSlug =
    c.id === "South Korea" ? "south-korea" : c.name.toLowerCase().replace(/\s+/g, "-");
  const extras = countryExtras[c.id];
  return {
    slug,
    id: c.id,
    name: c.name,
    countryCode: c.countryCode ?? "",
    imageUrl: c.imageUrl || browseImage("countries", imageSlug),
    ...extras,
  };
});

export const COUNTRY_SLUGS = COUNTRIES.map((c) => c.slug);

const countryBySlug = new Map(COUNTRIES.map((c) => [c.slug, c]));
const countryById = new Map(COUNTRIES.map((c) => [c.id, c]));

export function getCountryBySlug(slug: string): CountryConfig | undefined {
  return countryBySlug.get(slug);
}

export function getCountryById(id: string): CountryConfig | undefined {
  return countryById.get(id);
}

export function getCountrySlug(countryId: string): string | undefined {
  return getCountryById(countryId)?.slug;
}
