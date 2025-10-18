"use client";
import { useMemo } from "react";
import { ktvData } from "@/lib/data";
import { useDebounce } from "./use-debounce";

export interface Venue {
  id: string;
  name: string;
  main_image_url: string;
  imageHint?: string;
  category: string;
  address: string;
  price: string;
  rating: number;
  status: "open" | "closed";
  country: string;
  phone?: string;
  hours?: string | Record<string, string | undefined>;
  description?: string;
  images?: string[];
}

interface UseVenuesProps {
  selectedCountry?: string;
  selectedCity?: string;
  selectedCategory?: string;
  searchQuery?: string;
  limit?: number;
}

export const useVenues = ({
  selectedCountry = "all",
  selectedCity = "all",
  selectedCategory = "all",
  searchQuery = "",
  limit,
}: UseVenuesProps = {}) => {
  // Debounce search query to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const venues = useMemo(() => {
    let filteredVenues = ktvData
      .filter(
        (venue) =>
          selectedCountry === "all" || venue.country === selectedCountry
      )
      .filter((venue) => {
        // Filter by city based on address content
        if (selectedCity !== "all") {
          const address = venue.address.toLowerCase();
          const city = selectedCity.toLowerCase();

          // Map city names to common address patterns
          const cityPatterns: Record<string, string[]> = {
            hanoi: ["hanoi", "hà nội"],
            "ho chi minh city": [
              "ho chi minh",
              "hồ chí minh",
              "hcm",
              "saigon",
              "sài gòn",
              "district 1",
              "district 3",
              "district 5",
              "district 6",
              "quận 1",
              "quận 3",
              "quận 5",
              "quận 6",
            ],
            danang: ["da nang", "đà nẵng"],
            "nha trang": ["nha trang", "nha trang"],
            "vung tau": ["vung tau", "vũng tàu"],
            "can tho": ["can tho", "cần thơ"],
            "phu quoc": ["phu quoc", "phú quốc"],
            singapore: ["singapore"],
            bangkok: ["bangkok"],
            "chiang mai": ["chiang mai", "chiangmai"],
            pattaya: ["pattaya"],
            phuket: ["phuket"],
            "hat yai": ["hat yai"],
            penang: ["penang"],
            "kuala lumpur": ["kuala lumpur", "kl"],
            "johor bahru": ["johor bahru", "jb"],
            "kota kinabalu": ["kota kinabalu"],
          };

          const patterns = cityPatterns[city] || [city];
          return patterns.some((pattern) => address.includes(pattern));
        }
        return true;
      })
      .filter(
        (venue) =>
          selectedCategory === "all" || venue.category === selectedCategory
      )
      .filter(
        (venue) =>
          !debouncedSearchQuery ||
          venue.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          venue.address
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      )
      .map(
        (ktv): Venue => ({
          ...ktv,
          id: ktv.id.toString(),
          rating: 4.5,
          status: "open" as const,
          imageHint: "ktv lounge",
        })
      );

    // Apply limit if specified
    if (limit && limit > 0) {
      filteredVenues = filteredVenues.slice(0, limit);
    }

    return filteredVenues;
  }, [
    selectedCountry,
    selectedCity,
    selectedCategory,
    debouncedSearchQuery,
    limit,
  ]);

  const totalCount = useMemo(() => {
    return ktvData
      .filter(
        (venue) =>
          selectedCountry === "all" || venue.country === selectedCountry
      )
      .filter((venue) => {
        // Filter by city based on address content
        if (selectedCity !== "all") {
          const address = venue.address.toLowerCase();
          const city = selectedCity.toLowerCase();

          // Map city names to common address patterns
          const cityPatterns: Record<string, string[]> = {
            hanoi: ["hanoi", "hà nội"],
            "ho chi minh city": [
              "ho chi minh",
              "hồ chí minh",
              "hcm",
              "saigon",
              "sài gòn",
              "district 1",
              "district 3",
              "district 5",
              "district 6",
              "quận 1",
              "quận 3",
              "quận 5",
              "quận 6",
            ],
            danang: ["da nang", "đà nẵng"],
            "nha trang": ["nha trang", "nha trang"],
            "vung tau": ["vung tau", "vũng tàu"],
            "can tho": ["can tho", "cần thơ"],
            "phu quoc": ["phu quoc", "phú quốc"],
            singapore: ["singapore"],
            bangkok: ["bangkok"],
            "chiang mai": ["chiang mai", "chiangmai"],
            pattaya: ["pattaya"],
            phuket: ["phuket"],
            "hat yai": ["hat yai"],
            penang: ["penang"],
            "kuala lumpur": ["kuala lumpur", "kl"],
            "johor bahru": ["johor bahru", "jb"],
            "kota kinabalu": ["kota kinabalu"],
          };

          const patterns = cityPatterns[city] || [city];
          return patterns.some((pattern) => address.includes(pattern));
        }
        return true;
      })
      .filter(
        (venue) =>
          selectedCategory === "all" || venue.category === selectedCategory
      )
      .filter(
        (venue) =>
          !debouncedSearchQuery ||
          venue.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          venue.address
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      ).length;
  }, [selectedCountry, selectedCity, selectedCategory, debouncedSearchQuery]);

  return {
    venues,
    totalCount,
    isLoading: false, // Since we're using static data
  };
};
