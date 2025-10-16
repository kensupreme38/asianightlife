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
        // The city filter is prepared for when city data is available in ktvData
        if (selectedCountry !== "all" && selectedCity !== "all") {
          // Assuming venue object will have a 'city' property
          // return venue.city === selectedCity;
          return true; // Currently returning true to not filter out everything
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
  }, [selectedCountry, selectedCategory, debouncedSearchQuery]);

  return {
    venues,
    totalCount,
    isLoading: false, // Since we're using static data
  };
};
