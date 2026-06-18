import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TrustPageClient } from "@/components/trust/TrustPageClient";
import { generatePageMetadata, SITE_URL } from "@/lib/seo";
import { getTrustPage, type TrustPageSlug } from "@/lib/trust-pages";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateTrustPageMetadata(
  slug: TrustPageSlug,
  locale: string
): Promise<Metadata> {
  const page = getTrustPage(slug);
  if (!page) return { title: "Not Found" };

  return generatePageMetadata({
    locale,
    path: `/${slug}`,
    title: `${page.title} | Asia Night Life`,
    description: page.description,
    keywords: `asia night life, ${slug.replace("-", " ")}, nightlife booking`,
  });
}

export function TrustPageRoute({ slug }: { slug: TrustPageSlug }) {
  const page = getTrustPage(slug);
  if (!page) notFound();

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": slug === "contact" ? "ContactPage" : "WebPage",
    name: page.title,
    description: page.description,
    url: `${SITE_URL}/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Asia Night Life",
      url: SITE_URL,
    },
  };

  return (
    <>
      <TrustPageClient page={page} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
    </>
  );
}
