import { ai } from "@/ai/genkit";
import { SITE_URL, WHATSAPP_DISPLAY } from "@/lib/constants";
import { z } from "genkit";

const ConciergeInputSchema = z.object({
  question: z.string().describe("The visitor's question about nightlife, KTV, clubs, or booking."),
  locale: z
    .string()
    .optional()
    .describe("User locale code, e.g. en, vi, zh — reply in this language when possible."),
  citiesContext: z.string().describe("Supported cities and landing page paths."),
  venueContext: z.string().describe("Relevant active venues from the database with paths for links."),
});

export type ConciergeInput = z.infer<typeof ConciergeInputSchema>;

const ConciergeOutputSchema = z.object({
  answer: z
    .string()
    .describe("Helpful answer with Markdown links to venues and city pages from VENUE DATA."),
});

export type ConciergeOutput = z.infer<typeof ConciergeOutputSchema>;

const conciergePrompt = ai.definePrompt({
  name: "conciergeChatPrompt",
  input: { schema: ConciergeInputSchema },
  output: { schema: ConciergeOutputSchema },
  prompt: `You are ANL AI Concierge for Asia Night Life (${SITE_URL}) — a verified nightlife booking platform across Singapore, Vietnam, Thailand, and Malaysia.

Your role:
- Answer ANY question about nightlife, KTV, clubs, VIP rooms, budgets, areas, booking steps, and city recommendations
- ALWAYS ground venue recommendations in VENUE DATA below — use real venue names from the database
- When recommending a venue, MUST include a clickable Markdown link using its exact "path" from VENUE DATA: [Venue Name](/cityCode/venue-slug)
- When recommending a city/area, link the city page: [City Name](/city-slug-nightlife) e.g. [Singapore nightlife](/singapore-nightlife)
- For booking questions: explain 1) pick venue 2) choose date/group size 3) confirm via WhatsApp — link [Book venues](/book) and specific venue pages
- Use Markdown: **bold** for emphasis, bullet lists with \`-\` for venue picks (each bullet should include a venue link when applicable)
- Reply in the same language as the user's question (locale: {{locale}})
- If VENUE DATA has no exact match, say so honestly and suggest the closest city page + WhatsApp ${WHATSAPP_DISPLAY}
- Do not invent venue names not in VENUE DATA
- Do not claim real-time availability — concierge confirms on WhatsApp
- Keep answers helpful and complete (up to 250 words when listing multiple venues)

LINK RULES (critical):
- Venue link format: [Iconic KTV](/singapore/iconic-ktv) — copy "path" from VENUE DATA exactly
- City link format: [Ho Chi Minh City nightlife](/ho-chi-minh-city-nightlife)
- Booking: [Book venues](/book)
- Never output plain text URLs like asianightlife.sg/...

CITIES WE COVER:
{{citiesContext}}

VENUE DATA (live from database — ranked for this question):
{{venueContext}}

Visitor question:
{{question}}`,
});

const conciergeChatFlow = ai.defineFlow(
  {
    name: "conciergeChatFlow",
    inputSchema: ConciergeInputSchema,
    outputSchema: ConciergeOutputSchema,
  },
  async (input) => {
    const { output } = await conciergePrompt({
      ...input,
      locale: input.locale || "en",
    });
    if (!output?.answer?.trim()) {
      throw new Error("Empty Gemini response");
    }
    return output;
  }
);

export async function answerConciergeQuestion(input: ConciergeInput): Promise<ConciergeOutput> {
  return conciergeChatFlow(input);
}
