export interface TravelPackage {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  from: string;
  to: string;
  duration: string;
  highlights: string[];
  content: string;
  relatedCitySlugs: string[];
}

export const TRAVEL_PACKAGES: TravelPackage[] = [
  {
    slug: "singapore-to-hcmc-nightlife-trip",
    title: "Singapore to Ho Chi Minh City Nightlife Trip",
    description:
      "Plan your Singapore to HCMC nightlife weekend — flights, best districts, KTV booking and travel tips.",
    keywords: ["singapore to hcmc", "saigon nightlife trip", "weekend trip vietnam"],
    from: "Singapore",
    to: "Ho Chi Minh City",
    duration: "2–3 days",
    highlights: ["District 1 clubs & bars", "Premium HCMC KTVs", "Live house experiences", "24/7 WhatsApp concierge"],
    relatedCitySlugs: ["ho-chi-minh-city-nightlife"],
    content: `## Singapore → Ho Chi Minh City Nightlife Trip

A short 2-hour flight from Singapore opens up Saigon's incredible nightlife scene at a fraction of Singapore prices.

## Quick Facts

- **Flight time**: ~2 hours (SIN → SGN)
- **Best duration**: 2–3 days
- **Budget**: VND 2–5M per KTV session vs SGD 500–900 in Singapore
- **Best area**: District 1

## Suggested Itinerary

### Day 1 — Arrive & Explore
- Check in to District 1 hotel
- Evening: Bui Vien walking street for atmosphere
- Late night: Book a premium KTV via Asia Night Life

### Day 2 — Full Nightlife Experience
- Afternoon: Explore Ben Thanh / City highlights
- Evening: Live house or rooftop bar
- Late night: VIP KTV session

### Day 3 — Departure
- Morning: Optional spa/massage
- Afternoon flight back to Singapore

## Book Before You Fly

Pre-book your KTV sessions through our WhatsApp concierge to guarantee VIP rooms on arrival.`,
  },
  {
    slug: "singapore-to-bangkok-nightlife-guide",
    title: "Singapore to Bangkok Nightlife Guide",
    description:
      "Complete guide for Singapore travellers visiting Bangkok nightlife — Sukhumvit clubs, RCA, and VIP booking.",
    keywords: ["singapore to bangkok nightlife", "bangkok trip from singapore", "sukhumvit guide"],
    from: "Singapore",
    to: "Bangkok",
    duration: "3–4 days",
    highlights: ["Sukhumvit superclubs", "Rooftop sky bars", "RCA party zone", "VIP table booking"],
    relatedCitySlugs: ["bangkok-nightlife"],
    content: `## Singapore → Bangkok Nightlife Guide

Bangkok is Asia's clubbing capital — and just a 2.5-hour flight from Singapore.

## Why Bangkok?

- World-class superclubs (Onyx, Insanity, Route 66)
- Legendary rooftop bars
- Value-for-money bottle service
- Vibrant KTV scene growing in Sukhumvit

## Top Areas for Singapore Visitors

1. **Sukhumvit Soi 11** — International crowd, top clubs
2. **Thonglor/Ekkamai** — Upscale, less touristy
3. **RCA** — High-energy EDM zone

## Booking Tips

- Reserve VIP tables before Friday/Saturday flights
- Use Asia Night Life concierge for English-speaking support
- Grab works well for late-night transport

[Browse Bangkok venues →](/bangkok-nightlife)`,
  },
  {
    slug: "singapore-to-vietnam-bachelor-trip",
    title: "Singapore to Vietnam Bachelor Trip",
    description:
      "Plan the ultimate bachelor party in Vietnam — HCMC and Hanoi nightlife, KTV packages, group booking tips.",
    keywords: ["vietnam bachelor party", "bachelor trip hcmc", "stag party vietnam"],
    from: "Singapore",
    to: "Vietnam",
    duration: "3–4 days",
    highlights: ["Group KTV packages", "VIP room reservations", "Multi-venue itinerary", "Dedicated concierge"],
    relatedCitySlugs: ["ho-chi-minh-city-nightlife", "hanoi-nightlife"],
    content: `## Singapore → Vietnam Bachelor Trip

Vietnam is one of Asia's top bachelor party destinations — great value, vibrant nightlife, and premium KTV options.

## Best Cities

- **Ho Chi Minh City** — Larger venue selection, more international-friendly
- **Hanoi** — Unique Old Quarter experience + premium KTV

## Group Booking Tips

- Book VIP rooms for 10–15 guests minimum 1 week ahead
- Ask about all-night packages for better value
- Assign one person as WhatsApp contact with our concierge
- Mix KTV + live house + rooftop for variety

## Sample 3-Night Itinerary (HCMC)

| Night | Activity |
|-------|----------|
| Night 1 | Welcome dinner + District 1 bar crawl |
| Night 2 | Premium KTV VIP room (main event) |
| Night 3 | Live house + late-night lounge |

## Contact Our Concierge

WhatsApp us with your group size, dates, and budget — we'll build a custom itinerary.`,
  },
  {
    slug: "singapore-to-kota-kinabalu-nightlife",
    title: "Singapore to Kota Kinabalu Nightlife Weekend",
    description:
      "Weekend getaway from Singapore to KK — flights, nightlife spots, and booking guide.",
    keywords: ["singapore to kota kinabalu", "kk weekend trip", "sabah nightlife"],
    from: "Singapore",
    to: "Kota Kinabalu",
    duration: "2–3 days",
    highlights: ["Short 2-hour flight", "Beach + nightlife combo", "Affordable KTV options"],
    relatedCitySlugs: ["kota-kinabalu-nightlife"],
    content: `## Singapore → Kota Kinabalu Weekend

KK is a popular short getaway combining beaches, seafood, and growing nightlife options.

## Quick Facts

- **Flight**: ~2 hours SIN → BKI
- **Best for**: Weekend trips (Fri–Sun)
- **Nightlife**: KTV lounges, beach bars, local clubs

[Browse KK venues →](/kota-kinabalu-nightlife)`,
  },
];

export function getTravelPackageBySlug(slug: string): TravelPackage | undefined {
  return TRAVEL_PACKAGES.find((p) => p.slug === slug);
}

export const TRAVEL_SLUGS = TRAVEL_PACKAGES.map((p) => p.slug);
