import { NextResponse } from "next/server";
import { matchesCity } from "@/lib/cities";
import { getVenueSlug } from "@/lib/slug-utils";
import { createVenuesReader } from "@/utils/supabase/venues-reader";

/** Always read fresh data from Supabase so admin edits appear immediately. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let filteredVenues: any[] = [];
    let total = 0;
    /** True when Supabase responded successfully (even with 0 rows). Do not use static ktvData in that case. */
    let fromDatabase = false;

    try {
      const supabase = await createVenuesReader();
      let query = supabase.from("venues").select("*", { count: "exact" }).eq("status", "active");

      if (search) {
        query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (country) {
        query = query.eq("country", country);
      }
      if (category) {
        query = query.eq("category", category);
      }

      const orderedQuery = query.order("created_at", { ascending: false });

      if (city) {
        // City filter runs on address patterns — fetch country set first, then paginate in memory.
        const { data: dbVenues, error } = await orderedQuery;

        if (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("[GET /api/venues] Supabase error:", error.message, error.code, error.details);
          }
        }

        if (!error && dbVenues != null) {
          fromDatabase = true;
          const cityFiltered = dbVenues.filter((venue) =>
            matchesCity(venue.address || "", city.toLowerCase())
          );
          total = cityFiltered.length;
          filteredVenues = cityFiltered.slice(offset, offset + limit).map((venue: any) => ({
            ...venue,
            id: String(venue.id),
            slug: getVenueSlug({ slug: venue.slug, name: venue.name }),
            mapEmbedUrl: venue.map_embed_url || undefined,
          }));
        }
      } else {
        const { data: dbVenues, error, count } = await orderedQuery.range(offset, offset + limit - 1);

        if (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("[GET /api/venues] Supabase error:", error.message, error.code, error.details);
          }
        }

        if (!error && dbVenues != null) {
          fromDatabase = true;
          filteredVenues = dbVenues.map((venue: any) => ({
            ...venue,
            id: String(venue.id),
            slug: getVenueSlug({ slug: venue.slug, name: venue.name }),
            mapEmbedUrl: venue.map_embed_url || undefined,
          }));
          total = count ?? dbVenues.length;
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[GET /api/venues] Exception:", e);
      }
    }

    if (!fromDatabase && process.env.NODE_ENV === "development") {
      console.warn(
        "[GET /api/venues] Database unavailable. Add SUPABASE_SERVICE_ROLE_KEY to asianightlife-webclient/.env (same key as admin), or run SQL: supabase/migrations/202604170003_venues_public_select_policy.sql"
      );
    }

    return NextResponse.json(
      {
        venues: filteredVenues,
        total,
        limit,
        offset,
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
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

