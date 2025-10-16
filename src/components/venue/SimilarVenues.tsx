"use client";
import { VenueCard } from "@/components/home/VenueCard";
import { ktvData } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Venue } from "@/hooks/use-venues";

interface SimilarVenuesProps {
  currentVenueId: string;
  category: string;
  country: string;
}

export const SimilarVenues = ({
  currentVenueId,
  category,
  country,
}: SimilarVenuesProps) => {
  const similarVenues = ktvData
    .filter(
      (venue) =>
        venue.id.toString() !== currentVenueId && venue.category === category
    )
    .slice(0, 8)
    .map(
      (v): Venue => ({
        ...v,
        id: v.id.toString(),
        rating: 4.5,
        status: "open" as const,
        imageHint: "ktv lounge",
      })
    );

  return (
    <section className="border-t border-border/40 w-full overflow-hidden">
      <div className="py-8">
        <div className="container mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-headline">
            <span className="gradient-text">Similar Venues</span>
          </h2>
          <p className="text-muted-foreground">
            Discover more {category.toLowerCase()}s in {country}
          </p>
        </div>

        <div className="md:container">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="ml-4 md:-ml-4">
              {similarVenues.map((venue) => (
                <CarouselItem
                  key={venue.id}
                  className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <VenueCard venue={venue} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-center mt-8 container">
          <p className="text-muted-foreground mb-4">
            Found {similarVenues.length} similar venues
          </p>
        </div>
      </div>
    </section>
  );
};
