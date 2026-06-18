export type TrustPageSlug =
  | "about"
  | "contact"
  | "terms"
  | "privacy"
  | "booking-policy";

export type TrustPage = {
  slug: TrustPageSlug;
  title: string;
  description: string;
  content: string;
};

export const TRUST_PAGE_SLUGS: TrustPageSlug[] = [
  "about",
  "contact",
  "terms",
  "privacy",
  "booking-policy",
];

export const TRUST_PAGES: Record<TrustPageSlug, TrustPage> = {
  about: {
    slug: "about",
    title: "About Asia Night Life",
    description:
      "Learn about Asia Night Life — Southeast Asia's trusted nightlife booking concierge for KTVs, clubs and VIP lounges.",
    content: `## Who We Are

Asia Night Life (asianightlife.sg) is a Singapore-based nightlife booking concierge serving visitors and residents across **Singapore, Vietnam, Thailand and Malaysia**. We help guests discover verified KTVs, clubs, live houses and VIP lounges — then confirm availability, packages and pricing through our 24/7 WhatsApp team.

## What We Do

- **Curated venue listings** with photos, pricing guides, hours and location details
- **Instant WhatsApp booking** — share your date, group size and budget; we handle the rest
- **City guides & nightlife wiki** for first-time visitors
- **Flight + nightlife trip packages** for regional getaways

## Why Book With Us

1. **Verified listings** — we work directly with venue partners and update listings regularly
2. **Transparent pricing** — package ranges quoted before you commit
3. **Multilingual support** — English, Vietnamese, Chinese, Thai, Korean and more
4. **No hidden fees** — our concierge service is free for guests

## Our Promise

We aim to be the most reliable nightlife booking platform in Southeast Asia. Every listing is reviewed for accuracy. If a venue is closed or unavailable, we suggest alternatives in the same city and budget range.

**Operating entity:** Asia Night Life Platform  
**Concierge:** WhatsApp +65 8266 8669 | Telegram @asianightlifeanl  
**Website:** [asianightlife.sg](https://asianightlife.sg)
`,
  },
  contact: {
    slug: "contact",
    title: "Contact Us",
    description:
      "Reach Asia Night Life concierge 24/7 via WhatsApp or Telegram. Book KTVs, clubs and VIP lounges across Southeast Asia.",
    content: `## 24/7 Booking Concierge

Our team responds to booking enquiries **within 15–30 minutes** during peak hours, and faster off-peak.

### WhatsApp (Recommended)
**+65 8266 8669**  
Fastest way to check availability, packages and room types.

### Telegram
**@asianightlifeanl**  
Alternative channel for bookings and nightlife recommendations.

## What to Include in Your Message

For the quickest response, please share:

- **City** (e.g. Singapore, HCMC, Bangkok)
- **Venue name** (or type: KTV, club, VIP lounge)
- **Date & time**
- **Number of guests (pax)**
- **Budget range** (optional)
- **Preferred language**

Example: *"Hi, I want to book Supreme KTV Singapore on Friday 9pm for 6 pax. Budget around S$500."*

## Business Enquiries

For venue partnerships, media or corporate events, contact us via WhatsApp with the subject **"Partnership"**.

## Office

Asia Night Life operates as a digital-first concierge. Bookings are coordinated remotely with venue partners across Southeast Asia.
`,
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    description:
      "Terms of Service for Asia Night Life — nightlife venue listings and WhatsApp booking concierge.",
    content: `## 1. Acceptance of Terms

By using asianightlife.sg ("the Site") and our booking concierge services, you agree to these Terms of Service. If you do not agree, please do not use the Site.

## 2. Our Role

Asia Night Life is a **booking intermediary and information platform**. We connect guests with third-party entertainment venues. The venue provides the actual service; we facilitate communication, recommendations and booking coordination.

## 3. Bookings

- All bookings are **subject to venue availability** and confirmation by our concierge or the venue directly.
- Quoted prices are **indicative** until confirmed in writing (WhatsApp/Telegram).
- You are responsible for arriving on time and complying with venue house rules, dress codes and age restrictions.

## 4. Payments

Payment terms vary by venue. Some venues require deposits; others accept payment on arrival. Our concierge will explain payment methods before you confirm.

## 5. Cancellations & Changes

See our [Booking Policy](/booking-policy) for cancellation and refund guidelines. Policies may differ per venue.

## 6. Content Accuracy

We strive to keep venue information accurate and updated. Venues may change prices, hours or facilities without notice. We are not liable for discrepancies beyond our reasonable control.

## 7. Acceptable Use

You may not use the Site for unlawful purposes, harassment, scraping at scale, or to misrepresent our brand or venue partners.

## 8. Limitation of Liability

To the fullest extent permitted by law, Asia Night Life is not liable for indirect, incidental or consequential damages arising from venue services, third-party actions, or use of the Site.

## 9. Changes

We may update these Terms at any time. Continued use of the Site constitutes acceptance of the revised Terms.

## 10. Contact

Questions about these Terms: WhatsApp **+65 8266 8669**.

*Last updated: June 2025*
`,
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "How Asia Night Life collects, uses and protects your personal data when you browse or book via our platform.",
    content: `## 1. Overview

Asia Night Life ("we", "us") respects your privacy. This policy explains what data we collect when you use asianightlife.sg and our WhatsApp/Telegram concierge.

## 2. Data We Collect

- **Contact details** you provide: name, phone number, booking preferences
- **Usage data**: pages visited, device type, approximate location (via analytics)
- **Communications**: messages sent to our WhatsApp/Telegram for booking purposes
- **Cookies & analytics**: Google Analytics, Microsoft Clarity (where enabled) for site improvement

## 3. How We Use Your Data

- Process and coordinate booking requests
- Respond to enquiries and provide customer support
- Improve our website, listings and recommendations
- Send booking confirmations and follow-ups related to your request
- Comply with legal obligations

We do **not** sell your personal data to third parties.

## 4. Sharing With Third Parties

We may share necessary booking details (name, phone, date, pax) with **venue partners** to fulfil your reservation. We may use service providers (hosting, analytics) under appropriate safeguards.

## 5. Data Retention

Booking-related messages are retained as long as needed for customer service and legal compliance, then deleted or anonymised.

## 6. Your Rights

Depending on your jurisdiction, you may request access, correction or deletion of your personal data. Contact us via WhatsApp **+65 8266 8669**.

## 7. Security

We use industry-standard measures to protect data in transit and at rest. No method of transmission over the internet is 100% secure.

## 8. Children's Privacy

Our services are intended for adults (18+). We do not knowingly collect data from minors.

## 9. Changes

We may update this Privacy Policy periodically. The "last updated" date will reflect changes.

## 10. Contact

Privacy enquiries: WhatsApp **+65 8266 8669** or Telegram **@asianightlifeanl**.

*Last updated: June 2025*
`,
  },
  "booking-policy": {
    slug: "booking-policy",
    title: "Booking, Cancellation & Refund Policy",
    description:
      "Asia Night Life booking policy — confirmations, cancellations, refunds and no-show rules for nightlife venue reservations.",
    content: `## How Booking Works

1. **Enquiry** — Contact us via WhatsApp/Telegram or the on-site booking form
2. **Quote** — We confirm venue availability, room type and package price
3. **Confirmation** — You approve the quote; deposit may be required by the venue
4. **Reminder** — We send a reminder before your booking date
5. **Experience** — Arrive at the venue; show your confirmation to staff

## Confirmation

A booking is **confirmed** only when our concierge or the venue explicitly confirms in writing (WhatsApp/Telegram message). Verbal estimates are not binding until confirmed.

## Cancellations by Guest

| Timing | Policy |
|--------|--------|
| **More than 24 hours** before booking | Free cancellation in most cases; venue-specific rules apply |
| **Within 24 hours** | Cancellation fees or deposit forfeiture may apply |
| **No-show** | Deposits are typically non-refundable; full package charges may apply |

Always notify us as early as possible via WhatsApp. We will communicate the venue's specific policy before you pay any deposit.

## Cancellations by Venue

If a venue cancels or cannot honour a confirmed booking, we will offer **alternative venues** of similar standard and budget, or assist with a **full refund** of any deposit collected on their behalf.

## Refunds

- Refunds are processed according to the **venue's policy** and payment method used
- Processing time: typically **5–14 business days** depending on bank/payment provider
- Service fees paid directly to venues are governed by the venue's terms

## Changes & Rescheduling

Date, time or group size changes are subject to availability. Contact us at least **12 hours** in advance when possible.

## Disputes

If you experience an issue during your visit, message us **immediately** via WhatsApp so we can assist in real time.

## Contact

Booking policy questions: WhatsApp **+65 8266 8669**.

*Last updated: June 2025*
`,
  },
};

export function getTrustPage(slug: string): TrustPage | null {
  return TRUST_PAGES[slug as TrustPageSlug] ?? null;
}
