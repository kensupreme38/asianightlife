'use client';
import VenueDetailClient from "@/components/venue/VenueDetailClient";

// Correct type definition for dynamic route segment props in App Router
type VenueDetailPageProps = {
  params: { id: string };
};

export default function VenueDetailPage({ params }: VenueDetailPageProps) {
  return <VenueDetailClient id={params.id} />;
}
