import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Get total venues count
    const totalVenues = ktvData.length;

    // Get venues by country
    const countryStats: Record<string, number> = {};
    ktvData.forEach((venue) => {
      if (venue.country) {
        countryStats[venue.country] = (countryStats[venue.country] || 0) + 1;
      }
    });

    // Get venues by category
    const categoryStats: Record<string, number> = {};
    ktvData.forEach((venue) => {
      if (venue.category) {
        categoryStats[venue.category] = (categoryStats[venue.category] || 0) + 1;
      }
    });

    return NextResponse.json(
      {
        total_venues: totalVenues,
        country_stats: countryStats,
        category_stats: categoryStats,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/stats/venues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

