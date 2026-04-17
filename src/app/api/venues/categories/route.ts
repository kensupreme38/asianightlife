import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";
import { isVenueStaticFallbackEnabled } from "@/lib/venue-static-fallback";
import { createVenuesReader } from "@/utils/supabase/venues-reader";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let categories: string[] = [];
    let fromDatabase = false;

    try {
      const supabase = await createVenuesReader();
      const { data, error } = await supabase
        .from("venues")
        .select("category")
        .eq("status", "active");

      if (!error && data != null) {
        fromDatabase = true;
        categories = Array.from(new Set(data.map((venue: any) => venue.category).filter(Boolean))).sort();
      }
    } catch {
      // Fall back to static data
    }

    if (!fromDatabase && isVenueStaticFallbackEnabled()) {
      categories = Array.from(new Set(ktvData.map((venue) => venue.category).filter(Boolean))).sort();
    }

    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
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

