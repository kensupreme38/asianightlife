import { notFound } from "next/navigation";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";
import { BLOG_SLUGS, getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog";
import { staticParamsForSlugs } from "@/lib/i18n-static-params";
import { generatePageMetadata, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; locale: string }> };

export function generateStaticParams() {
  return staticParamsForSlugs(BLOG_SLUGS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return generatePageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${post.title} | Asia Night Life Blog`,
    description: post.description,
    keywords: post.keywords.join(", "),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [post.coverImage],
    },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const defaultLocale = "en";
  const canonicalUrl = locale === defaultLocale
    ? `${SITE_URL}/blog/${slug}`
    : `${SITE_URL}/${locale}/blog/${slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: [post.coverImage],
    author: {
      "@type": "Organization",
      name: post.author,
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
      <BlogDetailClient post={post} relatedPosts={getRelatedBlogPosts(slug)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    </>
  );
}
