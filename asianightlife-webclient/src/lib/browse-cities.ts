import {
  BROWSE_CITIES,
  browseImage,
  type BrowseCity,
} from "./browse-cards-data";

/** City filter ids per country (matches homepage CountrySelector). */
export const CITY_IDS_BY_COUNTRY: Record<string, { id: string; name: string }[]> = {
  Singapore: [{ id: "singapore", name: "Singapore" }],
  Vietnam: [
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
    { id: "Bangkok", name: "Bangkok" },
    { id: "Chiang Mai", name: "Chiang Mai" },
    { id: "Pattaya", name: "Pattaya" },
    { id: "Phuket", name: "Phuket" },
    { id: "Hat Yai", name: "Hat Yai" },
  ],
  Malaysia: [
    { id: "Penang", name: "Penang" },
    { id: "Kuala Lumpur", name: "Kuala Lumpur" },
    { id: "Johor Bahru", name: "Johor Bahru" },
    { id: "Kota Kinabalu", name: "Kota Kinabalu" },
  ],
};

export function toCityImageSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function mergeCityBrowseData(
  filterCities: { id: string; name: string }[],
  country: string
): BrowseCity[] {
  const browseById = new Map(
    BROWSE_CITIES.filter((c) => c.country === country).map((c) => [c.id, c])
  );

  return filterCities.map((city) => {
    const existing = browseById.get(city.id);
    if (existing) return existing;
    return {
      id: city.id,
      name: city.name,
      country,
      imageUrl: browseImage("cities", toCityImageSlug(city.name)),
    };
  });
}

export function getBrowseCitiesForCountry(countryId: string): BrowseCity[] {
  const filterList = CITY_IDS_BY_COUNTRY[countryId];
  if (filterList?.length) {
    return mergeCityBrowseData(filterList, countryId);
  }
  return BROWSE_CITIES.filter((c) => c.country === countryId);
}
