import { notFound } from "next/navigation";
import { GuideDetailClient } from "@/components/guides/GuideDetailClient";
import { GUIDE_SLUGS, getGuideBySlug } from "@/lib/guides";
import { staticParamsForSlugs } from "@/lib/i18n-static-params";
import { generatePageMetadata } from "@/lib/seo";
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
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: { "@type": "Organization", name: "Asia Night Life" },
    publisher: { "@type": "Organization", name: "Asia Night Life" },
  };

  return (
    <>
      <GuideDetailClient guide={guide} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </>
  );
}
