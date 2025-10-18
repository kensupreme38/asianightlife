"use client";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load VenueImageMasonry component
const VenueImageMasonry = lazy(() =>
  import("../venue/VenueImageMasonry").then((module) => ({ default: module.VenueImageMasonry }))
);

interface LazyVenueImageMasonryProps {
  images: string[];
}

export const LazyVenueImageMasonry = ({ images }: LazyVenueImageMasonryProps) => {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
      <VenueImageMasonry images={images} />
    </Suspense>
  );
};
