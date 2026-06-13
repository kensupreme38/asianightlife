"use client";

import { VenueCard } from "./VenueCard";

interface LazyVenueCardProps {
  venue: {
    id: string;
    slug: string;
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

/** Direct render — lazy/Suspense caused skeleton flash on every pagination remount. */
export const LazyVenueCard = ({ venue }: LazyVenueCardProps) => {
  return <VenueCard venue={venue} />;
};
