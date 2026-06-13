import { BookingFunnelClient } from "@/components/book/BookingFunnelClient";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: "/book",
    title: "Book Nightlife — Choose City, Venue & Confirm | Asia Night Life",
    description:
      "4-step booking funnel: choose your city, pick a venue, set date and group size, then confirm via WhatsApp concierge.",
    keywords: "book ktv, nightlife booking, whatsapp booking, asia night life",
  });
}

export default function BookPage() {
  return <BookingFunnelClient />;
}
