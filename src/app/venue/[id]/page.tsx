'use client';
import VenueDetailClient from "@/components/venue/VenueDetailClient";

type VenueDetailPageProps = {
  params: { id: string };
};

export default function VenueDetailPage({ params }: VenueDetailPageProps) {
  return <VenueDetailClient id={params.id} />;
}
