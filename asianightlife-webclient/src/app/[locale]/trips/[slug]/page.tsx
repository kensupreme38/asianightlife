import { notFound } from "next/navigation";
import { TripDetailClient } from "@/components/trips/TripDetailClient";
import { TRAVEL_SLUGS, getTravelPackageBySlug } from "@/lib/travel-packages";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; locale: string }> };

export function generateStaticParams() {
  return TRAVEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const pkg = getTravelPackageBySlug(slug);
  if (!pkg) return { title: "Not Found" };

  return generatePageMetadata({
    locale,
    path: `/trips/${slug}`,
    title: `${pkg.title} | Asia Night Life`,
    description: pkg.description,
    keywords: pkg.keywords.join(", "),
    openGraph: { title: pkg.title, description: pkg.description, type: "article" },
  });
}

export default async function TripPage({ params }: Props) {
  const { slug } = await params;
  const pkg = getTravelPackageBySlug(slug);
  if (!pkg) notFound();
  return <TripDetailClient pkg={pkg} />;
}
