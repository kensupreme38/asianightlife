"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VenueGrid } from "@/components/home/VenueGrid";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Globe } from "lucide-react";
import type { CategoryConfig } from "@/lib/categories";
import { COUNTRIES } from "@/lib/countries";
import { whatsappMessageUrl, TELEGRAM_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PageBreadcrumbBar } from "@/components/layout/Breadcrumbs";
import { categoryBreadcrumbs } from "@/lib/breadcrumbs";

interface CategoryLandingClientProps {
  category: CategoryConfig;
}

export function CategoryLandingClient({ category }: CategoryLandingClientProps) {
  const t = useTranslations();

  const whatsappMsg = whatsappMessageUrl(
    `Hi, I'd like to book a ${category.name} venue. Can you help?`
  );

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <PageBreadcrumbBar
        items={categoryBreadcrumbs(category, {
          home: t("common.home"),
          categories: t("breadcrumbs.categories"),
        })}
      />

      <main id="main-content">
        <section className="relative w-full min-h-[55vh] md:min-h-[50vh] overflow-hidden">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/50 md:bg-gradient-to-r md:from-background/95 md:via-background/70 md:to-background/30" />

          <div className="relative z-10 flex items-end md:items-center min-h-[55vh] md:min-h-[50vh] py-10 sm:py-12 md:py-16">
            <div className="container px-4 sm:px-6">
              <div className="max-w-3xl">
                <Badge className="mb-3 sm:mb-4 bg-red-bright/20 text-red-bright border-red-bright/30 flex items-center gap-2 w-fit text-xs sm:text-sm">
                  {category.name}
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-2 sm:mb-3 gradient-text leading-tight">
                  {category.heroTitle}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-2">
                  {category.heroSubtitle}
                </p>
                <p className="text-sm sm:text-base text-foreground/80 max-w-2xl mb-6 sm:mb-8 leading-relaxed">
                  {category.intro}
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

        <section className="py-8 border-b border-border/40">
          <div className="container px-4 sm:px-6">
            <h2 className="text-lg sm:text-xl font-bold font-headline mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t("browseLanding.browseByCountry")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((country) => (
                <Button key={country.slug} variant="outline" size="sm" asChild>
                  <Link href={`/countries/${country.slug}`}>{country.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12" aria-label={`${category.name} venues`}>
          <div className="container px-4 sm:px-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline">
              {t("browseLanding.categoryVenues", { name: category.name })}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {t("city.venuesSubtitle")}
            </p>
          </div>
          <VenueGrid
            selectedCountry="all"
            selectedCity="all"
            selectedCategory={category.id}
            searchQuery=""
            ignoreUrlPage
          />
        </section>

        {category.faqs.length > 0 && (
          <section className="py-16 bg-secondary/20">
            <div className="container max-w-3xl px-4">
              <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8 text-center">
                {t("browseLanding.categoryFaq", { name: category.name })}
              </h2>
              <div className="space-y-6">
                {category.faqs.map((faq, i) => (
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
