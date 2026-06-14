"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VenueGrid } from "@/components/home/VenueGrid";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Send, BookOpen, ChevronRight } from "lucide-react";
import type { CityConfig } from "@/lib/cities";
import { GUIDES } from "@/lib/guides";
import { whatsappMessageUrl, TELEGRAM_URL } from "@/lib/constants";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CountryFlag } from "@/components/ui/country-flag";
import { getImage } from "@/lib/placeholder-images";

interface CityLandingClientProps {
  city: CityConfig;
}

export function CityLandingClient({ city }: CityLandingClientProps) {
  const t = useTranslations();
  const heroImage = getImage("hero-banner");

  const relatedGuides = GUIDES.filter(
    (g) => g.relatedCitySlug === city.slug
  ).slice(0, 3);

  const whatsappMsg = whatsappMessageUrl(
    `Hi, I'd like to book nightlife in ${city.name}. Can you help?`
  );

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />

      <main id="main-content">
        {/* Hero */}
        <section className="relative w-full min-h-[55vh] md:min-h-[50vh] overflow-hidden">
          <Image
            src={heroImage?.imageUrl || "https://picsum.photos/seed/city/1200/600"}
            alt={`${city.name} nightlife`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/50 md:bg-gradient-to-r md:from-background/95 md:via-background/70 md:to-background/30" />

          <div className="relative z-10 flex items-end md:items-center min-h-[55vh] md:min-h-[50vh] py-10 sm:py-12 md:py-16">
            <div className="container px-4 sm:px-6">
              <div className="max-w-3xl">
                <Badge className="mb-3 sm:mb-4 bg-red-bright/20 text-red-bright border-red-bright/30 flex items-center gap-2 w-fit text-xs sm:text-sm">
                  <CountryFlag country={city.countryCode} size={20} />
                  {city.country}
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-2 sm:mb-3 gradient-text leading-tight">
                  {city.heroTitle}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <MapPin className="h-4 w-4 text-red-bright shrink-0" />
                  <span>{city.heroSubtitle}</span>
                </p>
                <p className="text-sm sm:text-base text-foreground/80 max-w-2xl mb-6 sm:mb-8 leading-relaxed">
                  {city.intro}
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

        {/* Venues */}
        <section className="py-8 sm:py-12" aria-label={`${city.name} venues`}>
          <div className="container px-4 sm:px-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline">
              {t("city.venuesIn", { city: city.name })}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {t("city.venuesSubtitle")}
            </p>
          </div>
          <VenueGrid
            selectedCountry={city.country}
            selectedCity={city.filterKey}
            selectedCategory="all"
            searchQuery=""
            ignoreUrlPage
          />
        </section>

        {/* FAQ */}
        {city.faqs.length > 0 && (
          <section className="py-16 bg-secondary/20">
            <div className="container max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8 text-center">
                {t("city.faqTitle", { city: city.name })}
              </h2>
              <div className="space-y-6">
                {city.faqs.map((faq, i) => (
                  <div key={i} className="card-elevated rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="py-16">
            <div className="container">
              <h2 className="text-2xl font-bold font-headline mb-6">
                {t("city.relatedGuides")}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="card-elevated rounded-xl p-5 hover-glow transition-all group"
                  >
                    <BookOpen className="h-5 w-5 text-red-bright mb-3" />
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {guide.description}
                    </p>
                    <span className="text-sm text-primary mt-3 flex items-center gap-1">
                      {t("city.readGuide")} <ChevronRight className="h-3 w-3" />
                    </span>
                  </Link>
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
