"use client";
import { useState, useEffect } from "react";
import { LazyVenueCard } from "@/components/home/LazyVenueCard";
import { useVenues } from "@/hooks/use-venues";
import { SearchX, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

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

  // Query more venues than displayed to preload the next batch
  // This creates a sequential loop: query displayLimit + LOAD_MORE_INCREMENT
  const preloadLimit = displayLimit + LOAD_MORE_INCREMENT;
  const { venues: allVenues, totalCount } = useVenues({
    selectedCountry,
    selectedCity,
    selectedCategory,
    searchQuery,
    limit: preloadLimit,
  });

  // Only display venues up to displayLimit
  const displayedVenues = allVenues.slice(0, displayLimit);
  // Venues to preload (next batch - venues after displayLimit)
  const preloadVenues = allVenues.slice(displayLimit, preloadLimit);

  // Preload images for next batch using link rel="preload"
  // This runs sequentially each time displayLimit changes
  useEffect(() => {
    if (preloadVenues.length === 0) return;

    const links: HTMLLinkElement[] = [];
    
    preloadVenues.forEach((venue) => {
      // Check if link already exists to avoid duplicate preloads
      const existingLink = document.querySelector(`link[rel="preload"][as="image"][href="${venue.main_image_url}"]`);
      if (existingLink) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = venue.main_image_url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      links.push(link);
    });

    // Note: We don't cleanup preload links when displayLimit changes 
    // because we want to keep preloaded images in browser cache
    // Links will persist in browser cache even if we don't remove them from DOM
    // The browser will handle cache management automatically
  }, [displayLimit]); // Re-run when displayLimit changes to preload next batch

  const hasMore = totalCount > displayLimit;

  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + LOAD_MORE_INCREMENT);
  };

  return (
    <section className="md:py-12 py-6">
      <div className="md:container px-3">
        <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-headline">
                <span className="gradient-text">Featured Venues</span>
              </h2>
              <p className="text-muted-foreground">
                {totalCount} venues found
                {displayedVenues.length < totalCount && (
                  <span className="ml-2 text-sm">
                    (Showing {displayedVenues.length} of {totalCount})
                  </span>
                )}
              </p>
            </div>
          </div>
        </ScrollReveal>
        {displayedVenues.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {displayedVenues.map((venue, index) => {
                // Calculate delay based on position in row (0, 1, 2) for better staggered effect
                // For mobile (2 cols): delay by 0, 10
                // For desktop (3 cols): delay by 0, 10, 20
                const rowIndex = index % 3; // 0, 1, 2 for desktop
                const delay = rowIndex * 10;
                
                return (
                  <ScrollReveal
                    key={venue.id}
                    animation="fade-up"
                    delay={delay}
                    threshold={0.01}
                    triggerOnce={true}
                    className="h-full"
                  >
                    <LazyVenueCard venue={venue} />
                  </ScrollReveal>
                );
              })}
            </div>

            {hasMore && (
              <ScrollReveal animation="fade-up" delay={200} threshold={0.3}>
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
              </ScrollReveal>
            )}
          </>
        ) : (
          <ScrollReveal animation="fade-in" delay={100} threshold={0.2}>
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
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};
