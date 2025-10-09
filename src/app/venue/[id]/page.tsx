import VenueDetailClient from "@/components/venue/VenueDetailClient";

// Correct type definition for dynamic route segment props in App Router (Next.js 15+)
type VenueDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;
  return <VenueDetailClient id={id} />;
}
