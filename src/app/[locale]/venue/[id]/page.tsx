import VenueDetailClient from "@/components/venue/VenueDetailClient";
import type { Metadata } from "next";
import { ktvData } from "@/lib/data";
import { generateHreflangAlternates } from "@/lib/seo";

type VenueDetailPageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;
  return (
    <>
      <VenueDetailClient id={id} />
      <StructuredData id={id} />
    </>
  );
}

export async function generateMetadata(
  { params }: VenueDetailPageProps
): Promise<Metadata> {
  const { id, locale } = await params;
  const v = ktvData.find((x) => x.id.toString() === id);

  if (!v) {
    const path = `/${locale}/venue/${id}`;
    return { 
      title: "Venue not found",
      alternates: generateHreflangAlternates(path),
    };
  }

  const title = `${v.name} – ${v.category} in ${v.country}`;
  const description =
    v.description || `Book ${v.name} at ${v.address}. Discover pricing, hours, and amenities.`;
  const ogImage = v.main_image_url;
  const path = `/${locale}/venue/${id}`;

  return {
    title,
    description,
    alternates: generateHreflangAlternates(path),
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

async function StructuredData({ id }: { id: string }) {
  const v = ktvData.find((x) => x.id.toString() === id);
  if (!v) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: v.name,
    image: [v.main_image_url, ...(v.images || [])].filter(Boolean).slice(0, 5),
    address: v.address,
    telephone: v.phone || undefined,
    priceRange: v.price,
    url: `https://asianightlife.sg/venue/${id}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 25,
    },
  } as const;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://asianightlife.sg/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Venues",
        item: "https://asianightlife.sg/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: v.name,
        item: `https://asianightlife.sg/venue/${id}`,
      },
    ],
  } as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
