'use client';
import { VenueCard } from "@/components/home/VenueCard";
import { ktvData } from "@/lib/data";
import { SearchX } from "lucide-react";

interface VenueGridProps {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
  searchQuery: string;
}

export const VenueGrid = ({ selectedCountry, selectedCity, selectedCategory, searchQuery }: VenueGridProps) => {
  const venues = ktvData
    .filter(venue => selectedCountry === 'all' || venue.country === selectedCountry)
    .filter(venue => {
      // The city filter is prepared for when city data is available in ktvData
      if (selectedCountry !== 'all' && selectedCity !== 'all') {
        // Assuming venue object will have a 'city' property
        // return venue.city === selectedCity;
        return true; // Currently returning true to not filter out everything
      }
      return true;
    })
    .filter(venue => selectedCategory === 'all' || venue.category === selectedCategory)
    .filter(venue => !searchQuery || venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || venue.address.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(ktv => ({
      ...ktv,
      id: ktv.id.toString(),
      rating: 4.5,
      status: "open" as const,
      imageHint: "ktv lounge"
    }));

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 font-headline">
              <span className="gradient-text">Featured Venues</span>
            </h2>
            <p className="text-muted-foreground">
              {venues.length} venues found
            </p>
          </div>
        </div>
        {venues.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card-elevated rounded-xl">
            <SearchX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold font-headline">No results found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
