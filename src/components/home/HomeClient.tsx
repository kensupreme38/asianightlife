"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import HomeComponent from "@/components/home/HomeComponent";
import { WelcomeDialog } from "@/components/home/WelcomeDialog";
import { SplashScreen } from "@/components/ui/splash-screen";

const HomeClient = () => {
  const [isWelcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = useMemo(() => {
    const sp = searchParams ?? new URLSearchParams(); // fallback rỗng nếu null
    return new URLSearchParams(sp.toString());
  }, [searchParams]);

  const selectedCategory = params.get("type") || "all";
  const selectedCountry = params.get("country") || "all";
  const selectedCity = params.get("city") || "all";
  const searchQuery = params.get("q") || "";

  useEffect(() => {
    // Check if user has seen splash screen before
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplashScreen");

    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("hasSeenSplashScreen", "true");
    } else {
      // If already seen splash, mount immediately
      setHasMounted(true);
    }
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcomeDialog");
      if (!hasSeenWelcome) {
        const timer = setTimeout(() => {
          setWelcomeDialogOpen(true);
          sessionStorage.setItem("hasSeenWelcomeDialog", "true");
        }, 1000); // Show dialog after 1 second
        return () => clearTimeout(timer);
      }
    }
  }, [hasMounted]);

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (category === "all") {
      newParams.delete("type");
    } else {
      newParams.set("type", category);
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleCountryChange = (country: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (country === "all") {
      newParams.delete("country");
    } else {
      newParams.set("country", country);
    }
    // Reset city when country changes
    newParams.delete("city");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleCityChange = (city: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (city === "all") {
      newParams.delete("city");
    } else {
      newParams.set("city", city);
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleSearchChange = (query: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Show splash screen only on first visit to homepage
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          setHasMounted(true);
        }}
        duration={2500}
      />
    );
  }

  // No loading state - just show content directly if not showing splash
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <HomeComponent
        selectedCategory={selectedCategory}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        searchQuery={searchQuery}
        onCategoryChange={handleCategoryChange}
        onCountryChange={handleCountryChange}
        onCityChange={handleCityChange}
        onSearchChange={handleSearchChange}
      />
      <WelcomeDialog
        open={isWelcomeDialogOpen}
        onOpenChange={setWelcomeDialogOpen}
      />
    </>
  );
};

export default HomeClient;
