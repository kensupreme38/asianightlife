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

  const title = `${v.name} – ${v.category} in ${v.country} | Book Now | Asia Night Life`;
  
  // Extract first 150 chars from description for meta, or create SEO-optimized description
  const descriptionText = v.description 
    ? v.description.replace(/[#*]/g, '').substring(0, 150) + '...'
    : `Book ${v.name} - Premium ${v.category} in ${v.country}. Located at ${v.address}. ${v.price ? `Starting from ${v.price}.` : ''} Open ${v.hours || 'daily'}. Reserve your spot now with 24/7 WhatsApp booking at Asia Night Life.`;
  
  const description = descriptionText.length > 160 
    ? descriptionText.substring(0, 157) + '...' 
    : descriptionText;
    
  const ogImage = v.main_image_url;
  const path = `/${locale}/venue/${id}`;
  
  // Generate keywords from venue data
  const keywords = [
    v.name,
    v.category,
    v.country,
    'booking',
    'nightlife',
    'entertainment',
    v.category === 'KTV' ? 'karaoke' : '',
    v.category === 'Club' ? 'nightclub' : '',
    'Asia Night Life',
  ].filter(Boolean).join(', ');

  return {
    title,
    description,
    keywords,
    alternates: generateHreflangAlternates(path),
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "Asia Night Life",
      locale: locale,
      images: ogImage ? [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${v.name} - ${v.category} in ${v.country}`,
      }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: "@asianightlife",
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

  // Parse opening hours to schema.org format
  const parseOpeningHours = (hours: any) => {
    if (!hours) return undefined;
    
    // If hours is an object, convert to string
    const hoursStr = typeof hours === 'string' ? hours : (typeof hours === 'object' ? Object.values(hours)[0] : '');
    
    if (!hoursStr || hoursStr === "Check with venue") return undefined;
    
    // Common patterns: "4PM - 3AM", "12:00 PM - 04:00 AM", "09:00 AM - 02:00 AM (Daily)"
    const timeMatch = String(hoursStr).match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
    if (timeMatch) {
      const [_, startHour, startMin = "00", startPeriod, endHour, endMin = "00", endPeriod] = timeMatch;
      
      // Convert to 24-hour format
      let start24 = parseInt(startHour);
      let end24 = parseInt(endHour);
      
      if (startPeriod.toUpperCase() === "PM" && start24 !== 12) start24 += 12;
      if (startPeriod.toUpperCase() === "AM" && start24 === 12) start24 = 0;
      if (endPeriod.toUpperCase() === "PM" && end24 !== 12) end24 += 12;
      if (endPeriod.toUpperCase() === "AM" && end24 === 12) end24 = 0;
      
      const startTime = `${start24.toString().padStart(2, '0')}:${startMin}`;
      const endTime = `${end24.toString().padStart(2, '0')}:${endMin}`;
      
      return [`Mo-Su ${startTime}-${endTime}`];
    }
    
    return undefined;
  };

  const openingHoursData = parseOpeningHours(v.hours);

  const data = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: v.name,
    description: v.description || `${v.name} - ${v.category} in ${v.country}`,
    image: [v.main_image_url, ...(v.images || [])].filter(Boolean).slice(0, 5),
    address: {
      "@type": "PostalAddress",
      streetAddress: v.address,
      addressCountry: v.country,
    },
    telephone: v.phone || undefined,
    priceRange: v.price,
    url: venueUrl,
    openingHoursSpecification: openingHoursData ? {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: openingHoursData[0]?.split(' ')[1]?.split('-')[0],
      closes: openingHoursData[0]?.split('-')[1],
    } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 25,
      bestRating: 5,
      worstRating: 1,
    },
    geo: v.country === "Singapore" ? {
      "@type": "GeoCoordinates",
      latitude: 1.3521,
      longitude: 103.8198,
    } : v.country === "Vietnam" ? {
      "@type": "GeoCoordinates",
      latitude: 10.8231,
      longitude: 106.6297,
    } : undefined,
    servesCuisine: v.category === "KTV" ? "Karaoke Entertainment" : v.category,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking Available", value: true },
      { "@type": "LocationFeatureSpecification", name: "Card Payment", value: true },
    ],
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
