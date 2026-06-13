import { notFound, redirect } from "next/navigation";
import VenueDetailClient from "@/components/venue/VenueDetailClient";
import { getCityByCode } from "@/lib/cities";
import { resolveVenueBySlug } from "@/lib/venue-server";
import { getVenueUrl } from "@/lib/venue-url";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; venueSlug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, venueSlug, locale } = await params;
  const city = getCityByCode(slug);
  if (!city) return { title: "Not Found" };

  const v = await resolveVenueBySlug(venueSlug);
  if (!v) return { title: "Venue not found" };

  const title = `${v.name} – ${v.category} in ${city.name} | Book Now | Asia Night Life`;
  const description =
    v.description?.replace(/[#*]/g, "").substring(0, 150) ||
    `Book ${v.name} - Premium ${v.category} in ${city.name}. ${v.price ? `From ${v.price}.` : ""} Reserve via WhatsApp at Asia Night Life.`;

  const path = `/${slug}/${v.pathSlug}`;
  return generatePageMetadata({
    locale,
    path,
    title,
    description,
    keywords: [v.name, v.category, city.name, "booking", "nightlife"].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      images: v.main_image_url ? [v.main_image_url] : [],
    },
  });
}

export default async function CityVenuePage({ params }: Props) {
  const { slug, venueSlug } = await params;
  const city = getCityByCode(slug);
  if (!city) notFound();

  const v = await resolveVenueBySlug(venueSlug);
  if (!v) notFound();

  const canonicalPath = getVenueUrl({
    slug: v.pathSlug,
    name: v.name,
    country: v.country,
    address: v.address ?? "",
  });
  const expectedPath = `/${slug}/${v.pathSlug}`;
  if (canonicalPath !== expectedPath) {
    redirect(canonicalPath);
  }

  const baseUrl = "https://asianightlife.sg";
  const venueUrl = `${baseUrl}${canonicalPath}`;

  const venueLd = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: v.name,
    description: v.description || `${v.name} - ${v.category} in ${city.name}`,
    image: v.main_image_url,
    address: {
      "@type": "PostalAddress",
      streetAddress: v.address,
      addressLocality: city.name,
      addressCountry: v.country,
    },
    telephone: v.phone,
    priceRange: v.price,
    url: venueUrl,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: city.heroTitle,
        item: `${baseUrl}/${city.slug}`,
      },
      { "@type": "ListItem", position: 3, name: v.name, item: venueUrl },
    ],
  };

  return (
    <>
      <VenueDetailClient id={venueSlug} cityCode={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
