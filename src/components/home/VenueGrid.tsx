'use client';
import { VenueCard } from "./VenueCard";
import { Button } from "@/components/ui/button";
import { ktvData } from "@/lib/data";

export const VenueGrid = () => {
  const venues = [
    ...ktvData.map(ktv => ({
      id: ktv.id,
      name: ktv.name,
      image: ktv.image,
      category: "KTV",
      address: ktv.address,
      price: ktv.price,
      rating: 4.5,
      status: "open" as const,
      features: ktv.features,
      country: "singapore"
    }))
  ];

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="gradient-text">Featured Venues</span>
            </h2>
            <p className="text-muted-foreground">
              {venues.length} venues found
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Updated: a few minutes ago
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View More Venues
          </Button>
        </div>
      </div>
    </section>
  );
};
