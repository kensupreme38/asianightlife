"use client";

import { MarkdownContent } from "@/components/ui/markdown-content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageBreadcrumbBar } from "@/components/layout/Breadcrumbs";
import { Link } from "@/i18n/routing";
import type { TravelPackage } from "@/lib/travel-packages";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { whatsappMessageUrl } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { tripBreadcrumbs } from "@/lib/breadcrumbs";

export function TripDetailClient({ pkg }: { pkg: TravelPackage }) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <PageBreadcrumbBar
        items={tripBreadcrumbs(pkg, {
          home: t("common.home"),
          trips: t("trips.title"),
        })}
      />
      <main id="main-content" className="container py-8 px-4 max-w-3xl">
        <p className="text-sm text-muted-foreground mb-4">
          {pkg.from} → {pkg.to} • {pkg.duration}
        </p>
        <MarkdownContent>{pkg.content}</MarkdownContent>
        <div className="mt-8 flex flex-wrap gap-3">
          {pkg.relatedCitySlugs.map((slug) => (
            <Button key={slug} variant="outline" size="sm" asChild>
              <Link href={`/${slug}`}>{t("trips.exploreCity")}</Link>
            </Button>
          ))}
        </div>
        <div className="mt-8">
          <Button variant="neon" asChild>
            <a
              href={whatsappMessageUrl(`Hi, I'm interested in: ${pkg.title}. Can you help plan?`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t("trips.planTrip")}
            </a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

