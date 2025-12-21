import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";

export const revalidate = 3600; // Revalidate every hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const venueId = parseInt(id, 10);

    if (isNaN(venueId)) {
      return NextResponse.json(
        { error: "Invalid venue ID" },
        { status: 400 }
      );
    }

    const venue = ktvData.find((v) => v.id === venueId);

    if (!venue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(venue, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/venues/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

