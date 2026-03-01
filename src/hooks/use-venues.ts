"use client";
import { useMemo, useCallback } from "react";
import { ktvData } from "@/lib/data";
import { useDebounce } from "./use-debounce";
import { generateSlug } from "@/lib/slug-utils";

export interface Venue {
  id: string;
  slug: string;
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
  offset?: number;
  page?: number;
  pageSize?: number;
}

// City patterns mapping - moved outside component for better performance
const CITY_PATTERNS: Record<string, string[]> = {
  hanoi: ["hanoi", "hà nội", "hoan kiem district", "tho nhuom", "tran hung dao ward"],
  "ho chi minh city": [
    "ho chi minh", "hồ chí minh", "ho chi minh city", "hcm", "saigon", "sài gòn",
    "district 1", "district 3", "district 5", "district 6", "quận 1", "quận 3", "quận 5", "quận 6",
    "trần hưng đạo", "phạm viết chánh", "đề thám", "an duong vuong", "bui thi xuan",
    "cho lon", "võ thị sáu", "hoang sa", "le thanh ton", "lê thánh tôn", "ben nghe ward", "hcmc",
  ],
  danang: ["da nang", "đà nẵng", "da nang city"],
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

export const useVenues = ({
  selectedCountry = "all",
  selectedCity = "all",
  selectedCategory = "all",
  searchQuery = "",
  limit,
  offset,
  page,
  pageSize,
}: UseVenuesProps = {}) => {
  // Debounce search query to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoized filtering functions
  const filterByCountry = useCallback((venue: any) => 
    selectedCountry === "all" || venue.country === selectedCountry, 
    [selectedCountry]
  );

  const filterByCity = useCallback((venue: any) => {
    if (selectedCity === "all") return true;
    const address = venue.address.toLowerCase();
    const city = selectedCity.toLowerCase();
    const patterns = CITY_PATTERNS[city] || [city];
    return patterns.some((pattern) => address.includes(pattern));
  }, [selectedCity]);

  const filterByCategory = useCallback((venue: any) => 
    selectedCategory === "all" || venue.category === selectedCategory, 
    [selectedCategory]
  );

  const filterBySearch = useCallback((venue: any) => {
    if (!debouncedSearchQuery) return true;
    const query = debouncedSearchQuery.toLowerCase();
    return venue.name.toLowerCase().includes(query) || 
           venue.address.toLowerCase().includes(query);
  }, [debouncedSearchQuery]);

  const venues = useMemo(() => {
    let filteredVenues = ktvData
      .filter(filterByCountry)
      .filter(filterByCity)
      .filter(filterByCategory)
      .filter(filterBySearch)
      .map((ktv): Venue => ({
        ...ktv,
        id: ktv.id.toString(),
        slug: (ktv as any).slug || generateSlug(ktv.name),
        rating: 4.5,
        status: "open" as const,
        imageHint: "ktv lounge",
        country: ktv.country || "Unknown",
      }));

    // Calculate offset from page/pageSize if provided, otherwise use offset directly
    let calculatedOffset = offset;
    if (page !== undefined && pageSize !== undefined) {
      calculatedOffset = (page - 1) * pageSize;
    }

    // Apply pagination: first slice by offset, then by limit
    if (calculatedOffset !== undefined && calculatedOffset > 0) {
      filteredVenues = filteredVenues.slice(calculatedOffset);
    }

    // Apply limit if specified (or use pageSize)
    const effectiveLimit = limit || (pageSize !== undefined ? pageSize : undefined);
    if (effectiveLimit && effectiveLimit > 0) {
      filteredVenues = filteredVenues.slice(0, effectiveLimit);
    }

    return filteredVenues;
  }, [filterByCountry, filterByCity, filterByCategory, filterBySearch, limit, offset, page, pageSize]);

  const totalCount = useMemo(() => {
    return ktvData
      .filter(filterByCountry)
      .filter(filterByCity)
      .filter(filterByCategory)
      .filter(filterBySearch)
      .length;
  }, [filterByCountry, filterByCity, filterByCategory, filterBySearch]);

  return {
    venues,
    totalCount,
    isLoading: false, // Since we're using static data
  };
};
