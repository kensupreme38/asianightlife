'use client';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CountrySelector } from "@/components/home/CountrySelector";
import { SearchSection } from "@/components/home/SearchSection";
import { VenueGrid } from "@/components/home/VenueGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CountrySelector />
        <SearchSection />
        <VenueGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
