import VenueDetailClient from "@/components/venue/VenueDetailClient";

type VenueDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
  const { id } = await params;
  return <VenueDetailClient id={id} />;
}
