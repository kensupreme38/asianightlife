import { CITIES, CITY_PATTERNS, detectCityFromVenue, matchesCity, type CityConfig } from "@/lib/cities";
import { getVenueUrl } from "@/lib/venue-url";
import type { VenueRow } from "@/lib/venues-db";

const MAX_RELEVANT_VENUES = 40;
const MAX_NAMES_PER_BUCKET = 12;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ktv: ["ktv", "karaoke"],
  club: ["club", "nightclub", "discoteca"],
  lounge: ["lounge", "bar", "pub"],
  vip: ["vip", "private room", "private rooms"],
};

const QUESTION_STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "what", "which", "where", "how", "can", "i", "my", "me",
  "best", "good", "tonight", "today", "book", "booking", "recommend", "suggest", "please",
  "for", "in", "at", "to", "and", "or", "under", "budget", "cheap", "price", "pricing",
]);

export function buildCitiesContext(): string {
  return CITIES.map(
    (city) =>
      `${city.name}, ${city.country} — city page: [/${city.slug}] — areas: ${city.heroSubtitle}`
  ).join("\n");
}

function venuePath(venue: VenueRow): string {
  return getVenueUrl({
    slug: venue.slug ?? undefined,
    name: String(venue.name ?? ""),
    country: String(venue.country ?? ""),
    address: String(venue.address ?? ""),
  });
}

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function questionTokens(question: string): string[] {
  return normalizeText(question)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !QUESTION_STOP_WORDS.has(t));
}

function detectCitiesInQuestion(question: string): CityConfig[] {
  const q = normalizeText(question);
  const matched: CityConfig[] = [];

  for (const city of CITIES) {
    const cityName = normalizeText(city.name);
    const patterns = CITY_PATTERNS[city.filterKey] ?? [];
    const hit =
      q.includes(normalizeText(city.code)) ||
      q.includes(cityName) ||
      q.includes(normalizeText(city.country)) ||
      patterns.some((p) => q.includes(normalizeText(p)));

    if (hit) matched.push(city);
  }

  return matched;
}

function detectCategoriesInQuestion(question: string): string[] {
  const q = normalizeText(question);
  return Object.entries(CATEGORY_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => q.includes(kw)))
    .map(([cat]) => cat);
}

function scoreVenue(venue: VenueRow, question: string, cities: CityConfig[], categories: string[]): number {
  const q = normalizeText(question);
  const tokens = questionTokens(question);
  let score = 0;

  const name = normalizeText(String(venue.name ?? ""));
  const address = normalizeText(String(venue.address ?? ""));
  const country = normalizeText(String(venue.country ?? ""));
  const category = normalizeText(String(venue.category ?? ""));

  for (const token of tokens) {
    if (name.includes(token)) score += 12;
    if (address.includes(token)) score += 4;
    if (category.includes(token)) score += 6;
    if (country.includes(token)) score += 5;
  }

  for (const city of cities) {
    if (country === normalizeText(city.country)) score += 6;
    if (venue.address && matchesCity(String(venue.address), city.filterKey)) score += 14;
    if (q.includes(normalizeText(city.name)) && country === normalizeText(city.country)) score += 8;
  }

  for (const cat of categories) {
    const keywords = CATEGORY_KEYWORDS[cat] ?? [];
    if (keywords.some((kw) => category.includes(kw) || name.includes(kw))) score += 10;
  }

  if (q.includes("budget") || q.includes("cheap") || q.includes("500")) {
    const price = String(venue.price ?? "").toLowerCase();
    if (price && !price.includes("contact") && country === "vietnam") score += 4;
  }

  if (q.includes("vip") && (category.includes("ktv") || name.includes("vip"))) score += 8;

  return score;
}

export function selectRelevantVenues(question: string, venues: VenueRow[], limit = MAX_RELEVANT_VENUES): VenueRow[] {
  if (venues.length <= limit) return venues;

  const cities = detectCitiesInQuestion(question);
  const categories = detectCategoriesInQuestion(question);

  const scored = venues
    .map((venue) => ({
      venue,
      score: scoreVenue(venue, question, cities, categories),
    }))
    .sort((a, b) => b.score - a.score);

  const top = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.venue);

  if (top.length >= Math.min(limit, 8)) return top;

  // Broad question — mix top-scored with diversity by country
  const picked = new Map<string, VenueRow>();
  for (const { venue } of scored) {
    if (picked.size >= limit) break;
    picked.set(String(venue.id ?? venue.name), venue);
  }

  const byCountry = new Map<string, VenueRow[]>();
  for (const venue of venues) {
    const country = String(venue.country ?? "Unknown");
    const list = byCountry.get(country) ?? [];
    list.push(venue);
    byCountry.set(country, list);
  }

  for (const [, list] of byCountry) {
    for (const venue of list.slice(0, 6)) {
      if (picked.size >= limit) break;
      picked.set(String(venue.id ?? venue.name), venue);
    }
  }

  return [...picked.values()];
}

function formatVenueLine(venue: VenueRow): string {
  const path = venuePath(venue);
  const parts = [
    `name: ${venue.name}`,
    venue.category ? `category: ${venue.category}` : null,
    venue.price ? `price: ${venue.price}` : null,
    venue.address ? `address: ${String(venue.address).slice(0, 100)}` : null,
    venue.hours ? `hours: ${String(venue.hours).slice(0, 60)}` : null,
    `link: [${venue.name}](${path})`,
    `path: ${path}`,
  ].filter(Boolean);

  return `- ${parts.join(" | ")}`;
}

export function buildVenueContextForQuestion(question: string, venues: VenueRow[]): string {
  if (venues.length === 0) {
    return "No venues in database. Direct user to [Book venues](/book) or WhatsApp concierge.";
  }

  const relevant = selectRelevantVenues(question, venues);
  const cities = detectCitiesInQuestion(question);

  const countryCounts = venues.reduce<Record<string, number>>((acc, v) => {
    const c = String(v.country ?? "Unknown");
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  const categoryCounts = venues.reduce<Record<string, number>>((acc, v) => {
    const c = String(v.category ?? "Other");
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
  }, {});

  const lines: string[] = [
    `Total active venues in database: ${venues.length}`,
    `Countries: ${Object.entries(countryCounts).map(([k, v]) => `${k} (${v})`).join(", ")}`,
    `Categories: ${Object.entries(categoryCounts).map(([k, v]) => `${k} (${v})`).join(", ")}`,
  ];

  if (cities.length > 0) {
    lines.push(
      `Detected cities in question: ${cities.map((c) => `${c.name} → [/${c.slug}]`).join(", ")}`
    );
  }

  lines.push(
    "",
    `VENUES RANKED FOR THIS QUESTION (${relevant.length} of ${venues.length} — use exact "path" for Markdown links):`
  );

  for (const venue of relevant) {
    lines.push(formatVenueLine(venue));
  }

  // Compact index for venues not in top list (helps AI know what else exists)
  const relevantIds = new Set(relevant.map((v) => String(v.id ?? v.name)));
  const remaining = venues.filter((v) => !relevantIds.has(String(v.id ?? v.name)));

  if (remaining.length > 0) {
    lines.push("", "OTHER VENUE NAMES BY COUNTRY (link format: /{cityCode}/{venue-slug}):");
    const byCountry = new Map<string, VenueRow[]>();
    for (const v of remaining) {
      const c = String(v.country ?? "Unknown");
      const list = byCountry.get(c) ?? [];
      list.push(v);
      byCountry.set(c, list);
    }

    for (const [country, list] of [...byCountry.entries()].sort((a, b) => b[1].length - a[1].length)) {
      const names = list.slice(0, MAX_NAMES_PER_BUCKET).map((v) => {
        const city = detectCityFromVenue(String(v.country ?? ""), String(v.address ?? ""));
        return `${v.name} (${city?.code ?? "?"}/${getVenueUrl({ slug: v.slug ?? undefined, name: String(v.name ?? ""), country: String(v.country ?? ""), address: String(v.address ?? "") }).split("/").pop()})`;
      });
      const extra = list.length > MAX_NAMES_PER_BUCKET ? ` +${list.length - MAX_NAMES_PER_BUCKET} more` : "";
      lines.push(`${country}: ${names.join("; ")}${extra}`);
    }
  }

  return lines.join("\n");
}

/** @deprecated Use buildVenueContextForQuestion */
export function buildVenueContext(venues: VenueRow[]): string {
  return buildVenueContextForQuestion("", venues);
}

export function hasGeminiApiKey(): boolean {
  return Boolean(
    process.env.GEMINI_API_KEY?.trim() ||
      process.env.GOOGLE_GENAI_API_KEY?.trim() ||
      process.env.GOOGLE_API_KEY?.trim()
  );
}

export function formatVenueMarkdownLink(venue: VenueRow): string {
  const path = venuePath(venue);
  const price = venue.price ? ` — ${venue.price}` : "";
  return `[${venue.name}](${path})${price}`;
}
