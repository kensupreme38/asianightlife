import { notFound } from "next/navigation";
import { CountryLandingClient } from "@/components/browse/CountryLandingClient";
import { COUNTRY_SLUGS, getCountryBySlug } from "@/lib/countries";
import { staticParamsForSlugs } from "@/lib/i18n-static-params";
import { generatePageMetadata } from "@/lib/seo";
import { generateCountrySEOContent } from "@/lib/seo-content";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return staticParamsForSlugs(COUNTRY_SLUGS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return { title: "Not Found" };

  const seo = generateCountrySEOContent(country);
  return generatePageMetadata({
    locale,
    path: `/countries/${slug}`,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    openGraph: { title: seo.title, description: seo.description, type: "website" },
  });
}

export default async function CountryLandingPage({ params }: Props) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const seo = generateCountrySEOContent(country);
  const baseUrl = "https://asianightlife.sg";
  const pageUrl = `${baseUrl}/countries/${slug}`;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.heading,
    description: seo.description,
    url: pageUrl,
    about: {
      "@type": "Country",
      name: country.name,
    },
  };

  const faqLd = country.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: country.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Countries", item: `${baseUrl}/#country-selector` },
      { "@type": "ListItem", position: 3, name: country.name, item: pageUrl },
    ],
  };

  return (
    <>
      <CountryLandingClient country={country} />
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
