"use client";
import {
  Building2,
  Globe,
  Utensils,
  Music,
  Mic,
  Radio,
  Beer,
  Martini,
  Building,
  Bath,
  HeartHandshake,
  Hotel,
  Coffee,
  Soup,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ktvData } from "@/lib/data";
import { useMemo } from "react";
import { useTranslations } from 'next-intl';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const getCountries = (t: any) => [
  { id: "all", name: t('home.allCountries'), flag: "🌏" },
  { id: "Singapore", name: "Singapore", flag: "🇸🇬" },
  { id: "Vietnam", name: "Vietnam", flag: "🇻🇳" },
  { id: "Thailand", name: "Thailand", flag: "🇹🇭" },
  { id: "Malaysia", name: "Malaysia", flag: "🇲🇾" },
  { id: "Cambodia", name: "Cambodia", flag: "🇰🇭" },
  { id: "Indonesia", name: "Indonesia", flag: "🇮🇩" },
  { id: "Japan", name: "Japan", flag: "🇯🇵" },
  { id: "Macao", name: "Macao", flag: "🇲🇴" },
  { id: "Philippines", name: "Philippines", flag: "🇵🇭" },
  { id: "South Korea", name: "South Korea", flag: "🇰🇷" },
  { id: "Taiwan", name: "Taiwan", flag: "🇹🇼" },
];

const getCategories = (t: any) => [
  { id: "all", name: t('home.all'), icon: Music },
  // Nightlife
  { id: "Night market", name: "Night market", icon: Utensils },
  { id: "Karaoke", name: "Karaoke", icon: Mic },
  { id: "Nightclub / clubbing", name: "Nightclub / clubbing", icon: Radio },
  { id: "Live house / Beer club", name: "Live house / Beer club", icon: Beer },
  { id: "Pub", name: "Pub", icon: Beer },
  {
    id: "Lounge / Speakeasy bar",
    name: "Lounge / Speakeasy bar",
    icon: Martini,
  },
  { id: "Sky Bar", name: "Sky Bar", icon: Building },
  // Relax
  { id: "Spa / Osen", name: "Spa / Osen", icon: Bath },
  { id: "Massage", name: "Massage", icon: HeartHandshake },
  // Hotel
  { id: "Hotel", name: "Hotel", icon: Hotel },
  // Food
  { id: "Restaurants", name: "Restaurants", icon: Utensils },
  { id: "Breakfast", name: "Breakfast", icon: Coffee },
  {
    id: "Supper (after 12 midnight)",
    name: "Supper (after 12 midnight)",
    icon: Soup,
  },
];

const getCitiesByCountry = (t: any): Record<string, { id: string; name: string }[]> => ({
  Vietnam: [
    { id: "all", name: t('home.allCities') },
    { id: "Hanoi", name: "Hanoi" },
    { id: "Ha Long Bay", name: "Ha Long Bay" },
    { id: "Danang", name: "Danang" },
    { id: "Nha Trang", name: "Nha Trang" },
    { id: "Ho Chi Minh City", name: "Ho Chi Minh City" },
    { id: "Vung Tau", name: "Vung Tau" },
    { id: "Can Tho", name: "Can Tho" },
    { id: "Phu Quoc", name: "Phu Quoc" },
  ],
  Thailand: [
    { id: "all", name: t('home.allCities') },
    { id: "Bangkok", name: "Bangkok" },
    { id: "Chiang Mai", name: "Chiang Mai" },
    { id: "Pattaya", name: "Pattaya" },
    { id: "Phuket", name: "Phuket" },
    { id: "Hat Yai", name: "Hat Yai" },
  ],
  Malaysia: [
    { id: "all", name: t('home.allCities') },
    { id: "Penang", name: "Penang" },
    { id: "Kuala Lumpur", name: "Kuala Lumpur" },
    { id: "Johor Bahru", name: "Johor Bahru" },
    { id: "Kota Kinabalu", name: "Kota Kinabalu" },
  ],
});

export const CountrySelector = ({
  selectedCountry,
  onCountryChange,
  selectedCity,
  onCityChange,
  selectedCategory,
  onCategoryChange,
}: CountrySelectorProps) => {
  const t = useTranslations();
  const countries = useMemo(() => getCountries(t), [t]);
  const citiesByCountry = useMemo(() => getCitiesByCountry(t), [t]);
  const availableCities = citiesByCountry[selectedCountry] || [];
  const isCitySelectorEnabled = availableCities.length > 0;

  const categories = useMemo(() => getCategories(t), [t]);
  
  // Calculate venue counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((category) => {
      if (category.id === "all") {
        counts[category.id] = ktvData.length;
      } else {
        counts[category.id] = ktvData.filter(
          (venue) => venue.category === category.id
        ).length;
      }
    });
    return counts;
  }, []);

  return (
    <section id="country-selector" className="py-8 border-b border-border/40">
      <div className="md:container px-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Countries */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold font-headline">
                {t('home.selectCountry')}
              </h2>
            </div>
            <Select value={selectedCountry} onValueChange={onCountryChange}>
              <SelectTrigger className="h-10 text-sm md:h-12 md:text-base">
                <SelectValue placeholder={t('home.selectCountryPlaceholder')} />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <div className="flex items-center gap-2">
                      <span className={cn(country.id === "all" && "grayscale")}>
                        {country.flag}
                      </span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cities */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold font-headline">
                {t('home.selectCity')}
              </h2>
            </div>
            <Select
              value={selectedCity}
              onValueChange={onCityChange}
              disabled={!isCitySelectorEnabled}
            >
              <SelectTrigger className="h-10 text-sm md:h-12 md:text-base">
                <SelectValue
                  placeholder={
                    isCitySelectorEnabled
                      ? t('home.selectCityPlaceholder')
                      : t('home.selectCityFirst')
                  }
                />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {availableCities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold font-headline">
                {t('home.entertainmentType')}
              </h2>
            </div>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-10 text-sm md:h-12 md:text-base">
                <SelectValue placeholder={t('home.selectType')} />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = categoryCounts[category.id] || 0;
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{category.name}</span>
                        </div>
                        {count > 0 && (
                          <span className="text-muted-foreground text-sm">
                            ({count})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
};
