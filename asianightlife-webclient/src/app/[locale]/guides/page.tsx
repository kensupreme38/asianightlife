import { GuidesIndexClient } from "@/components/guides/GuidesIndexClient";
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
    path: "/guides",
    title: "Nightlife Wiki & Guides | Asia Night Life",
    description:
      "KTV guides, city nightlife guides, VIP booking tips, and nightlife glossary for Singapore, Vietnam, Thailand and Malaysia.",
    keywords: "ktv guide, nightlife wiki, singapore ktv guide, vietnam nightlife guide",
  });
}

export default function GuidesPage() {
  return <GuidesIndexClient />;
}
