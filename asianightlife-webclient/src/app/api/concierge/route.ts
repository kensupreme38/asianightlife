import { NextResponse } from "next/server";
import {
  buildCitiesContext,
  buildVenueContextForQuestion,
  formatVenueMarkdownLink,
  hasGeminiApiKey,
  selectRelevantVenues,
} from "@/ai/concierge-context";
import { answerConciergeQuestion } from "@/ai/flows/concierge-chat";
import { normalizeConciergeMarkdown } from "@/lib/concierge-markdown";
import { CITIES } from "@/lib/cities";
import { fetchActiveVenues, type VenueRow } from "@/lib/venues-db";

const CITY_LIST = CITIES.map((c) => `${c.name} (${c.country})`).join(", ");

type VenueFields = Pick<
  VenueRow,
  "id" | "name" | "country" | "category" | "price" | "address" | "slug" | "hours"
>;

function ruleBasedAnswer(question: string, venues: VenueFields[]): string {
  const q = question.toLowerCase();
  const relevant = selectRelevantVenues(question, venues as VenueRow[], 6);

  const listVenues = (items: VenueFields[]) =>
    items.length
      ? items.map((v) => `- ${formatVenueMarkdownLink(v as VenueRow)}`).join("\n")
      : `- [Browse venues](/book)`;

  if (q.includes("book") || q.includes("booking") || q.includes("reserve") || q.includes("đặt")) {
    return `**How to book with Asia Night Life:**

1. Choose a venue — [Browse all venues](/book) or pick from our listings below
2. Select date, time & group size on the venue page
3. Confirm via WhatsApp — our concierge responds within 15–30 minutes

**Suggested venues for you:**
${listVenues(relevant)}

Questions? WhatsApp us anytime.`;
  }

  if (q.includes("ktv")) {
    const ktvs = relevant.filter((v) => v.category?.toLowerCase().includes("ktv"));
    const picks = ktvs.length ? ktvs : relevant;
    const cityHint =
      q.includes("singapore") || q.includes("sg")
        ? "[Singapore nightlife](/singapore-nightlife)"
        : q.includes("hcmc") || q.includes("saigon") || q.includes("ho chi minh")
          ? "[Ho Chi Minh City nightlife](/ho-chi-minh-city-nightlife)"
          : q.includes("bangkok")
            ? "[Bangkok nightlife](/bangkok-nightlife)"
            : q.includes("kuala") || q.includes(" kl")
              ? "[Kuala Lumpur nightlife](/kuala-lumpur-nightlife)"
              : "[Browse cities](/book)";

    return `**KTV recommendations** (from our verified listings):

${listVenues(picks.slice(0, 5))}

Explore more in ${cityHint}. Book via WhatsApp for instant confirmation.`;
  }

  if (q.includes("club")) {
    const clubs = relevant.filter((v) => v.category?.toLowerCase().includes("club"));
    return `**Club picks:**

${listVenues((clubs.length ? clubs : relevant).slice(0, 5))}

See [Bangkok nightlife](/bangkok-nightlife) or [Singapore nightlife](/singapore-nightlife) for more.`;
  }

  if (q.includes("vip")) {
    return `**VIP room options** (from database):

${listVenues(relevant.slice(0, 5))}

VIP sessions typically SGD 700–900+ in Singapore. Book 24h ahead on weekends — [Book now](/book).`;
  }

  if (q.includes("budget") || q.includes("500") || q.includes("cheap")) {
    const budget = venues.filter((v) => v.country === "Vietnam" || v.country === "Malaysia").slice(0, 4);
    return `**Budget-friendly options:**

${listVenues(budget.length ? budget : relevant.slice(0, 4))}

- Vietnam HCMC — often VND 2–3M (~SGD 150–250)
- [Johor Bahru nightlife](/johor-bahru-nightlife) — great value near Singapore

Tell us your city and date for exact packages — [Book](/book).`;
  }

  if (relevant.length > 0) {
    return `**Recommendations for you:**

${listVenues(relevant.slice(0, 6))}

Browse all venues at [Book](/book) or explore our city pages. We cover: ${CITY_LIST}.`;
  }

  return `Thanks for your question! Our concierge covers: ${CITY_LIST}.

Share your **city**, **date**, **group size** and **budget** for personalised picks.

[Browse venues](/book) · WhatsApp concierge 24/7`;
}

export async function POST(request: Request) {
  try {
    const { question, locale } = await request.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    const trimmed = question.trim().slice(0, 500);
    const { venues } = await fetchActiveVenues(
      "id, name, country, category, price, address, slug, hours"
    );

    const venueContext = buildVenueContextForQuestion(trimmed, venues);

    if (hasGeminiApiKey()) {
      try {
        const { answer } = await answerConciergeQuestion({
          question: trimmed,
          locale: typeof locale === "string" ? locale : undefined,
          citiesContext: buildCitiesContext(),
          venueContext,
        });
        return NextResponse.json({
          answer: normalizeConciergeMarkdown(answer),
          source: "gemini",
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("[POST /api/concierge] Gemini error:", error);
        }
      }
    } else if (process.env.NODE_ENV === "development") {
      console.warn(
        "[POST /api/concierge] GEMINI_API_KEY not set — using rule-based fallback."
      );
    }

    return NextResponse.json({
      answer: normalizeConciergeMarkdown(ruleBasedAnswer(trimmed, venues)),
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
