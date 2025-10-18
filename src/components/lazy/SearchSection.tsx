"use client";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load SearchSection component
const SearchSection = lazy(() =>
  import("../home/SearchSection").then((module) => ({ default: module.SearchSection }))
);

interface LazySearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LazySearchSection = ({ searchQuery, onSearchChange }: LazySearchSectionProps) => {
  return (
    <Suspense fallback={<Skeleton className="h-16 w-full rounded-lg" />}>
      <SearchSection searchQuery={searchQuery} onSearchChange={onSearchChange} />
    </Suspense>
  );
};
