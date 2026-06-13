export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: "basics" | "city-guide" | "how-to" | "glossary";
  readTime: string;
  content: string;
  relatedCitySlug?: string;
}

export const GUIDES: GuideArticle[] = [
  {
    slug: "what-is-a-ktv",
    title: "What is a KTV?",
    description:
      "Everything you need to know about KTV karaoke lounges in Southeast Asia — how they work, pricing, etiquette and what to expect on your first visit.",
    keywords: ["what is ktv", "ktv meaning", "karaoke lounge asia", "ktv explained"],
    category: "basics",
    readTime: "5 min",
    content: `## What is a KTV?

KTV (Karaoke Television) lounges are private-room karaoke venues popular across East and Southeast Asia. Unlike Western-style open-mic karaoke bars, KTVs offer **private rooms** with premium sound systems, comfortable seating, and hostess service.

## How KTV Works

1. **Book a room** — Choose room size based on your group (small 4–6, medium 8–12, large 15+)
2. **Select a package** — Usually includes room time + drinks/fruit platter
3. **Enjoy** — Sing, drink, and socialise in your private space
4. **Pay** — Settlement at end of session; card or cash depending on venue

## KTV vs Club

| KTV | Club |
|-----|------|
| Private rooms | Open dance floor |
| Hostess service | DJ + bottle service |
| Conversation-friendly | High energy |
| Typical 3–6 hours | Arrive late, stay until close |

## Pricing Overview

- **Singapore**: SGD 300–900+ per session
- **Vietnam**: VND 2–8 million+ per session
- **Thailand**: THB 3,000–15,000+ per session
- **Malaysia**: MYR 200–800+ per session

Prices vary by venue tier, day of week, and package inclusions.

## First-Timer Tips

- Book through a trusted platform like Asia Night Life for verified venues
- Arrive on time — popular rooms get snapped up on weekends
- Ask about happy hour packages for better value
- Dress smart casual at premium venues`,
  },
  {
    slug: "singapore-ktv-guide",
    title: "Singapore KTV Guide 2026",
    description:
      "Complete guide to Singapore KTV booking — best areas, pricing, VIP rooms, and how to book through WhatsApp concierge.",
    keywords: ["singapore ktv guide", "best ktv singapore", "ktv booking singapore 2026"],
    category: "city-guide",
    readTime: "8 min",
    relatedCitySlug: "singapore-nightlife",
    content: `## Singapore KTV Guide

Singapore's KTV scene is concentrated around **Orchard**, **Selegie**, and **Tanyeon Pagar** areas, with premium lounges offering VIP rooms and bottle service.

## Best Areas

- **Selegie / Parklane** — Classic KTV cluster, many established venues
- **Orchard** — Upscale options near shopping district
- **Clarke Quay / Boat Quay** — Mix of KTV and nightlife

## How to Book

1. Browse venues on [Singapore Nightlife](/singapore-nightlife)
2. Select your preferred KTV
3. Fill in date, time, and group size
4. Confirm via WhatsApp — our concierge handles the rest

## Price Guide

| Tier | Typical Range | What You Get |
|------|--------------|--------------|
| Standard | SGD 300–500 | Room + basic drinks |
| Premium | SGD 500–700 | Larger room + premium drinks |
| VIP | SGD 700–900+ | VIP room + bottle packages |

## Tips for Visitors

- Book 24–48 hours ahead on weekends
- Happy hour (before 8 PM) often offers 20–30% savings
- Ask about referral codes for special packages`,
  },
  {
    slug: "vietnam-nightlife-guide",
    title: "Vietnam Nightlife Guide",
    description:
      "Complete Vietnam nightlife guide covering HCMC, Hanoi, pricing, districts, and booking tips for international visitors.",
    keywords: ["vietnam nightlife guide", "vietnam ktv", "saigon nightlife", "hanoi bars"],
    category: "city-guide",
    readTime: "10 min",
    relatedCitySlug: "ho-chi-minh-city-nightlife",
    content: `## Vietnam Nightlife Overview

Vietnam offers some of Southeast Asia's most vibrant and affordable nightlife, with **Ho Chi Minh City** and **Hanoi** as the two main hubs.

## Ho Chi Minh City (Saigon)

- **District 1** — Main tourist nightlife zone (Bui Vien, Le Thanh Ton)
- **District 3** — Local-favourite KTV lounges
- **District 5** — Chinatown with unique live house options

[Explore HCMC venues →](/ho-chi-minh-city-nightlife)

## Hanoi

- **Old Quarter** — Iconic beer street (Ta Hien)
- **Tay Ho** — Upscale bars and lounges
- **Ba Dinh** — Premium KTV options

[Explore Hanoi venues →](/hanoi-nightlife)

## What to Expect

- KTV is the dominant nightlife format for groups
- Live houses feature Vietnamese pop and EDM
- Prices are significantly lower than Singapore
- English-speaking concierge recommended for first-timers`,
  },
  {
    slug: "thailand-nightlife-guide",
    title: "Thailand Nightlife Guide",
    description:
      "Bangkok nightlife guide — Sukhumvit clubs, RCA, KTV pricing, dress codes and booking tips.",
    keywords: ["thailand nightlife", "bangkok nightlife guide", "sukhumvit clubs"],
    category: "city-guide",
    readTime: "9 min",
    relatedCitySlug: "bangkok-nightlife",
    content: `## Thailand Nightlife Guide

Bangkok is one of Asia's top nightlife destinations with world-renowned clubs, rooftop bars, and a growing KTV scene.

## Key Areas

| Area | Vibe | Best For |
|------|------|----------|
| Sukhumvit (Soi 11) | International clubs | Clubbing |
| Thonglor/Ekkamai | Trendy, upscale | Lounge & clubs |
| RCA | Party zone | Young crowd, EDM |
| Silom | Mixed | LGBTQ+ friendly |

[Browse Bangkok venues →](/bangkok-nightlife)

## Dress Code

Most upscale venues require **smart casual**. Avoid flip-flops, shorts, and sleeveless shirts for men at premium clubs.

## Booking Tips

- VIP table reservations strongly recommended on weekends
- Use Asia Night Life WhatsApp concierge for bottle service packages
- Peak hours: 11 PM – 2 AM`,
  },
  {
    slug: "how-vip-room-booking-works",
    title: "How VIP Room Booking Works",
    description:
      "Step-by-step guide to booking VIP rooms at KTVs and clubs across Southeast Asia — packages, deposits, and confirmation process.",
    keywords: ["vip room booking", "ktv vip room", "how to book vip room"],
    category: "how-to",
    readTime: "6 min",
    content: `## How VIP Room Booking Works

VIP rooms at KTVs and clubs offer premium privacy, larger space, and enhanced service. Here's how booking works through Asia Night Life.

## Step-by-Step Process

### 1. Choose Your Venue
Browse our verified listings filtered by city and category. Each venue page shows pricing, hours, and photos.

### 2. Select Date & Time
Weekend slots (Friday–Saturday) fill fastest. Book at least 24 hours ahead for guaranteed availability.

### 3. Specify Group Size
Room size depends on headcount:
- **Small room**: 4–6 guests
- **Medium room**: 8–12 guests
- **VIP/Large room**: 15+ guests

### 4. WhatsApp Confirmation
Submit your booking request and our concierge confirms within 15–30 minutes with:
- Room availability
- Package options and pricing
- Venue address and directions

### 5. Arrive & Enjoy
Show your confirmation message at the venue. Settlement is typically at end of session.

## Package Types

- **Happy Hour** — Discounted rates before 8 PM
- **Standard** — Room + basic drinks/fruit
- **Premium** — Room + bottle packages
- **All-Night** — Extended hours with fixed pricing`,
  },
  {
    slug: "nightlife-terms-glossary",
    title: "Nightlife Terms & Acronyms",
    description:
      "Glossary of KTV, club and nightlife terms used across Singapore, Vietnam, Thailand and Malaysia.",
    keywords: ["nightlife terms", "ktv acronyms", "nightlife glossary"],
    category: "glossary",
    readTime: "4 min",
    content: `## Nightlife Terms & Acronyms

| Term | Meaning |
|------|---------|
| **KTV** | Karaoke Television — private room karaoke lounge |
| **VIP Room** | Premium private room with enhanced amenities |
| **Hostess** | Venue staff who accompany guests in KTV rooms |
| **Bottle Service** | Pre-ordered bottles delivered to your table/room |
| **Happy Hour** | Discounted pricing during early hours (typically before 8 PM) |
| **Minimum Spend** | Required spending amount for table/room reservation |
| **RCA** | Royal City Avenue — Bangkok's famous club zone |
| **District 1** | HCMC's central nightlife district |
| **Pax** | Number of people in your group |
| **Comp** | Complimentary (free items included in package) |
| **NAW** | Nightlife Asia Wiki — industry reference platform |
| **ANL** | Asia Night Life — this booking platform |`,
  },
  {
    slug: "first-time-visitor-guide",
    title: "First Time Visitor Guide",
    description:
      "First timer's guide to Southeast Asia nightlife — etiquette, safety, booking tips and what to expect at KTVs and clubs.",
    keywords: ["first time ktv", "nightlife first timer", "asia nightlife tips"],
    category: "how-to",
    readTime: "7 min",
    content: `## First Time Visitor Guide

Visiting KTVs and clubs in Southeast Asia for the first time? This guide covers everything you need to know.

## Before You Go

- **Book through a verified platform** — Avoid walk-in surprises with pricing
- **Bring ID** — Some venues require identification
- **Set a budget** — Decide your spending limit before arriving
- **Dress appropriately** — Smart casual for most premium venues

## At the Venue

1. Arrive on time for your reservation
2. Show your WhatsApp confirmation to staff
3. Choose your package with the mamasan/host
4. Enjoy your session — rooms are private and comfortable
5. Settle the bill before leaving

## Safety Tips

- Use official booking channels (Asia Night Life WhatsApp/Telegram)
- Keep valuables secure
- Drink responsibly
- Use Grab/taxi for transport after midnight

## Getting Help

Our concierge is available 24/7:
- **WhatsApp**: +65 8266 8669
- **Telegram**: @asianightlifeanl`,
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
