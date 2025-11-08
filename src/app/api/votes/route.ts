import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
    const { dj_id } = body;

    if (!dj_id) {
      return NextResponse.json(
        { error: "dj_id is required" },
        { status: 400 }
      );
    }

    // Convert dj_id to integer
    const djId = typeof dj_id === "string" ? parseInt(dj_id, 10) : dj_id;
    if (isNaN(djId)) {
      return NextResponse.json(
        { error: "Invalid DJ ID" },
        { status: 400 }
      );
    }

    // Check if user has already voted for this DJ using function
    const { data: hasVoted } = await supabase.rpc("has_user_voted", {
      p_user_id: user.id,
      p_dj_id: djId,
    });

    if (hasVoted) {
      return NextResponse.json(
        { error: "You have already voted for this DJ" },
        { status: 400 }
      );
    }

    // Check if DJ exists and is active
    const { data: dj } = await supabase
      .from("djs")
      .select("id, is_active, status")
      .eq("id", djId)
      .single();

    if (!dj) {
      return NextResponse.json(
        { error: "DJ not found" },
        { status: 404 }
      );
    }

    if (!dj.is_active || dj.status !== "active") {
      return NextResponse.json(
        { error: "Cannot vote for inactive DJ" },
        { status: 400 }
      );
    }

    // Create vote
    const { data: vote, error: voteError } = await supabase
      .from("votes")
      .insert({
        user_id: user.id,
        dj_id: djId,
      })
      .select()
      .single();

    if (voteError) {
      console.error("Error creating vote:", voteError);
      return NextResponse.json(
        { error: "Failed to create vote" },
        { status: 500 }
      );
    }

    // Get updated votes count using function
    const { data: votesCount } = await supabase.rpc("get_dj_votes_count", {
      p_dj_id: djId,
    });

    return NextResponse.json({
      success: true,
      vote: {
        ...vote,
        id: vote.id.toString(),
        dj_id: vote.dj_id.toString(),
      },
      votes_count: votesCount || 0,
    });
  } catch (error) {
    console.error("Error in POST /api/votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ votes: [] });
    }

    const { searchParams } = new URL(request.url);
    const dj_id = searchParams.get("dj_id");

    let query = supabase
      .from("votes")
      .select("dj_id")
      .eq("user_id", user.id);

    if (dj_id) {
      query = query.eq("dj_id", dj_id);
    }

    const { data: votes, error } = await query;

    if (error) {
      console.error("Error fetching votes:", error);
      return NextResponse.json(
        { error: "Failed to fetch votes" },
        { status: 500 }
      );
    }

    const votedDJIds = (votes || []).map((v) => v.dj_id.toString());

    return NextResponse.json({ votes: votedDJIds });
  } catch (error) {
    console.error("Error in GET /api/votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

