import { notFound } from "next/navigation";
import { GuideDetailClient } from "@/components/guides/GuideDetailClient";
import { GUIDE_SLUGS, getGuideBySlug } from "@/lib/guides";
import { staticParamsForSlugs } from "@/lib/i18n-static-params";
import { generatePageMetadata, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; locale: string }> };

export function generateStaticParams() {
  return staticParamsForSlugs(GUIDE_SLUGS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Not Found" };

  return generatePageMetadata({
    locale,
    path: `/guides/${slug}`,
    title: `${guide.title} | Asia Night Life Wiki`,
    description: guide.description,
    keywords: guide.keywords.join(", "),
    openGraph: { title: guide.title, description: guide.description, type: "article" },
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug, locale } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const defaultLocale = "en";
  const canonicalUrl = locale === defaultLocale
    ? `${SITE_URL}/guides/${slug}`
    : `${SITE_URL}/${locale}/guides/${slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: guide.title,
    description: guide.description,
    image: [
      "https://images.unsplash.com/photo-1738156793840-e7ad46384761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    ],
    datePublished: "2026-01-01",
    dateModified: "2026-06-19",
    author: {
      "@type": "Organization",
      name: "Asia Night Life Team",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Asia Night Life",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.jpg`,
      },
    },
  };

  return (
    <>
      <GuideDetailClient guide={guide} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    </>
  );
}
