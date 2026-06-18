import { notFound } from "next/navigation";
import { TripDetailClient } from "@/components/trips/TripDetailClient";
import { TRAVEL_SLUGS, getTravelPackageBySlug } from "@/lib/travel-packages";
import { staticParamsForSlugs } from "@/lib/i18n-static-params";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; locale: string }> };

export function generateStaticParams() {
  return staticParamsForSlugs(TRAVEL_SLUGS);
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

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pkg.title,
    description: pkg.description,
    author: { "@type": "Organization", name: "Asia Night Life" },
    publisher: { "@type": "Organization", name: "Asia Night Life" },
  };

  return (
    <>
      <TripDetailClient pkg={pkg} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    </>
  );
}
