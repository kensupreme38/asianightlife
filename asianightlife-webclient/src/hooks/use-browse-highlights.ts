"use client";

import { useEffect, useState } from "react";
import { detectCityFromVenue } from "@/lib/cities";
import { getVenueUrl } from "@/lib/venue-url";

export interface BrowseVenueHighlight {
  id: string;
  name: string;
  slug: string;
  category: string;
  country: string;
  address: string;
  cityName: string;
  href: string;
  rating: number;
}

interface UseBrowseHighlightsOptions {
  country?: string;
  city?: string;
  limit?: number;
}

async function fetchHighlights(
  country?: string,
  city?: string,
  limit = 50
): Promise<BrowseVenueHighlight[]> {
  const params = new URLSearchParams({ limit: String(limit), offset: "0" });
  if (country && country !== "all") params.set("country", country);
  if (city && city !== "all") params.set("city", city);

  const response = await fetch(`/api/venues?${params.toString()}`, { cache: "no-store" });
  if (!response.ok) return [];

  const result = await response.json();
  return (result.venues || []).map((venue: Record<string, unknown>) => {
    const countryName = String(venue.country || "Unknown");
    const address = String(venue.address || "");
    const city = detectCityFromVenue(countryName, address);
    const highlight: BrowseVenueHighlight = {
      id: String(venue.id),
      name: String(venue.name),
      slug: String(venue.slug || ""),
      category: String(venue.category || "venue"),
      country: countryName,
      address,
      cityName: city?.name || countryName,
      href: getVenueUrl({
        slug: venue.slug ? String(venue.slug) : undefined,
        name: String(venue.name),
        country: countryName,
        address,
      }),
      rating: Number(venue.rating || 0),
    };
    return highlight;
  });
}

export function useBrowseHighlights({
  country = "all",
  city = "all",
  limit = 50,
}: UseBrowseHighlightsOptions = {}) {
  const [venues, setVenues] = useState<BrowseVenueHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchHighlights(country, city, limit)
      .then((data) => {
        if (!cancelled) setVenues(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [country, city, limit]);

  const topVenues = [...venues].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const newUpdates = venues.slice(0, 5);

  return { topVenues, newUpdates, allVenues: venues, isLoading };
}
