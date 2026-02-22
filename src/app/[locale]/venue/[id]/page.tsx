import VenueDetailClient from "@/components/venue/VenueDetailClient";
import type { Metadata } from "next";
import { ktvData } from "@/lib/data";
import { generateHreflangAlternates } from "@/lib/seo";

type VenueDetailPageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id, locale } = await params;
  return (
    <>
      <VenueDetailClient id={id} />
      <StructuredData id={id} locale={locale} />
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

  const title = `${v.name} – ${v.category} in ${v.country} | Asia Night Life`;
  const description =
    v.description || 
    `Book ${v.name} - ${v.category} in ${v.country}. Located at ${v.address}. ${v.price ? `Price range: ${v.price}.` : ''} Discover pricing, hours, amenities, and book your entertainment venue now at Asia Night Life.`;
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

async function StructuredData({ id, locale }: { id: string; locale: string }) {
  const v = ktvData.find((x) => x.id.toString() === id);
  if (!v) return null;

  const baseUrl = "https://asianightlife.sg";
  const venueUrl = `${baseUrl}/${locale}/venue/${id}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: v.name,
    image: [v.main_image_url, ...(v.images || [])].filter(Boolean).slice(0, 5),
    address: {
      "@type": "PostalAddress",
      streetAddress: v.address,
      addressCountry: v.country,
    },
    telephone: v.phone || undefined,
    priceRange: v.price,
    url: venueUrl,
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
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Venues",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: v.name,
        item: venueUrl,
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
