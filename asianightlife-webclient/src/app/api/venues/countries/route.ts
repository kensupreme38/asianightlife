import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";
import { isVenueStaticFallbackEnabled } from "@/lib/venue-static-fallback";
import { createVenuesReader } from "@/utils/supabase/venues-reader";

export const dynamic = "force-dynamic";

const isNonEmptyString = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.length > 0;

export async function GET() {
  try {
    let countries: string[] = [];
    let fromDatabase = false;

    try {
      const supabase = await createVenuesReader();
      const { data, error } = await supabase
        .from("venues")
        .select("country")
        .eq("status", "active");

      if (!error && data != null) {
        fromDatabase = true;
        countries = Array.from(
          new Set(data.map((venue: any) => venue.country).filter(isNonEmptyString))
        ).sort();
      }
    } catch {
      // Fall back to static data
    }

    if (!fromDatabase && isVenueStaticFallbackEnabled()) {
      countries = Array.from(
        new Set(ktvData.map((venue) => venue.country).filter(isNonEmptyString))
      ).sort();
    }

    return NextResponse.json(
      { countries },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/venues/countries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

