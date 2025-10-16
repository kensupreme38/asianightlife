"use client";
import { lazy, Suspense } from "react";
import { VenueCardSkeleton } from "@/components/ui/loading-states";

// Lazy load VenueCard component
const VenueCard = lazy(() =>
  import("./VenueCard").then((module) => ({ default: module.VenueCard }))
);

interface LazyVenueCardProps {
  venue: {
    id: string;
    name: string;
    main_image_url: string;
    imageHint?: string;
    category: string;
    address: string;
    price: string;
    rating: number;
    status: "open" | "closed";
    country: string;
    hours?: string | Record<string, string | undefined>;
  };
}

export const LazyVenueCard = ({ venue }: LazyVenueCardProps) => {
  return (
    <Suspense fallback={<VenueCardSkeleton />}>
      <VenueCard venue={venue} />
    </Suspense>
  );
};
