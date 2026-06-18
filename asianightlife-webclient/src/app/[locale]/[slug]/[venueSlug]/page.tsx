import { notFound, permanentRedirect } from "next/navigation";
import VenueDetailClient from "@/components/venue/VenueDetailClient";
import { getCityByCode } from "@/lib/cities";
import { getCountryById } from "@/lib/countries";
import { resolveVenueBySlug, resolveVenueRecordBySlug } from "@/lib/venue-server";
import { getVenueUrl } from "@/lib/venue-url";
import { generatePageMetadata, privatePageRobots, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; venueSlug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, venueSlug, locale } = await params;
  const city = getCityByCode(slug);
  if (!city) return { title: "Not Found" };

  const v = await resolveVenueBySlug(venueSlug);
  if (!v) return { title: "Venue not found", robots: privatePageRobots };

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

  const venueRecord = await resolveVenueRecordBySlug(venueSlug);
  if (!venueRecord) notFound();

  const canonicalPath = getVenueUrl({
    slug: v.pathSlug,
    name: v.name,
    country: v.country,
    address: v.address ?? "",
  });
  const expectedPath = `/${slug}/${v.pathSlug}`;
  if (canonicalPath !== expectedPath) {
    permanentRedirect(canonicalPath);
  }

  const baseUrl = SITE_URL;
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

  const country = getCountryById(v.country);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Countries",
        item: `${baseUrl}/#country-selector`,
      },
      ...(country
        ? [
            {
              "@type": "ListItem" as const,
              position: 3,
              name: country.name,
              item: `${baseUrl}/countries/${country.slug}`,
            },
            {
              "@type": "ListItem" as const,
              position: 4,
              name: v.name,
              item: venueUrl,
            },
          ]
        : [
            {
              "@type": "ListItem" as const,
              position: 3,
              name: v.name,
              item: venueUrl,
            },
          ]),
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I book ${v.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Contact Asia Night Life via WhatsApp at +65 8266 8669 or use the booking form on this page. Our concierge confirms availability, packages and pricing within 15–30 minutes.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the price range at ${v.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: v.price
            ? `Packages at ${v.name} typically start from ${v.price}. Final pricing depends on room type, date, time and group size.`
            : `Pricing varies by room type and date. WhatsApp our concierge for the latest packages at ${v.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `Where is ${v.name} located?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${v.name} is located at ${v.address ?? city.name}, ${v.country}.`,
        },
      },
    ],
  };

  return (
    <>
      <VenueDetailClient id={venueSlug} cityCode={slug} initialVenue={venueRecord} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </>
  );
}
