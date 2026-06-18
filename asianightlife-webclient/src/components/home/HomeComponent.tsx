"use client";
import { memo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CountrySelector } from "@/components/home/CountrySelector";
import { VenueGrid } from "@/components/home/VenueGrid";
import { CitiesSection } from "@/components/home/CitiesSection";
import { LazyBookingGuide } from "@/components/lazy/BookingGuide";

type HomeComponentProps = {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
  searchQuery: string;
  onClearFilters?: () => void;
  onSearchChange: (query: string) => void;
};

const HomeComponent = memo(
  ({
    selectedCountry,
    selectedCity,
    selectedCategory,
    searchQuery,
    onClearFilters,
    onSearchChange,
  }: HomeComponentProps) => {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <main id="main-content">
          <section aria-label="Hero banner">
            <HeroBanner />
          </section>
          <section aria-label="Country and category selector">
            <CountrySelector
              selectedCountry={selectedCountry}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
            />
          </section>
          <section id="venue-listings" aria-label="Venue listings">
            <VenueGrid
              selectedCountry={selectedCountry}
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onClearFilters={onClearFilters}
            />
          </section>
          <CitiesSection />
          <LazyBookingGuide />
        </main>
        <Footer />
      </div>
    );
  }
);

HomeComponent.displayName = "HomeComponent";

export default HomeComponent;
