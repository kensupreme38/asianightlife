"use client";
import { VenueCard } from "@/components/home/VenueCard";
import { useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useVenues } from "@/hooks/use-venues";
import { Skeleton } from "@/components/ui/skeleton";

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
  const t = useTranslations();
  const { venues, isLoading } = useVenues({
    selectedCategory: category,
    selectedCountry: country,
    limit: 12,
  });

  const similarVenues = venues
    .filter((venue) => venue.id !== currentVenueId)
    .slice(0, 8);

  if (isLoading) {
    return (
      <section className="border-t border-border/40 w-full overflow-hidden">
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (similarVenues.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/40 w-full overflow-hidden" aria-labelledby="similar-venues-heading">
      <div className="py-8">
        <div className="container mb-8">
          <h2 id="similar-venues-heading" className="text-2xl md:text-3xl font-bold mb-4 font-headline">
            <span className="gradient-text">{t('venue.similarVenues')}</span>
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
