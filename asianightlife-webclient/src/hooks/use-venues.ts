"use client";
import { useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasDataRef = useRef(false);
  const filterKeyRef = useRef("");

  const filterKey = `${selectedCountry}|${selectedCity}|${selectedCategory}|${debouncedSearchQuery}`;

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    if (filterKeyRef.current !== filterKey) {
      hasDataRef.current = false;
      filterKeyRef.current = filterKey;
    }

    const fetchVenues = async () => {
      if (hasDataRef.current) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const calculatedOffset =
          page !== undefined && pageSize !== undefined ? (page - 1) * pageSize : offset || 0;
        const effectiveLimit = limit || (pageSize !== undefined ? pageSize : 100);
        const params = new URLSearchParams({
          offset: String(calculatedOffset),
          limit: String(effectiveLimit),
        });

        if (selectedCountry !== "all") params.set("country", selectedCountry);
        if (selectedCity !== "all") params.set("city", selectedCity);
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (debouncedSearchQuery) params.set("search", debouncedSearchQuery);

        const response = await fetch(`/api/venues?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Failed to fetch venues");

        const result = await response.json();
        if (cancelled) return;

        const fetchedVenues: Venue[] = (result.venues || []).map((venue: any) => ({
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

        setVenues(fetchedVenues);
        setTotalCount(result.total ?? fetchedVenues.length);
        hasDataRef.current = fetchedVenues.length > 0;
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
        if (!hasDataRef.current) {
          setVenues([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    fetchVenues();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    selectedCountry,
    selectedCity,
    selectedCategory,
    debouncedSearchQuery,
    limit,
    offset,
    page,
    pageSize,
    filterKey,
  ]);

  return {
    venues,
    totalCount,
    isLoading,
    isRefreshing,
  };
};
