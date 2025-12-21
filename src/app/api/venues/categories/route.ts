import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const categories = Array.from(
      new Set(ktvData.map((venue) => venue.category).filter(Boolean))
    ).sort();

    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/venues/categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

