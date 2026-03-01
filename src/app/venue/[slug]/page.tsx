import VenueDetailClient from "@/components/venue/VenueDetailClient";
import type { Metadata } from "next";
import { ktvData } from "@/lib/data";
import { findVenueIdBySlug, generateSlug } from "@/lib/slug-utils";

type VenueDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { slug } = await params;
  
  // Find venue by slug or ID (backward compatibility)
  const venueId = findVenueIdBySlug(slug, ktvData);
  const id = venueId?.toString() || slug;
  
  return (
    <>
      <VenueDetailClient id={id} />
      <StructuredData slug={slug} />
    </>
  );
}

export async function generateMetadata(
  { params }: VenueDetailPageProps
): Promise<Metadata> {
  const { slug } = await params;
  
  // Find venue by slug or ID (backward compatibility)
  const venueId = findVenueIdBySlug(slug, ktvData);
  const id = venueId?.toString() || slug;
  const v = ktvData.find((x) => x.id.toString() === id);

  if (!v) {
    return { title: "Venue not found" };
  }

  const title = `${v.name} – ${v.category} in ${v.country}`;
  const description =
    v.description || `Book ${v.name} at ${v.address}. Discover pricing, hours, and amenities.`;
  const ogImage = v.main_image_url;
  const venueSlug = generateSlug(v.name);
  const url = `/venue/${venueSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
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

async function StructuredData({ slug }: { slug: string }) {
  // Find venue by slug or ID (backward compatibility)
  const venueId = findVenueIdBySlug(slug, ktvData);
  const id = venueId?.toString() || slug;
  const v = ktvData.find((x) => x.id.toString() === id);
  if (!v) return null;

  const venueSlug = generateSlug(v.name);
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: v.name,
    image: [v.main_image_url, ...(v.images || [])].filter(Boolean).slice(0, 5),
    address: v.address,
    telephone: v.phone || undefined,
    priceRange: v.price,
    url: `https://asianightlife.sg/venue/${venueSlug}`,
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
        item: `https://asianightlife.sg/venue/${venueSlug}`,
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
