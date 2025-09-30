'use client';
import { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CountrySelector } from "@/components/home/CountrySelector";
import { SearchSection } from "@/components/home/SearchSection";
import { VenueGrid } from "@/components/home/VenueGrid";
import { WelcomeDialog } from '@/components/home/WelcomeDialog';

const Index = () => {
  const [isWelcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

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

  if (!hasMounted) {
    return null; // or a loading skeleton
  }

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
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setWelcomeDialogOpen} />
    </div>
  );
};

export default Index;
