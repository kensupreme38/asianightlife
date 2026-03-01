import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";
import { findVenueIdBySlug, generateSlug } from "@/lib/slug-utils";

export const revalidate = 3600; // Revalidate every hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Find venue by slug or ID (backward compatibility)
    const venueId = findVenueIdBySlug(slug, ktvData);
    
    if (!venueId) {
      return NextResponse.json(
        { error: "Invalid venue slug or ID" },
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

    // Add slug to response
    const venueWithSlug = {
      ...venue,
      slug: generateSlug(venue.name),
    };

    return NextResponse.json(venueWithSlug, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/venues/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
