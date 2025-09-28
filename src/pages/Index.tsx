import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CountrySelector } from "@/components/home/CountrySelector";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { SearchSection } from "@/components/home/SearchSection";
import { VenueGrid } from "@/components/home/VenueGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CountrySelector />
        <CategoryTabs />
        <SearchSection />
        <VenueGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
