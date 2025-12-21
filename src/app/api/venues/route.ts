import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";

export const revalidate = 3600; // Revalidate every hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let filteredVenues = [...ktvData];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVenues = filteredVenues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchLower) ||
          venue.address?.toLowerCase().includes(searchLower) ||
          venue.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply country filter
    if (country) {
      filteredVenues = filteredVenues.filter(
        (venue) => venue.country === country
      );
    }

    // Apply category filter
    if (category) {
      filteredVenues = filteredVenues.filter(
        (venue) => venue.category === category
      );
    }

    const total = filteredVenues.length;

    // Apply pagination
    const paginatedVenues = filteredVenues.slice(offset, offset + limit);

    return NextResponse.json(
      {
        venues: paginatedVenues,
        total,
        limit,
        offset,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/venues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

