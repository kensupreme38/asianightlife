import { notFound } from "next/navigation";
import { CategoryLandingClient } from "@/components/browse/CategoryLandingClient";
import { CATEGORY_SLUGS, getCategoryBySlug } from "@/lib/categories";
import { staticParamsForSlugs } from "@/lib/i18n-static-params";
import { generatePageMetadata } from "@/lib/seo";
import { generateCategorySEOContent } from "@/lib/seo-content";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  return staticParamsForSlugs(CATEGORY_SLUGS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not Found" };

  const seo = generateCategorySEOContent(category.id);
  return generatePageMetadata({
    locale,
    path: `/categories/${slug}`,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    openGraph: { title: seo.title, description: seo.description, type: "website" },
  });
}

export default async function CategoryLandingPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const seo = generateCategorySEOContent(category.id);
  const baseUrl = "https://asianightlife.sg";
  const pageUrl = `${baseUrl}/categories/${slug}`;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.heading,
    description: seo.description,
    url: pageUrl,
  };

  const faqLd = category.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: category.faqs.map((faq) => ({
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
      { "@type": "ListItem", position: 2, name: "Entertainment", item: `${baseUrl}/#country-selector` },
      { "@type": "ListItem", position: 3, name: category.heroTitle, item: pageUrl },
    ],
  };

  return (
    <>
      <CategoryLandingClient category={category} />
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
