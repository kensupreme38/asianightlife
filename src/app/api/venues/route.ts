import { NextResponse } from "next/server";
import { ktvData } from "@/lib/data";
import { isVenueStaticFallbackEnabled } from "@/lib/venue-static-fallback";
import { generateSlug } from "@/lib/slug-utils";
import { createVenuesReader } from "@/utils/supabase/venues-reader";

/** Always read fresh data from Supabase so admin edits appear immediately. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country");
    const category = searchParams.get("category");
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

      const { data: dbVenues, error, count } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

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
          slug: venue.slug || generateSlug(venue.name),
          mapEmbedUrl: venue.map_embed_url || undefined,
        }));
        total = count ?? dbVenues.length;
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("[GET /api/venues] Exception:", e);
      }
    }

    if (!fromDatabase && isVenueStaticFallbackEnabled() && process.env.NODE_ENV === "development") {
      console.warn(
        "[GET /api/venues] Using static data.ts. Add SUPABASE_SERVICE_ROLE_KEY to asianightlife .env (same key as admin), or run SQL: asia-admin/supabase/migrations/202604170003_venues_public_select_policy.sql"
      );
    }

    // Only use data.ts when DB failed and static fallback is allowed (no service role key)
    if (!fromDatabase && isVenueStaticFallbackEnabled()) {
      let staticVenues = [...ktvData];

      if (search) {
        const searchLower = search.toLowerCase();
        staticVenues = staticVenues.filter(
          (venue) =>
            venue.name.toLowerCase().includes(searchLower) ||
            venue.address?.toLowerCase().includes(searchLower) ||
            venue.description?.toLowerCase().includes(searchLower)
        );
      }

      if (country) {
        staticVenues = staticVenues.filter((venue) => venue.country === country);
      }

      if (category) {
        staticVenues = staticVenues.filter((venue) => venue.category === category);
      }

      total = staticVenues.length;
      filteredVenues = staticVenues.slice(offset, offset + limit).map((venue) => ({
        ...venue,
        id: String(venue.id),
        slug: generateSlug(venue.name),
      }));
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

