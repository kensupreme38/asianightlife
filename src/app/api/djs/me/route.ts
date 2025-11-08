import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
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

    // Query DJ profile for current user
    const { data: dj, error } = await supabase
      .from("djs")
      .select(`
        id,
        name,
        image_url,
        bio,
        genres,
        country,
        created_at,
        user_id
      `)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found
        return NextResponse.json({ dj: null });
      }
      console.error("Error fetching DJ profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch DJ profile" },
        { status: 500 }
      );
    }

    // Get votes count using function
    const { data: votesCount } = await supabase.rpc("get_dj_votes_count", {
      p_dj_id: dj.id,
    });

    return NextResponse.json({
      ...dj,
      id: dj.id.toString(), // Convert to string for frontend
      votes_count: votesCount || 0,
    });
  } catch (error) {
    console.error("Error in GET /api/djs/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

