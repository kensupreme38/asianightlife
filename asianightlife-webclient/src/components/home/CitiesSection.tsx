"use client";

import { Link } from "@/i18n/routing";
import { CITIES } from "@/lib/cities";
import { useTranslations } from "next-intl";
import { MapPin, ChevronRight, Building2 } from "lucide-react";
import { CountryFlag } from "@/components/ui/country-flag";
import { useVenueStats } from "@/hooks/use-venue-stats";
import { Badge } from "@/components/ui/badge";

export function CitiesSection() {
  const t = useTranslations();
  const stats = useVenueStats();

  return (
    <section className="py-16 bg-secondary/20" aria-label="Explore cities">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-2">
            {t("cities.title")}
          </h2>
          <p className="text-muted-foreground">{t("cities.subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CITIES.map((city) => {
            const venueCount = stats?.city_stats?.[city.slug];
            return (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="card-elevated rounded-xl p-4 hover-glow transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CountryFlag country={city.countryCode} size={32} />
                  {venueCount != null && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] md:text-xs shrink-0 font-normal gap-1 px-2 py-0.5"
                    >
                      <Building2 className="h-3 w-3" />
                      {t("cities.venueCount", { count: venueCount })}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex items-start gap-1">
                  <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                  {city.heroSubtitle}
                </p>
                <span className="text-xs text-primary mt-auto pt-2 flex items-center gap-0.5">
                  {t("cities.explore")} <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/guides" className="text-primary hover:underline">
            {t("cities.wikiGuides")}
          </Link>
          <Link href="/trips" className="text-primary hover:underline">
            {t("cities.tripPackages")}
          </Link>
          <Link href="/book" className="text-primary hover:underline">
            {t("cities.startBooking")}
          </Link>
        </div>
      </div>
    </section>
  );
}
