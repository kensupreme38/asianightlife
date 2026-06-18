import { BROWSE_CATEGORIES } from "./browse-cards-data";

export interface CategoryConfig {
  slug: string;
  /** Exact DB category string */
  id: string;
  name: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

const CATEGORY_SLUG_MAP: Record<string, string> = {
  KTV: "ktv",
  "Nightclub / clubbing": "nightclub",
  "Live house / Beer club": "live-house",
  Pub: "pub",
  "Lounge / Speakeasy bar": "lounge",
  "Sky Bar": "sky-bar",
  "Night market": "night-market",
  "Spa / Osen": "spa",
  Massage: "massage",
  Hotel: "hotel",
  Restaurants: "restaurants",
  Breakfast: "breakfast",
  "Supper (after 12 midnight)": "supper",
};

const categoryExtras: Record<
  string,
  Pick<
    CategoryConfig,
    | "seoTitle"
    | "seoDescription"
    | "seoKeywords"
    | "heroTitle"
    | "heroSubtitle"
    | "intro"
    | "faqs"
  >
> = {
  KTV: {
    seoTitle: "KTV Venues in Asia – Book Karaoke Lounges | Asia Night Life",
    seoDescription:
      "Browse KTV and karaoke lounges across Singapore, Vietnam, Thailand and Malaysia. Compare rooms, packages and book via WhatsApp.",
    seoKeywords: ["ktv booking", "karaoke asia", "ktv singapore", "ktv vietnam", "ktv bangkok"],
    heroTitle: "KTV & Karaoke Lounges",
    heroSubtitle: "Private rooms • VIP packages • WhatsApp booking",
    intro:
      "Asia Night Life lists verified KTV lounges with transparent pricing, room options and instant WhatsApp concierge booking across Southeast Asia.",
    faqs: [
      {
        question: "How do I book a KTV room?",
        answer:
          "Choose a venue, select your date and group size, then confirm via WhatsApp. Our concierge handles reservations 24/7.",
      },
      {
        question: "Which countries have the most KTV venues?",
        answer:
          "Singapore and Vietnam (especially Ho Chi Minh City) have the largest KTV selections on our platform.",
      },
    ],
  },
  "Nightclub / clubbing": {
    seoTitle: "Nightclubs & Clubs in Asia – Book VIP Tables | Asia Night Life",
    seoDescription:
      "Discover nightclubs and clubbing venues in Bangkok, Singapore, HCMC and more. Reserve VIP tables and bottle service.",
    seoKeywords: ["asia nightclubs", "bangkok clubs", "club booking", "vip table"],
    heroTitle: "Nightclubs & Clubbing",
    heroSubtitle: "VIP tables • Bottle service • Top DJs",
    intro:
      "From Bangkok's RCA to Singapore's Clarke Quay, find verified nightclubs with pricing, dress codes and WhatsApp booking.",
    faqs: [],
  },
  "Live house / Beer club": {
    seoTitle: "Live Houses & Beer Clubs in Asia | Asia Night Life",
    seoDescription:
      "Browse live music venues and beer clubs across Asia. Verified listings with booking support.",
    seoKeywords: ["live house asia", "beer club", "live music venue"],
    heroTitle: "Live Houses & Beer Clubs",
    heroSubtitle: "Live music • Local bands • Late nights",
    intro:
      "Live houses and beer clubs offer authentic local nightlife with live performances and casual drinks.",
    faqs: [],
  },
  Pub: {
    seoTitle: "Pubs in Asia – Casual Nightlife Venues | Asia Night Life",
    seoDescription: "Find pubs and casual bars across Asia. Verified venue listings on Asia Night Life.",
    seoKeywords: ["pub asia", "bars asia", "casual nightlife"],
    heroTitle: "Pubs",
    heroSubtitle: "Casual drinks • Social nights",
    intro: "Discover relaxed pub venues for drinks and social nights across our covered cities.",
    faqs: [],
  },
  "Lounge / Speakeasy bar": {
    seoTitle: "Lounges & Speakeasy Bars in Asia | Asia Night Life",
    seoDescription:
      "Explore premium lounges and speakeasy bars in Singapore, HCMC, Bangkok and Kuala Lumpur.",
    seoKeywords: ["speakeasy bar", "lounge bar asia", "vip lounge"],
    heroTitle: "Lounges & Speakeasy Bars",
    heroSubtitle: "Craft cocktails • Intimate settings",
    intro:
      "Premium lounges and hidden speakeasies offer curated cocktails and intimate nightlife experiences.",
    faqs: [],
  },
  "Sky Bar": {
    seoTitle: "Sky Bars in Asia – Rooftop Nightlife | Asia Night Life",
    seoDescription:
      "Browse rooftop sky bars with city views in Singapore, Bangkok, KL and HCMC. Book via WhatsApp.",
    seoKeywords: ["sky bar asia", "rooftop bar", "rooftop nightlife"],
    heroTitle: "Sky Bars",
    heroSubtitle: "Rooftop views • Sunset cocktails",
    intro:
      "Sky bars combine stunning skyline views with premium drinks — perfect for special nights out.",
    faqs: [],
  },
  "Night market": {
    seoTitle: "Night Markets in Asia | Asia Night Life",
    seoDescription: "Discover night markets and street food nightlife across Asia.",
    seoKeywords: ["night market asia", "street food night"],
    heroTitle: "Night Markets",
    heroSubtitle: "Street food • Local culture • Late nights",
    intro: "Night markets offer vibrant street food and local culture — listings expanding soon.",
    faqs: [],
  },
  "Spa / Osen": {
    seoTitle: "Spa & Osen Venues in Asia | Asia Night Life",
    seoDescription: "Browse spa and onsen-style wellness venues across Asia.",
    seoKeywords: ["spa asia", "onsen", "wellness nightlife"],
    heroTitle: "Spa & Osen",
    heroSubtitle: "Wellness • Relaxation",
    intro: "Premium spa and onsen venues for relaxation after a night out — listings expanding.",
    faqs: [],
  },
  Massage: {
    seoTitle: "Massage Venues in Asia | Asia Night Life",
    seoDescription: "Find massage and wellness venues across Asia on Asia Night Life.",
    seoKeywords: ["massage asia", "wellness venue"],
    heroTitle: "Massage",
    heroSubtitle: "Wellness • Recovery",
    intro: "Massage and wellness venues for recovery and relaxation — listings expanding.",
    faqs: [],
  },
  Hotel: {
    seoTitle: "Hotels with Nightlife Access in Asia | Asia Night Life",
    seoDescription:
      "Browse hotels near nightlife districts and venues with in-house entertainment across Asia.",
    seoKeywords: ["hotel asia nightlife", "hotel booking"],
    heroTitle: "Hotels",
    heroSubtitle: "Stay near the action • In-house venues",
    intro:
      "Hotels in prime nightlife districts — many with in-house KTV, bars or lounges for guests.",
    faqs: [],
  },
  Restaurants: {
    seoTitle: "Restaurants in Asia – Dining Near Nightlife | Asia Night Life",
    seoDescription:
      "Discover restaurants in nightlife districts across Singapore, Vietnam, Thailand and Malaysia.",
    seoKeywords: ["restaurants asia", "dining nightlife district"],
    heroTitle: "Restaurants",
    heroSubtitle: "Dining • Pre-club meals • Late dining",
    intro:
      "Restaurants in and around nightlife hubs — perfect for dinner before a night out.",
    faqs: [],
  },
  Breakfast: {
    seoTitle: "Breakfast Spots in Asia | Asia Night Life",
    seoDescription: "Find breakfast venues across Asia — listings expanding on Asia Night Life.",
    seoKeywords: ["breakfast asia"],
    heroTitle: "Breakfast",
    heroSubtitle: "Morning dining",
    intro: "Breakfast spots for early risers and post-party mornings — listings expanding.",
    faqs: [],
  },
  "Supper (after 12 midnight)": {
    seoTitle: "Late-Night Supper in Asia – After Midnight Dining | Asia Night Life",
    seoDescription:
      "Find supper spots open after midnight across Asia's nightlife cities.",
    seoKeywords: ["supper asia", "late night food", "after midnight dining"],
    heroTitle: "Supper (After Midnight)",
    heroSubtitle: "Late-night eats • Post-party food",
    intro:
      "When the clubs close, supper spots keep the night going — listings expanding across our cities.",
    faqs: [],
  },
};

export const CATEGORIES: CategoryConfig[] = BROWSE_CATEGORIES.map((c) => {
  const slug = CATEGORY_SLUG_MAP[c.id];
  const extras = categoryExtras[c.id];
  return {
    slug,
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    ...extras,
  };
});

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));
const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return categoryBySlug.get(slug);
}

export function getCategoryById(id: string): CategoryConfig | undefined {
  return categoryById.get(id);
}

export function getCategorySlug(categoryId: string): string | undefined {
  return getCategoryById(categoryId)?.slug;
}
