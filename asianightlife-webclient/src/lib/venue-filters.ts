import { CITY_PATTERNS } from "@/lib/cities";
import { BROWSE_CITIES } from "@/lib/browse-cards-data";

/** Normalize URL city value to a CITY_PATTERNS filter key. */
export function normalizeCityFilterKey(city: string): string {
  return city.toLowerCase().trim();
}

export function cityFilterIsSupported(city: string): boolean {
  if (!city || city === "all") return true;
  return Boolean(CITY_PATTERNS[normalizeCityFilterKey(city)]);
}

export function findBrowseCity(city: string) {
  const key = normalizeCityFilterKey(city);
  return BROWSE_CITIES.find(
    (c) =>
      normalizeCityFilterKey(c.id) === key ||
      normalizeCityFilterKey(c.name) === key
  );
}

export function getCountryForCityFilter(city: string): string | undefined {
  return findBrowseCity(city)?.country;
}

export function isCountryCityPairValid(country: string, city: string): boolean {
  if (city === "all" || country === "all") return true;
  const cityCountry = getCountryForCityFilter(city);
  if (!cityCountry) return cityFilterIsSupported(city);
  return cityCountry === country;
}

export interface VenueFilterState {
  country: string;
  city: string;
  category: string;
}

/** Fix invalid URL filter combinations before fetching venues. */
export function sanitizeVenueFilters({
  country,
  city,
  category,
}: VenueFilterState): VenueFilterState {
  let nextCountry = country;
  let nextCity = city;
  const nextCategory = category;

  if (nextCity !== "all") {
    if (!cityFilterIsSupported(nextCity)) {
      nextCity = "all";
    } else {
      const cityCountry = getCountryForCityFilter(nextCity);
      if (cityCountry) {
        if (nextCountry === "all") {
          nextCountry = cityCountry;
        } else if (nextCountry !== cityCountry) {
          nextCity = "all";
        }
      }
    }
  }

  return {
    country: nextCountry,
    city: nextCity,
    category: nextCategory,
  };
}

export function filtersToSearchParams(
  filters: VenueFilterState,
  existing?: URLSearchParams
): URLSearchParams {
  const params = new URLSearchParams(existing?.toString() ?? "");

  if (filters.country === "all") params.delete("country");
  else params.set("country", filters.country);

  if (filters.city === "all") params.delete("city");
  else params.set("city", filters.city);

  if (filters.category === "all") params.delete("type");
  else params.set("type", filters.category);

  return params;
}
