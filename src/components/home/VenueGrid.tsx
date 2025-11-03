"use client";
import { useState, useEffect } from "react";
import { LazyVenueCard } from "@/components/home/LazyVenueCard";
import { useVenues } from "@/hooks/use-venues";
import { SearchX, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VenueGridProps {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
  searchQuery: string;
}

const INITIAL_LIMIT = 12;
const LOAD_MORE_INCREMENT = 12;

export const VenueGrid = ({
  selectedCountry,
  selectedCity,
  selectedCategory,
  searchQuery,
}: VenueGridProps) => {
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  // Reset limit when filters change
  useEffect(() => {
    setDisplayLimit(INITIAL_LIMIT);
  }, [selectedCountry, selectedCity, selectedCategory, searchQuery]);

  const { venues, totalCount } = useVenues({
    selectedCountry,
    selectedCity,
    selectedCategory,
    searchQuery,
    limit: displayLimit,
  });

  const hasMore = totalCount > displayLimit;

  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + LOAD_MORE_INCREMENT);
  };

  return (
    <section className="md:py-12 py-6">
      <div className="md:container px-3">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 font-headline">
              <span className="gradient-text">Featured Venues</span>
            </h2>
            <p className="text-muted-foreground">
              {totalCount} venues found
              {venues.length < totalCount && (
                <span className="ml-2 text-sm">
                  (Showing {venues.length} of {totalCount})
                </span>
              )}
            </p>
          </div>
        </div>
        {venues.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <LazyVenueCard key={venue.id} venue={venue} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleShowMore}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  Show More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
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
