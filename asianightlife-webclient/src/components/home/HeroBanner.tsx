"use client";

import { Star, MessageCircle, Send, MapPin, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getImage } from "@/lib/placeholder-images";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CountryFlag } from "@/components/ui/country-flag";
import { Button } from "@/components/ui/button";
import { CITIES } from "@/lib/cities";
import { whatsappMessageUrl, TELEGRAM_URL } from "@/lib/constants";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 10000;

export const HeroBanner = () => {
  const t = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);
  const pauseUntilRef = useRef(0);
  const heroBannerImage = getImage("hero-banner");
  const heroBannerImage2 = getImage("hero-banner-2");

  const banners = useMemo(
    () => [
      {
        id: 1,
        image: heroBannerImage?.imageUrl || "https://picsum.photos/seed/hero/1200/600",
        imageHint: heroBannerImage?.imageHint,
        title: t("hero.headline"),
        subtitle: t("hero.subheadline"),
        description: t("hero.description"),
        badge: t("hero.badge"),
        showCTAs: true,
      },
      {
        id: 2,
        image: heroBannerImage2?.imageUrl || "https://picsum.photos/seed/hero2/1200/600",
        imageHint: heroBannerImage2?.imageHint,
        title: t("hero.specialWeekendOffer"),
        subtitle: t("hero.weekendSubtitle"),
        description: t("hero.weekendDescription"),
        badge: t("hero.premiumVenues"),
        showCTAs: false,
      },
    ],
    [t, heroBannerImage, heroBannerImage2]
  );

  const goToSlide = useCallback(
    (index: number) => {
      pauseUntilRef.current = Date.now() + SLIDE_DURATION_MS;
      setCurrentSlide((index + banners.length) % banners.length);
    },
    [banners.length]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [banners.length]);

  const whatsappUrl = whatsappMessageUrl(t("hero.whatsappDefaultMessage"));

  return (
    <section
      className="relative w-full min-h-[72vh] sm:min-h-[65vh] md:min-h-[65vh] overflow-x-hidden"
      aria-roledescription="carousel"
      aria-label="Hero banner"
    >
      <div className="relative w-full min-h-[72vh] sm:min-h-[65vh] md:min-h-[65vh]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
            aria-hidden={index !== currentSlide}
          >
            <Image
              src={banner.image}
              alt={`${banner.title} - Asia Night Life`}
              fill
              className="object-cover"
              priority={index === 0}
              draggable={false}
              data-ai-hint={banner.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />

            <div className="relative h-full flex items-center py-10 sm:py-12 md:py-16 min-h-[72vh] sm:min-h-[65vh] md:min-h-[65vh]">
              <div className="container px-4 pb-14 sm:pb-12">
                <div className="max-w-3xl">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <Star className="h-5 w-5 text-red-orange fill-current" />
                    <span className="text-sm font-medium text-red-orange uppercase tracking-wide">
                      {banner.badge}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight font-headline">
                    <span className="gradient-text">{banner.title}</span>
                  </h1>

                  <p className="text-base md:text-lg text-foreground/90 mb-3 leading-relaxed max-w-2xl">
                    {banner.subtitle}
                  </p>

                  <p className="text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl">
                    {banner.description}
                  </p>

                  {banner.showCTAs && (
                    <div className="grid grid-cols-2 gap-2 w-full max-w-md sm:max-w-none sm:flex sm:flex-wrap sm:gap-3">
                      <Button
                        variant="neon"
                        size="sm"
                        className="w-full h-9 px-2.5 text-xs sm:w-auto sm:h-10 sm:px-4 sm:text-sm md:h-11 md:px-8"
                        asChild
                      >
                        <Link href="/book">
                          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
                          <span className="truncate">{t("hero.bookNow")}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 px-2.5 text-xs sm:w-auto sm:h-10 sm:px-4 sm:text-sm md:h-11 md:px-8"
                        asChild
                      >
                        <Link href="/singapore-nightlife">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
                          <span className="truncate">{t("hero.exploreCities")}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 px-2.5 text-xs sm:w-auto sm:h-10 sm:px-4 sm:text-sm md:h-11 md:px-8"
                        asChild
                      >
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
                          <span className="truncate">{t("hero.whatsappConcierge")}</span>
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 px-2.5 text-xs sm:w-auto sm:h-10 sm:px-4 sm:text-sm md:h-11 md:px-8"
                        asChild
                      >
                        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                          <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
                          <span className="truncate">{t("hero.telegramConcierge")}</span>
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => goToSlide(currentSlide - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/90 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goToSlide(currentSlide + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/90 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/40 hidden md:block z-10">
        <div className="container py-3 flex flex-wrap gap-2 justify-center">
          {CITIES.slice(0, 6).map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 flex items-center gap-1.5"
            >
              <CountryFlag country={city.countryCode} size={16} />
              {city.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : undefined}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-red-bright w-6"
                : "bg-white/40 hover:bg-white/60 w-2.5"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};
