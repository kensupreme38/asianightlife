'use client';

import { useState } from "react";
import { VenueCard } from "@/components/home/VenueCard";
import { ktvData } from "@/lib/data";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import { Venue } from "@/hooks/use-venues";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RelatedVenuesProps {
  currentVenueId: string;
  category?: string;
  country?: string;
  initialLimit?: number;
}

/**
 * Related Venues Component
 * Shows venues related by category, country, or both
 * Improves internal linking and user engagement
 */
export const RelatedVenues = ({
  currentVenueId,
  category,
  country,
  initialLimit = 6,
}: RelatedVenuesProps) => {
  const t = useTranslations();
  const [showAll, setShowAll] = useState(false);

  // Find all related venues
  const allRelatedVenues = ktvData
    .filter((venue) => {
      if (venue.id.toString() === currentVenueId) return false;
      
      // Match by category and country if both provided
      if (category && country) {
        return venue.category === category && venue.country === country;
      }
      // Match by category only
      if (category) {
        return venue.category === category;
      }
      // Match by country only
      if (country) {
        return venue.country === country;
      }
      // No filter, show random venues
      return true;
    })
    .map(
      (v): Venue => ({
        ...v,
        id: v.id.toString(),
        rating: 4.5,
        status: "open" as const,
        imageHint: "ktv lounge",
        country: v.country || country || "",
      })
    );

  if (allRelatedVenues.length === 0) {
    return null;
  }

  const displayedVenues = showAll ? allRelatedVenues : allRelatedVenues.slice(0, initialLimit);
  const hasMore = allRelatedVenues.length > initialLimit;

  return (
    <section className="border-t border-border/40 py-8" aria-labelledby="related-venues-heading">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="related-venues-heading" className="text-2xl md:text-3xl font-bold mb-2 font-headline">
              <span className="gradient-text">
                {category && country
                  ? `More ${category}s in ${country}`
                  : category
                  ? `More ${category}s`
                  : country
                  ? `More Venues in ${country}`
                  : "Related Venues"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Discover similar venues you might like
            </p>
          </div>
          <Link
            href="/"
            prefetch={true}
            className="hidden md:flex items-center gap-2 text-primary hover:underline text-sm font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        {hasMore && !showAll && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
              className="gap-2"
            >
              Show More ({allRelatedVenues.length - initialLimit} more venues)
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View All Venues
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
