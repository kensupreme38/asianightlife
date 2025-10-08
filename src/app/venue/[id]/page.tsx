import VenueDetailClient from "@/components/venue/VenueDetailClient";

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  return <VenueDetailClient id={params.id} />;
}
