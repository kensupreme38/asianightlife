"use client";
import { LazyVenueCard } from "@/components/home/LazyVenueCard";
import { useVenues } from "@/hooks/use-venues";
import { SearchX } from "lucide-react";

interface VenueGridProps {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
  searchQuery: string;
}

export const VenueGrid = ({
  selectedCountry,
  selectedCity,
  selectedCategory,
  searchQuery,
}: VenueGridProps) => {
  const { venues, totalCount } = useVenues({
    selectedCountry,
    selectedCity,
    selectedCategory,
    searchQuery,
  });

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 font-headline">
              <span className="gradient-text">Featured Venues</span>
            </h2>
            <p className="text-muted-foreground">{totalCount} venues found</p>
          </div>
        </div>
        {venues.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <LazyVenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card-elevated rounded-xl">
            <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold font-headline">
              No results found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
