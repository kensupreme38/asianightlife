"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VenueGrid } from "@/components/home/VenueGrid";
import { BrowseCard, BrowseSection } from "@/components/home/BrowseCard";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Building2, LayoutGrid } from "lucide-react";
import type { CountryConfig } from "@/lib/countries";
import {
  BROWSE_ALL_CITIES_IMAGE,
  BROWSE_ALL_CATEGORIES_IMAGE,
  VENUE_TYPE_GROUPS,
  type BrowseCity,
} from "@/lib/browse-cards-data";
import { getBrowseCitiesForCountry } from "@/lib/browse-cities";
import { cityFilterIsSupported } from "@/lib/venue-filters";
import { whatsappMessageUrl, TELEGRAM_URL } from "@/lib/constants";
import { useVenueStats } from "@/hooks/use-venue-stats";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CountryFlag } from "@/components/ui/country-flag";
import { PageBreadcrumbBar } from "@/components/layout/Breadcrumbs";
import { countryBreadcrumbs } from "@/lib/breadcrumbs";

interface CountryLandingClientProps {
  country: CountryConfig;
}

export function CountryLandingClient({ country }: CountryLandingClientProps) {
  const t = useTranslations();
  const stats = useVenueStats();
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const displayCities = useMemo(
    () => getBrowseCitiesForCountry(country.id),
    [country.id]
  );

  const whatsappMsg = whatsappMessageUrl(
    `Hi, I'd like to book nightlife in ${country.name}. Can you help?`
  );

  const countryVenueCount = stats?.country_stats?.[country.name];

  const getCitySubtitle = (city: BrowseCity) => {
    const count = city.statsSlug
      ? stats?.city_stats?.[city.statsSlug]
      : undefined;
    if (count && count > 0) return t("cities.venueCount", { count });
    return t("home.comingSoon");
  };

  const selectedCityName =
    selectedCity === "all"
      ? null
      : displayCities.find((c) => c.id === selectedCity)?.name;

  const selectedTypeName =
    selectedCategory === "all"
      ? null
      : VENUE_TYPE_GROUPS.find((g) => g.filterCategoryId === selectedCategory)
          ?.name;

  const locationName = selectedCityName ?? country.name;
  const venuesHeading =
    selectedTypeName != null
      ? `${selectedTypeName} · ${locationName}`
      : selectedCityName != null
        ? t("city.venuesIn", { city: selectedCityName })
        : t("browseLanding.venuesIn", { name: country.name });

  const isVenueTypeSelected = (filterCategoryId: string) =>
    selectedCategory === filterCategoryId;

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <PageBreadcrumbBar
        items={countryBreadcrumbs(country, {
          home: t("common.home"),
          countries: t("breadcrumbs.countries"),
        })}
      />

      <main id="main-content">
        <section className="relative w-full min-h-[55vh] md:min-h-[50vh] overflow-hidden">
          <Image
            src={country.imageUrl}
            alt={`${country.name} nightlife`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/50 md:bg-gradient-to-r md:from-background/95 md:via-background/70 md:to-background/30" />

          <div className="relative z-10 flex items-end md:items-center min-h-[55vh] md:min-h-[50vh] py-10 sm:py-12 md:py-16">
            <div className="container px-4 sm:px-6">
              <div className="max-w-3xl">
                <Badge className="mb-3 sm:mb-4 bg-red-bright/20 text-red-bright border-red-bright/30 flex items-center gap-2 w-fit text-xs sm:text-sm">
                  <CountryFlag country={country.countryCode} size={20} />
                  {country.name}
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-2 sm:mb-3 gradient-text leading-tight">
                  {country.heroTitle}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-2">
                  {country.heroSubtitle}
                </p>
                <p className="text-sm sm:text-base text-foreground/80 max-w-2xl mb-6 sm:mb-8 leading-relaxed">
                  {country.intro}
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 md:gap-3">
                  <Button variant="neon" size="lg" className="w-full sm:w-auto" asChild>
                    <Link href="/book">{t("city.bookNow")}</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto md:size-lg" asChild>
                    <a href={whatsappMsg} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t("city.whatsappConcierge")}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto md:size-lg" asChild>
                    <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                      <Send className="h-4 w-4 mr-2" />
                      {t("city.telegramConcierge")}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {displayCities.length > 0 && (
          <section className="py-8 sm:py-10 border-b border-border/40" id="select-city">
            <div className="container px-4 sm:px-6">
              <BrowseSection title={t("home.selectCity")} icon={Building2}>
                <BrowseCard
                  name={t("home.allCities")}
                  subtitle={
                    countryVenueCount && countryVenueCount > 0
                      ? t("cities.venueCount", { count: countryVenueCount })
                      : t("home.comingSoon")
                  }
                  imageUrl={BROWSE_ALL_CITIES_IMAGE}
                  isSelected={selectedCity === "all"}
                  onClick={() => setSelectedCity("all")}
                />
                {displayCities.map((city) => {
                  const isFilterable = cityFilterIsSupported(city.id);
                  return (
                    <BrowseCard
                      key={`${city.country}-${city.id}`}
                      name={city.name}
                      subtitle={getCitySubtitle(city)}
                      imageUrl={city.imageUrl}
                      isSelected={selectedCity === city.id}
                      disabled={!isFilterable}
                      onClick={() => {
                        if (!isFilterable) return;
                        setSelectedCity(city.id);
                      }}
                    />
                  );
                })}
              </BrowseSection>
            </div>
          </section>
        )}

        <section className="py-8 sm:py-10 border-b border-border/40" id="select-type">
          <div className="container px-4 sm:px-6">
            <BrowseSection title={t("browse.venueTypes")} icon={LayoutGrid}>
              <BrowseCard
                name={t("home.all")}
                subtitle={
                  countryVenueCount && countryVenueCount > 0
                    ? t("cities.venueCount", { count: countryVenueCount })
                    : undefined
                }
                imageUrl={BROWSE_ALL_CATEGORIES_IMAGE}
                isSelected={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              />
              {VENUE_TYPE_GROUPS.map((group) => (
                <BrowseCard
                  key={group.id}
                  name={group.name}
                  subtitle={group.description}
                  imageUrl={group.imageUrl}
                  isSelected={isVenueTypeSelected(group.filterCategoryId)}
                  onClick={() => setSelectedCategory(group.filterCategoryId)}
                />
              ))}
            </BrowseSection>
          </div>
        </section>

        <section className="py-8 sm:py-12" aria-label={`${country.name} venues`}>
          <div className="container px-4 sm:px-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline">
              {venuesHeading}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {t("city.venuesSubtitle")}
            </p>
          </div>
          <VenueGrid
            selectedCountry={country.id}
            selectedCity={selectedCity}
            selectedCategory={selectedCategory}
            searchQuery=""
            ignoreUrlPage
            onClearFilters={() => {
              setSelectedCity("all");
              setSelectedCategory("all");
            }}
          />
        </section>

        {country.faqs.length > 0 && (
          <section className="py-16 bg-secondary/20">
            <div className="container max-w-3xl px-4">
              <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8 text-center">
                {t("browseLanding.faqTitle", { name: country.name })}
              </h2>
              <div className="space-y-6">
                {country.faqs.map((faq, i) => (
                  <div key={i} className="card-elevated rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
