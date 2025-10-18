"use client";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load BookingGuide component
const BookingGuide = lazy(() =>
  import("../home/BookingGuide").then((module) => ({ default: module.BookingGuide }))
);

export const LazyBookingGuide = () => {
  return (
    <Suspense fallback={<Skeleton className="h-32 w-full rounded-lg" />}>
      <BookingGuide />
    </Suspense>
  );
};
