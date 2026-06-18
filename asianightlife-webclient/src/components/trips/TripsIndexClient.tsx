"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/routing";
import { TRAVEL_PACKAGES } from "@/lib/travel-packages";
import { Plane, Clock, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageBreadcrumbBar } from "@/components/layout/Breadcrumbs";
import { tripsIndexBreadcrumbs } from "@/lib/breadcrumbs";

export function TripsIndexClient() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <PageBreadcrumbBar
        items={tripsIndexBreadcrumbs({
          home: t("common.home"),
          trips: t("trips.title"),
        })}
      />
      <main id="main-content" className="container py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline gradient-text mb-3">
          {t("trips.title")}
        </h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">{t("trips.subtitle")}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {TRAVEL_PACKAGES.map((pkg) => (
            <Link
              key={pkg.slug}
              href={`/trips/${pkg.slug}`}
              className="card-elevated rounded-xl p-6 hover-glow transition-all group"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Plane className="h-4 w-4" />
                {pkg.from} → {pkg.to}
                <span className="flex items-center gap-1 ml-auto">
                  <Clock className="h-3 w-3" /> {pkg.duration}
                </span>
              </div>
              <h2 className="font-bold text-xl group-hover:text-primary transition-colors mb-2">
                {pkg.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {pkg.description}
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                {pkg.highlights.slice(0, 3).map((h) => (
                  <li key={h}>• {h}</li>
                ))}
              </ul>
              <span className="text-sm text-primary flex items-center gap-1">
                {t("trips.readMore")} <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
