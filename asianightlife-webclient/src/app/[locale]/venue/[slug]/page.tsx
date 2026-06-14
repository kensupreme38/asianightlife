import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { resolveVenueBySlug } from "@/lib/venue-server";
import { getVenueUrl } from "@/lib/venue-url";
import { generateHreflangAlternates } from "@/lib/seo";

type VenueDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { slug } = await params;
  const v = await resolveVenueBySlug(slug);
  if (!v) {
    notFound();
  }

  redirect(
    getVenueUrl({
      slug: v.pathSlug,
      name: v.name,
      country: v.country,
      address: v.address ?? "",
    })
  );
}

export async function generateMetadata({ params }: VenueDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const v = await resolveVenueBySlug(slug);
  if (!v) {
    return { title: "Venue not found", alternates: generateHreflangAlternates(`/venue/${slug}`) };
  }

  const canonicalPath = getVenueUrl({
    slug: v.pathSlug,
    name: v.name,
    country: v.country,
    address: v.address ?? "",
  });

  const title = `${v.name} – ${v.category} | Asia Night Life`;
  const description = `Book ${v.name} - ${v.category} in ${v.country}. Reserve via WhatsApp.`;

  return {
    title,
    description,
    alternates: generateHreflangAlternates(canonicalPath),
    openGraph: { title, description, url: canonicalPath, type: "website" },
  };
}
