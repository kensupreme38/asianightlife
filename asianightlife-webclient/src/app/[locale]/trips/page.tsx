import { TripsIndexClient } from "@/components/trips/TripsIndexClient";
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
    path: "/trips",
    title: "Flight + Nightlife Trip Packages | Asia Night Life",
    description:
      "Singapore to HCMC, Bangkok, Vietnam bachelor trips and KK weekend packages. Plan your nightlife getaway.",
    keywords: "singapore to hcmc nightlife, bangkok trip, vietnam bachelor party",
  });
}

export default function TripsPage() {
  return <TripsIndexClient />;
}
