import VenueDetailClient from "@/app/venue-detail";

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  return <VenueDetailClient id={params.id} />;
}
