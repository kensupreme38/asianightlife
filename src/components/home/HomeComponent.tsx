'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CountrySelector } from "@/components/home/CountrySelector";
import { SearchSection } from "@/components/home/SearchSection";
import { VenueGrid } from "@/components/home/VenueGrid";
import { WelcomeDialog } from '@/components/home/WelcomeDialog';

const HomeComponent = () => {
  const [isWelcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('all');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedCategory = searchParams.get('type') || 'all';

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcomeDialog');
      if (!hasSeenWelcome) {
        const timer = setTimeout(() => {
          setWelcomeDialogOpen(true);
          sessionStorage.setItem('hasSeenWelcomeDialog', 'true');
        }, 1000); // Show dialog after 1 second
        return () => clearTimeout(timer);
      }
    }
  }, [hasMounted]);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('type');
    } else {
      params.set('type', category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (!hasMounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <CountrySelector 
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <SearchSection />
        <VenueGrid selectedCountry={selectedCountry} selectedCategory={selectedCategory} />
      </main>
      <Footer />
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setWelcomeDialogOpen} />
    </div>
  );
};

export default HomeComponent;
