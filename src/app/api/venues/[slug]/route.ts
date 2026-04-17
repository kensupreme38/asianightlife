import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";
import { isVenueStaticFallbackEnabled } from "@/lib/venue-static-fallback";
import { findVenueIdBySlug, generateSlug } from "@/lib/slug-utils";
import { createVenuesReader } from "@/utils/supabase/venues-reader";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let venueWithSlug: any = null;
    let dbError: unknown = null;

    try {
      const supabase = await createVenuesReader();
      const query = supabase.from("venues").select("*").eq("status", "active");

      let dbResult = await query.eq("slug", slug).maybeSingle();
      if (dbResult.error) {
        dbError = dbResult.error;
      } else if (!dbResult.data) {
        dbResult = await supabase.from("venues").select("*").eq("id", slug).eq("status", "active").maybeSingle();
        if (dbResult.error) {
          dbError = dbResult.error;
        }
      }

      if (!dbError && dbResult.data) {
        venueWithSlug = {
          ...dbResult.data,
          id: String(dbResult.data.id),
          slug: dbResult.data.slug || generateSlug(dbResult.data.name),
          mapEmbedUrl: dbResult.data.map_embed_url || undefined,
        };
      }
    } catch (err) {
      dbError = err;
    }

    if (!venueWithSlug && dbError) {
      return NextResponse.json(
        { error: "Venue data is temporarily unavailable" },
        { status: 503 }
      );
    }

    if (!venueWithSlug && isVenueStaticFallbackEnabled()) {
      const venueId = findVenueIdBySlug(slug, ktvData);
      if (!venueId) {
        return NextResponse.json({ error: "Venue not found" }, { status: 404 });
      }
      const venue = ktvData.find((v) => v.id === venueId);
      if (!venue) {
        return NextResponse.json({ error: "Venue not found" }, { status: 404 });
      }
      venueWithSlug = {
        ...venue,
        id: String(venue.id),
        slug: generateSlug(venue.name),
      };
    }

    if (!venueWithSlug) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json(venueWithSlug, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
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
