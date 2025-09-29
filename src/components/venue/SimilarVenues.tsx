'use client';
import { VenueCard } from "@/components/home/VenueCard";
import { ktvData } from "@/lib/data";

interface SimilarVenuesProps {
  currentVenueId: string;
  category: string;
  country: string;
}

export const SimilarVenues = ({ currentVenueId, category, country }: SimilarVenuesProps) => {
  
  const similarVenues = ktvData
    .filter(venue => venue.id !== currentVenueId && venue.category === category)
    .slice(0, 3)
    .map(v => ({
      ...v,
      rating: 4.5 + Math.random() * 0.4,
      status: "open" as const,
    }));


  return (
    <section className="py-12 border-t border-border/40">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="gradient-text">Similar Venues</span>
          </h2>
          <p className="text-muted-foreground">
            Discover more {category.toLowerCase()}s in {country}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Found {similarVenues.length} similar venues
          </p>
        </div>
      </div>
    </section>
  );
};
