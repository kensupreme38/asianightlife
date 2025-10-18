'use client';
import { memo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CountrySelector } from "@/components/home/CountrySelector";
import { VenueGrid } from "@/components/home/VenueGrid";
import { BookingGuide } from '@/components/home/BookingGuide';
import { LazyBookingGuide } from '@/components/lazy/BookingGuide';

type HomeComponentProps = {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
  searchQuery: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
};

const HomeComponent = memo(({
  selectedCountry,
  selectedCity,
  selectedCategory,
  searchQuery,
  onCountryChange,
  onCityChange,
  onCategoryChange,
  onSearchChange,
}: HomeComponentProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <main>
        <HeroBanner />
        <CountrySelector 
          selectedCountry={selectedCountry}
          onCountryChange={onCountryChange}
          selectedCity={selectedCity}
          onCityChange={onCityChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        <VenueGrid 
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery} 
        />
        <LazyBookingGuide />
      </main>
      <Footer />
    </div>
  );
});

HomeComponent.displayName = 'HomeComponent';

export default HomeComponent;
