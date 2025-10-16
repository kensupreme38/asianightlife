"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Loading skeleton for venue cards
export const VenueCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("card-elevated rounded-xl overflow-hidden", className)}>
    <div className="relative aspect-[4/3] overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

// Loading skeleton for venue grid
export const VenueGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <VenueCardSkeleton key={i} />
    ))}
  </div>
);

// Loading skeleton for venue gallery
export const VenueGallerySkeleton = () => (
  <div className="relative aspect-square md:aspect-video w-full rounded-lg overflow-hidden">
    <Skeleton className="h-full w-full" />
  </div>
);

// Loading skeleton for venue info
export const VenueInfoSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
  </div>
);

// Loading skeleton for search results
export const SearchResultsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-24" />
    </div>
    <VenueGridSkeleton count={9} />
  </div>
);
