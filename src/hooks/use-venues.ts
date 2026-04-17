"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";

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
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        const calculatedOffset =
          page !== undefined && pageSize !== undefined ? (page - 1) * pageSize : offset || 0;
        const effectiveLimit = limit || (pageSize !== undefined ? pageSize : 100);
        const params = new URLSearchParams({
          offset: String(calculatedOffset),
          limit: String(effectiveLimit),
        });

        if (selectedCountry !== "all") params.set("country", selectedCountry);
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);

        const response = await fetch(`/api/venues?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch venues");

        const result = await response.json();
        let fetchedVenues: Venue[] = (result.venues || []).map((venue: any) => ({
          id: String(venue.id),
          slug: venue.slug,
          name: venue.name,
          main_image_url: venue.main_image_url,
          imageHint: "ktv lounge",
          category: venue.category,
          address: venue.address || "",
          price: venue.price || "",
          rating: Number(venue.rating || 4.5),
          status: venue.status === "closed" ? "closed" : "open",
          country: venue.country || "Unknown",
          phone: venue.phone,
          hours: venue.hours,
          description: venue.description,
          images: venue.images || [],
        }));

        if (selectedCity !== "all") {
          const city = selectedCity.toLowerCase();
          const patterns = CITY_PATTERNS[city] || [city];
          fetchedVenues = fetchedVenues.filter((venue) =>
            patterns.some((pattern) => (venue.address || "").toLowerCase().includes(pattern))
          );
        }

        setVenues(fetchedVenues);
        setTotalCount(result.total || fetchedVenues.length);
      } catch (error) {
        setVenues([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [selectedCountry, selectedCity, selectedCategory, debouncedSearchQuery, limit, offset, page, pageSize]);

  return {
    venues,
    totalCount,
    isLoading,
  };
};
