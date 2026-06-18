"use client";

import { Globe, LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { useVenueStats } from "@/hooks/use-venue-stats";
import { useBrowseHighlights } from "@/hooks/use-browse-highlights";
import { BROWSE_COUNTRIES, VENUE_TYPE_GROUPS } from "@/lib/browse-cards-data";
import { getCountrySlug } from "@/lib/countries";
import { getCategorySlug } from "@/lib/categories";
import { BrowseCard, BrowseSection } from "@/components/home/BrowseCard";
import { BrowseWidgets } from "@/components/home/BrowseWidgets";

interface CountrySelectorProps {
  selectedCountry: string;
  selectedCity: string;
  selectedCategory: string;
}

export const CountrySelector = ({
  selectedCountry,
  selectedCity,
  selectedCategory,
}: CountrySelectorProps) => {
  const t = useTranslations();
  const stats = useVenueStats();
  const { topVenues, newUpdates, isLoading } = useBrowseHighlights({
    country: selectedCountry,
    city: selectedCity,
  });

  const getCountrySubtitle = (countryName: string) => {
    const count = stats?.country_stats?.[countryName];
    if (count && count > 0) return t("cities.venueCount", { count });
    return t("home.comingSoon");
  };

  const isVenueTypeSelected = (filterCategoryId: string) =>
    selectedCategory === filterCategoryId;

  return (
    <section id="country-selector" className="py-8 border-b border-border/40">
      <div className="container px-4 space-y-10">
        <BrowseWidgets
          topVenues={topVenues}
          newUpdates={newUpdates}
          isLoading={isLoading}
        />

        {/* Countries */}
        <BrowseSection title={t("home.selectCountry")} icon={Globe}>
          {BROWSE_COUNTRIES.map((country) => (
            <BrowseCard
              key={country.id}
              name={country.name}
              subtitle={getCountrySubtitle(country.name)}
              imageUrl={country.imageUrl}
              isSelected={selectedCountry === country.id}
              href={`/countries/${getCountrySlug(country.id)}`}
            />
          ))}
        </BrowseSection>

        {/* Venue types */}
        <BrowseSection title={t("browse.venueTypes")} icon={LayoutGrid}>
          {VENUE_TYPE_GROUPS.map((group) => (
            <BrowseCard
              key={group.id}
              name={group.name}
              subtitle={group.description}
              imageUrl={group.imageUrl}
              isSelected={isVenueTypeSelected(group.filterCategoryId)}
              href={`/categories/${getCategorySlug(group.filterCategoryId)}`}
            />
          ))}
        </BrowseSection>
      </div>
    </section>
  );
};
