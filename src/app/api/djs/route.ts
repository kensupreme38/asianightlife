import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country");
    const genre = searchParams.get("genre");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Query DJs from database - filter only active DJs
    let query = supabase
      .from("djs")
      .select(`
        id,
        name,
        image_url,
        bio,
        genres,
        country,
        created_at,
        is_active,
        status
      `)
      .eq("is_active", true)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,bio.ilike.%${search}%,country.ilike.%${search}%`
      );
    }

    if (country) {
      query = query.eq("country", country);
    }

    if (genre) {
      query = query.contains("genres", [genre]);
    }

    const { data: djData, error: djError } = await query;

    if (djError) {
      console.error("Error fetching DJs:", djError);
      return NextResponse.json(
        { error: "Failed to fetch DJs" },
        { status: 500 }
      );
    }

    if (!djData || djData.length === 0) {
      return NextResponse.json({ djs: [], total: 0 });
    }

    // Get all DJ IDs
    const djIds = djData.map((dj: any) => dj.id);

    // Get votes count for all DJs in a single query using aggregation
    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("dj_id")
      .in("dj_id", djIds);

    if (votesError) {
      console.error("Error fetching votes:", votesError);
    }

    // Count votes per DJ
    const votesCountMap = new Map<number, number>();
    if (votesData) {
      votesData.forEach((vote: any) => {
        const count = votesCountMap.get(vote.dj_id) || 0;
        votesCountMap.set(vote.dj_id, count + 1);
      });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from("djs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("status", "active");

    if (search) {
      countQuery = countQuery.or(
        `name.ilike.%${search}%,bio.ilike.%${search}%,country.ilike.%${search}%`
      );
    }

    if (country) {
      countQuery = countQuery.eq("country", country);
    }

    if (genre) {
      countQuery = countQuery.contains("genres", [genre]);
    }

    const { count: total } = await countQuery;

    // Map DJs with their vote counts
    const djs = djData.map((dj: any) => ({
      id: dj.id.toString(), // Convert to string for frontend
      name: dj.name,
      image_url: dj.image_url,
      bio: dj.bio,
      genres: dj.genres || [],
      country: dj.country,
      created_at: dj.created_at,
      votes_count: votesCountMap.get(dj.id) || 0,
    }));

    return NextResponse.json(
      { djs, total: total || 0, limit, offset },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/djs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, image_url, bio, genres, country } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if user already has a DJ profile
    const { data: existingDJ } = await supabase
      .from("djs")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingDJ) {
      return NextResponse.json(
        { error: "You already have a DJ profile" },
        { status: 400 }
      );
    }

    // Create DJ profile
    const { data: dj, error: djError } = await supabase
      .from("djs")
      .insert({
        user_id: user.id,
        name: name.trim(),
        image_url: image_url || null,
        bio: bio || null,
        genres: genres || [],
        country: country || null,
        status: "active",
        is_active: true,
      })
      .select()
      .single();

    if (djError) {
      console.error("Error creating DJ profile:", djError);
      return NextResponse.json(
        { error: "Failed to create DJ profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ...dj,
        id: dj.id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/djs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
