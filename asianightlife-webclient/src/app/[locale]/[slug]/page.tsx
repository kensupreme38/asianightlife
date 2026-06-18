import { notFound } from "next/navigation";
import { CityLandingClient } from "@/components/city/CityLandingClient";
import { CITY_SLUGS, getCityBySlug } from "@/lib/cities";
import { getCountryById } from "@/lib/countries";
import { staticParamsForSlugs } from "@/lib/i18n-static-params";
import { generatePageMetadata } from "@/lib/seo";
import { generateCitySEOContent } from "@/lib/seo-content";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return staticParamsForSlugs(CITY_SLUGS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: "Not Found" };

  const seo = generateCitySEOContent(city);
  return generatePageMetadata({
    locale,
    path: `/${slug}`,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    openGraph: { title: seo.title, description: seo.description, type: "website" },
  });
}

export default async function CityLandingPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const seo = generateCitySEOContent(city);
  const baseUrl = "https://asianightlife.sg";
  const pageUrl = `${baseUrl}/${slug}`;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.heading,
    description: seo.description,
    url: pageUrl,
    about: {
      "@type": "Place",
      name: city.name,
      address: { "@type": "PostalAddress", addressCountry: city.country },
    },
  };

  const faqLd = city.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: city.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const country = getCountryById(city.country);

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
              name: city.heroTitle,
              item: pageUrl,
            },
          ]
        : [
            {
              "@type": "ListItem" as const,
              position: 3,
              name: city.heroTitle,
              item: pageUrl,
            },
          ]),
    ],
  };

  return (
    <>
      <CityLandingClient city={city} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
    </>
  );
}
