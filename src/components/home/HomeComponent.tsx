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

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const selectedCategory = searchParams.get('type') || 'all';
  const selectedCountry = searchParams.get('country') || 'all';
  const searchQuery = searchParams.get('q') || '';

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
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('type');
    } else {
      params.set('type', category);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCountryChange = (country: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (country === 'all') {
      params.delete('country');
    } else {
      params.set('country', country);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

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
          onCountryChange={handleCountryChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <SearchSection searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <VenueGrid 
          selectedCountry={selectedCountry} 
          selectedCategory={selectedCategory}
          searchQuery={searchQuery} 
        />
      </main>
      <Footer />
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setWelcomeDialogOpen} />
    </div>
  );
};

export default HomeComponent;
