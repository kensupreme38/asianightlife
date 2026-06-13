"use client";

import { useEffect, useState } from "react";

export interface VenueStats {
  total_venues: number;
  country_stats: Record<string, number>;
  category_stats: Record<string, number>;
  city_stats: Record<string, number>;
}

let cachedStats: VenueStats | null = null;
let inflight: Promise<VenueStats> | null = null;

async function fetchVenueStats(): Promise<VenueStats> {
  if (cachedStats) return cachedStats;
  if (!inflight) {
    inflight = fetch("/api/stats/venues")
      .then((r) => r.json())
      .then((data) => {
        cachedStats = data as VenueStats;
        return cachedStats;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Shared venue stats — avoids importing ~500KB ktvData on the client. */
export function useVenueStats() {
  const [stats, setStats] = useState<VenueStats | null>(cachedStats);

  useEffect(() => {
    if (cachedStats) return;
    let cancelled = false;
    fetchVenueStats().then((data) => {
      if (!cancelled) setStats(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
