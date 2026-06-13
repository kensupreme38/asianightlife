"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, ChevronLeft, MapPin, Building2, Users, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CITIES } from "@/lib/cities";
import { CountryFlag } from "@/components/ui/country-flag";
import { useVenues } from "@/hooks/use-venues";
import { useTranslations } from "next-intl";
import { whatsappMessageUrl } from "@/lib/constants";
import { SimpleImage } from "@/components/ui/simple-image";

type Step = 1 | 2 | 3 | 4;

export function BookingFunnelClient() {
  const t = useTranslations();
  const [step, setStep] = useState<Step>(1);
  const [selectedCitySlug, setSelectedCitySlug] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("20:00");
  const [pax, setPax] = useState("4");

  const city = CITIES.find((c) => c.slug === selectedCitySlug);

  const { venues, isLoading } = useVenues({
    selectedCountry: city?.country ?? "all",
    selectedCity: city?.filterKey ?? "all",
    limit: 50,
  });

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  const times = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, "0");
    return `${h}:00`;
  }).filter((t) => parseInt(t) >= 16 || parseInt(t) <= 4);

  const buildWhatsAppMessage = () => {
    const lines = [
      "🎉 New Booking Request — Asia Night Life",
      "",
      `📍 City: ${city?.name ?? "—"}`,
      `🏢 Venue: ${selectedVenue?.name ?? "Any recommendation"}`,
      `📅 Date: ${selectedDate ? format(selectedDate, "PPP") : "—"}`,
      `⏰ Time: ${selectedTime}`,
      `👥 Group Size: ${pax} pax`,
      "",
      "Please confirm availability. Thank you!",
    ];
    return lines.join("\n");
  };

  const canProceed = () => {
    if (step === 1) return !!selectedCitySlug;
    if (step === 2) return !!selectedVenueId;
    if (step === 3) return !!selectedDate && !!selectedTime && !!pax;
    return true;
  };

  const stepLabels = [
    t("book.step1"),
    t("book.step2"),
    t("book.step3"),
    t("book.step4"),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <main className="container py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold font-headline mb-2 gradient-text">
          {t("book.title")}
        </h1>
        <p className="text-muted-foreground mb-8">{t("book.subtitle")}</p>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0",
                  step > i + 1
                    ? "bg-red-bright text-white"
                    : step === i + 1
                    ? "bg-red-bright/20 text-red-bright border-2 border-red-bright"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-1",
                    step > i + 1 ? "bg-red-bright" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-primary mb-6">{stepLabels[step - 1]}</p>

        {/* Step 1: City */}
        {step === 1 && (
          <div className="space-y-3">
            {CITIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSelectedCitySlug(c.slug)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                  selectedCitySlug === c.slug
                    ? "border-red-bright bg-red-bright/5"
                    : "border-border hover:border-red-bright/50"
                )}
              >
                <CountryFlag country={c.countryCode} size={32} />
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.heroSubtitle}</p>
                </div>
                <MapPin className="h-4 w-4 ml-auto text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Venue */}
        {step === 2 && (
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-muted-foreground">{t("common.loading")}</p>
            ) : venues.length === 0 ? (
              <p className="text-muted-foreground">{t("home.noVenuesFound")}</p>
            ) : (
              venues.slice(0, 20).map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVenueId(v.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                    selectedVenueId === v.id
                      ? "border-red-bright bg-red-bright/5"
                      : "border-border hover:border-red-bright/50"
                  )}
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                    <SimpleImage src={v.main_image_url} alt={v.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.category} • {v.price}</p>
                  </div>
                  <Building2 className="h-4 w-4 ml-auto shrink-0 text-muted-foreground" />
                </button>
              ))
            )}
          </div>
        )}

        {/* Step 3: Date/Time/Pax */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("bookingForm.bookingDateTime")}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, "PPP") : t("bookingForm.pickDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(d) => d < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t("book.selectTime")}</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t("bookingForm.numberOfPeople")}</label>
              <Select value={pax} onValueChange={setPax}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? t("bookingForm.person") : t("bookingForm.people")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 4: Confirm WhatsApp */}
        {step === 4 && (
          <div className="card-elevated rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-lg">{t("book.confirmTitle")}</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">{t("book.city")}:</span> {city?.name}</p>
              <p><span className="text-muted-foreground">{t("bookingForm.venue")}:</span> {selectedVenue?.name}</p>
              <p><span className="text-muted-foreground">{t("bookingForm.bookingDateTime")}:</span> {selectedDate ? format(selectedDate, "PPP") : ""} {selectedTime}</p>
              <p className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {pax} pax
              </p>
            </div>
            <Button variant="neon" size="lg" className="w-full" asChild>
              <a
                href={whatsappMessageUrl(buildWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {t("book.confirmWhatsApp")}
              </a>
            </Button>
            <p className="text-xs text-muted-foreground text-center">{t("book.confirmNote")}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("book.back")}
          </Button>
          {step < 4 ? (
            <Button
              variant="neon"
              onClick={() => setStep((s) => Math.min(4, s + 1) as Step)}
              disabled={!canProceed()}
            >
              {t("book.next")}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
