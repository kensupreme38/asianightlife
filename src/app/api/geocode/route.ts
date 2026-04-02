import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = (searchParams.get("address") || "").trim();

    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("q", address);

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        // Nominatim usage policy requires a valid User-Agent.
        "User-Agent": "asianightlife/1.0",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
    }

    const data = (await res.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
    }>;

    const first = data?.[0];
    const lat = first?.lat !== undefined ? Number(first.lat) : null;
    const lon = first?.lon !== undefined ? Number(first.lon) : null;

    if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) {
      return NextResponse.json(
        { lat: null, lon: null, display_name: first?.display_name || null },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
          },
        }
      );
    }

    return NextResponse.json(
      { lat, lon, display_name: first?.display_name || null },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/geocode:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

