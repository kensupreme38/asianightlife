import { Metadata } from "next";
import { notFound } from "next/navigation";
import DJDetailClient from "@/components/dj/DJDetailClient";
import { generateHreflangAlternates } from "@/lib/seo";

interface DJDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: DJDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const path = `/${locale}/dj/${id}`;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/djs/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        title: "DJ Not Found - Asia Night Life",
        alternates: generateHreflangAlternates(path),
      };
    }

    const dj = await response.json();

    const title = `${dj.name} - DJ Profile${dj.country ? ` in ${dj.country}` : ''} | Asia Night Life`;
    const description = dj.bio || 
      `Discover ${dj.name}'s DJ profile${dj.country ? ` from ${dj.country}` : ''}${dj.genres && dj.genres.length > 0 ? ` specializing in ${dj.genres.join(', ')}` : ''}. View profile, vote, and see rankings on Asia Night Life's DJ voting platform.`;

    return {
      title,
      description,
      alternates: generateHreflangAlternates(path),
      openGraph: {
        title: `${dj.name} - DJ Profile`,
        description: dj.bio || `View ${dj.name}'s DJ profile and vote`,
        images: dj.image_url ? [dj.image_url] : undefined,
        type: "profile",
      },
    };
  } catch (error) {
    return {
      title: "DJ Profile - Asia Night Life",
      alternates: generateHreflangAlternates(path),
    };
  }
}

async function DJStructuredData({ id, locale }: { id: string; locale: string }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/djs/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;

    const dj = await response.json();
    const baseUrl = "https://asianightlife.sg";
    const djUrl = `${baseUrl}/${locale}/dj/${id}`;

    const data = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: dj.name,
      image: dj.image_url || undefined,
      description: dj.bio || undefined,
      url: djUrl,
      jobTitle: "DJ",
      worksFor: {
        "@type": "Organization",
        name: "Asia Night Life",
      },
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
          name: "DJs",
          item: `${baseUrl}/${locale}/dj`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: dj.name,
          item: djUrl,
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
  } catch (error) {
    return null;
  }
}

export default async function DJDetailPage({ params }: DJDetailPageProps) {
  const { id, locale } = await params;

  return (
    <>
      <DJDetailClient id={id} />
      <DJStructuredData id={id} locale={locale} />
    </>
  );
}

