import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
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
    path: "/blog",
    title: "Nightlife Blog | Tips, Trends & Guides | Asia Night Life",
    description:
      "Nightlife blog with KTV tips, city trends, weekend itineraries and cultural guides for Singapore, Vietnam, Thailand and Malaysia.",
    keywords:
      "nightlife blog, asia nightlife tips, ktv blog, bangkok nightlife, singapore ktv guide",
  });
}

export default function BlogPage() {
  return <BlogIndexClient />;
}
