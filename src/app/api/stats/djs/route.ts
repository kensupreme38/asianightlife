import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const supabase = await createClient();

    // Get total DJs count
    const { count: totalDJs } = await supabase
      .from("djs")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("status", "active");

    // Get total votes count
    const { count: totalVotes } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true });

    // Get top DJs by votes
    const { data: topDJs } = await supabase
      .from("dj_stats")
      .select("id, name, votes_count")
      .order("votes_count", { ascending: false })
      .limit(10);

    // Get DJs by country
    const { data: djsByCountry } = await supabase
      .from("djs")
      .select("country")
      .eq("is_active", true)
      .eq("status", "active");

    const countryStats: Record<string, number> = {};
    if (djsByCountry) {
      djsByCountry.forEach((dj) => {
        if (dj.country) {
          countryStats[dj.country] = (countryStats[dj.country] || 0) + 1;
        }
      });
    }

    return NextResponse.json(
      {
        total_djs: totalDJs || 0,
        total_votes: totalVotes || 0,
        top_djs: topDJs || [],
        country_stats: countryStats,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/stats/djs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

