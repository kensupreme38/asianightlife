import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";
import { CITIES } from "@/lib/cities";

const VENUE_SUMMARY = ktvData.slice(0, 30).map((v) => ({
  name: v.name,
  country: v.country,
  category: v.category,
  price: v.price,
  address: v.address?.substring(0, 60),
}));

const CITY_LIST = CITIES.map((c) => `${c.name} (${c.country})`).join(", ");

function ruleBasedAnswer(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("ktv") && (q.includes("tonight") || q.includes("best"))) {
    if (q.includes("singapore") || q.includes("sg")) {
      const sg = ktvData.filter((v) => v.country === "Singapore" && v.category === "KTV").slice(0, 3);
      return `Top Singapore KTV picks tonight:\n${sg.map((v) => `• ${v.name} — ${v.price}`).join("\n")}\n\nBook via WhatsApp for instant confirmation.`;
    }
    return `For KTV tonight, tell us your city (Singapore, HCMC, Bangkok, etc.) and group size. Popular picks:\n• Iconic KTV (Singapore)\n• Boss KTV (HCMC)\n• Onyx Bangkok\n\nWhatsApp us to confirm availability.`;
  }

  if (q.includes("hcmc") || q.includes("saigon") || q.includes("ho chi minh")) {
    const hcmc = ktvData.filter((v) => v.country === "Vietnam").slice(0, 4);
    return `Best HCMC nightlife areas: District 1, District 3, District 5.\n\nRecommended venues:\n${hcmc.map((v) => `• ${v.name} — ${v.price}`).join("\n")}\n\nExplore: asianightlife.sg/ho-chi-minh-city-nightlife`;
  }

  if (q.includes("vip") && q.includes("singapore")) {
    return `Top VIP room options in Singapore:\n• Iconic KTV — premium rooms, 30+ hostesses\n• Supreme KTV — established, great packages\n• Matrix KTV — Orchard area\n\nVIP sessions typically SGD 700–900+. Book 24h ahead on weekends.`;
  }

  if (q.includes("budget") || q.includes("500") || q.includes("cheap")) {
    return `Budget-friendly options under SGD 500:\n• Vietnam HCMC KTV — VND 2–3M (~SGD 150–250)\n• JB (Johor Bahru) — great value near Singapore\n• Happy hour slots (before 8 PM) in Singapore KTVs\n\nTell us your city and date for exact packages.`;
  }

  if (q.includes("bangkok") || q.includes("club")) {
    const bkk = ktvData.filter((v) => v.address?.toLowerCase().includes("bangkok") || v.slug?.includes("bangkok")).slice(0, 4);
    return `Bangkok club highlights (Sukhumvit/RCA):\n${bkk.length ? bkk.map((v) => `• ${v.name}`).join("\n") : "• Onyx Bangkok\n• Route 66\n• Insanity\n• Levels Club"}\n\nBrowse: asianightlife.sg/bangkok-nightlife`;
  }

  return `Thanks for your question! Our concierge covers: ${CITY_LIST}.\n\nFor personalised recommendations, share:\n1. City\n2. Date & time\n3. Group size\n4. Budget\n\nOr browse venues at asianightlife.sg/book`;
}

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    // Rule-based concierge (always available; no external AI dependency)
    return NextResponse.json({ answer: ruleBasedAnswer(question) });
  } catch {
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
