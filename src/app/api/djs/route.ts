import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

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
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,bio.ilike.%${search}%,country.ilike.%${search}%`
      );
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
      return NextResponse.json({ djs: [] });
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

    return NextResponse.json({ djs }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error("Error in GET /api/djs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

