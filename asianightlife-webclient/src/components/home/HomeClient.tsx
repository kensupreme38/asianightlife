"use client";
import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import HomeComponent from "@/components/home/HomeComponent";
import { WelcomeDialog } from "@/components/home/WelcomeDialog";
import { SplashScreen } from "@/components/ui/splash-screen";
import {
  filtersToSearchParams,
  sanitizeVenueFilters,
} from "@/lib/venue-filters";

const HomeClientContent = () => {
  const [isWelcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = useMemo(() => {
    const sp = searchParams ?? new URLSearchParams();
    return new URLSearchParams(sp.toString());
  }, [searchParams]);

  const selectedCategory = params.get("type") || "all";
  const selectedCountry = params.get("country") || "all";
  const selectedCity = params.get("city") || "all";
  const searchQuery = params.get("q") || "";

  // Fix broken URL combos (e.g. country=Vietnam + city=Bangkok, or city=Jakarta).
  useEffect(() => {
    const sanitized = sanitizeVenueFilters({
      country: selectedCountry,
      city: selectedCity,
      category: selectedCategory,
    });

    const countryChanged = sanitized.country !== selectedCountry;
    const cityChanged = sanitized.city !== selectedCity;

    if (!countryChanged && !cityChanged) return;

    const nextParams = filtersToSearchParams(sanitized, params);
    nextParams.delete("page");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [
    selectedCountry,
    selectedCity,
    selectedCategory,
    params,
    pathname,
    router,
  ]);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplashScreen");

    if (!hasSeenSplash) {
      setShowSplash(true);
      sessionStorage.setItem("hasSeenSplashScreen", "true");
    } else {
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
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasMounted]);

  const handleClearFilters = useCallback(() => {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.delete("country");
    nextParams.delete("city");
    nextParams.delete("type");
    nextParams.delete("page");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  const handleSearchChange = useCallback(
    (query: string) => {
      const newParams = new URLSearchParams(params.toString());
      if (query) {
        newParams.set("q", query);
      } else {
        newParams.delete("q");
      }
      newParams.delete("page");
      const newUrl = newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [params, pathname, router]
  );

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          setHasMounted(true);
        }}
        duration={1500}
      />
    );
  }

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
        onClearFilters={handleClearFilters}
        onSearchChange={handleSearchChange}
      />
      <WelcomeDialog
        open={isWelcomeDialogOpen}
        onOpenChange={setWelcomeDialogOpen}
      />
    </>
  );
};

const HomeClient = () => {
  return (
    <Suspense fallback={null}>
      <HomeClientContent />
    </Suspense>
  );
};

export default HomeClient;
