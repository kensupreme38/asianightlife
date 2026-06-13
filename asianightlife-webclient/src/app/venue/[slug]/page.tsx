import { redirect } from "next/navigation";
import { resolveVenueBySlug } from "@/lib/venue-server";
import { getVenueUrl } from "@/lib/venue-url";

type VenueDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { slug } = await params;
  const v = await resolveVenueBySlug(slug);
  if (v) {
    redirect(
      getVenueUrl({
        slug: v.pathSlug,
        name: v.name,
        country: v.country,
        address: v.address ?? "",
      })
    );
  }

  const VenueDetailClient = (await import("@/components/venue/VenueDetailClient")).default;
  return <VenueDetailClient id={slug} />;
}
