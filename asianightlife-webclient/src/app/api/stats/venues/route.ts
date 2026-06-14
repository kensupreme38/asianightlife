import { NextResponse } from "next/server";
import { CITIES, matchesCity } from "@/lib/cities";
import { fetchActiveVenues } from "@/lib/venues-db";

export const revalidate = 3600;

type VenueRow = { country?: string | null; category?: string | null; address?: string | null };

function computeCityStats(venues: VenueRow[]) {
  const cityStats: Record<string, number> = {};
  for (const city of CITIES) {
    cityStats[city.slug] = venues.filter(
      (venue) =>
        (venue.country || "").toLowerCase() === city.country.toLowerCase() &&
        matchesCity(venue.address || "", city.filterKey)
    ).length;
  }
  return cityStats;
}

function aggregateStats(venues: VenueRow[]) {
  const countryStats: Record<string, number> = {};
  const categoryStats: Record<string, number> = {};
  for (const venue of venues) {
    if (venue.country) {
      countryStats[venue.country] = (countryStats[venue.country] || 0) + 1;
    }
    if (venue.category) {
      categoryStats[venue.category] = (categoryStats[venue.category] || 0) + 1;
    }
  }
  return {
    total_venues: venues.length,
    country_stats: countryStats,
    category_stats: categoryStats,
    city_stats: computeCityStats(venues),
  };
}

export async function GET() {
  try {
    let venues: VenueRow[] = [];
    const { venues: dbVenues, fromDatabase } = await fetchActiveVenues("country, category, address");
    if (fromDatabase) {
      venues = dbVenues;
    } else if (process.env.NODE_ENV === "development") {
      console.warn("[GET /api/stats/venues] Database unavailable — returning empty stats.");
    }

    const stats = aggregateStats(venues);

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/stats/venues:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}