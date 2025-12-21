import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const djId = parseInt(id, 10);

    if (isNaN(djId)) {
      return NextResponse.json(
        { error: "Invalid DJ ID" },
        { status: 400 }
      );
    }

    // Try to use the view first (if it exists)
    let djStats: any = null;
    try {
      const { data, error: statsError } = await supabase
        .from("dj_stats")
        .select("*")
        .eq("id", djId)
        .maybeSingle();
      
      if (!statsError && data) {
        djStats = data;
      }
    } catch (error) {
      // View might not exist, continue with direct query
      console.log("View not available, using direct query");
    }

    if (djStats) {
      // Calculate rank from view data to ensure consistency
      // Get all DJs from view to calculate accurate rank
      const { data: allDJsStats } = await supabase
        .from("dj_stats")
        .select("id, votes_count, created_at")
        .order("votes_count", { ascending: false });

      // Calculate rank: count how many DJs have more votes (not equal)
      // DJs with equal votes share the same rank
      const currentVotes = djStats.votes_count || 0;
      const higherVotesCount = (allDJsStats || []).filter((djItem: any) => {
        const itemVotes = djItem.votes_count || 0;
        // Only count DJs with strictly more votes
        return itemVotes > currentVotes;
      }).length;
      const rank = higherVotesCount + 1;

      // Return data from view
      return NextResponse.json({
        id: djStats.id.toString(),
        name: djStats.name,
        image_url: djStats.image_url,
        bio: djStats.bio,
        genres: djStats.genres || [],
        country: djStats.country,
        created_at: djStats.created_at,
        user_id: djStats.user_id,
        votes_count: djStats.votes_count || 0,
        rank: rank,
      });
    }

    // Fallback to direct table query
    const { data: dj, error: djError } = await supabase
      .from("djs")
      .select(`
        id,
        name,
        image_url,
        bio,
        genres,
        country,
        created_at,
        user_id,
        is_active,
        status
      `)
      .eq("id", djId)
      .single();

    if (djError || !dj) {
      return NextResponse.json(
        { error: "DJ not found" },
        { status: 404 }
      );
    }

    // Get votes count
    const { count: votesCount } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("dj_id", djId);

    // Calculate rank based on votes
    // Get all active DJs with created_at
    const { data: allDJsWithData } = await supabase
      .from("djs")
      .select("id, created_at")
      .eq("is_active", true)
      .eq("status", "active");

    // Get vote counts for all DJs
    const allDJsWithVotes = await Promise.all(
      (allDJsWithData || []).map(async (djItem: any) => {
        const { count: djVotesCount } = await supabase
          .from("votes")
          .select("*", { count: "exact", head: true })
          .eq("dj_id", djItem.id);
        return {
          id: djItem.id,
          votes_count: djVotesCount || 0,
          created_at: djItem.created_at,
        };
      })
    );

    // Calculate rank: count how many DJs have more votes (not equal)
    // DJs with equal votes share the same rank
    const currentVotes = votesCount || 0;
    
    const higherVotesCount = allDJsWithVotes.filter((djItem) => {
      const itemVotes = djItem.votes_count || 0;
      // Only count DJs with strictly more votes
      return itemVotes > currentVotes;
    }).length;
    const rank = higherVotesCount + 1;

    return NextResponse.json({
      id: dj.id.toString(),
      name: dj.name,
      image_url: dj.image_url,
      bio: dj.bio,
      genres: dj.genres || [],
      country: dj.country,
      created_at: dj.created_at,
      user_id: dj.user_id,
      votes_count: votesCount || 0,
      rank: rank,
    });
  } catch (error) {
    console.error("Error in GET /api/djs/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const djId = parseInt(id, 10);

    if (isNaN(djId)) {
      return NextResponse.json(
        { error: "Invalid DJ ID" },
        { status: 400 }
      );
    }

    // Check if DJ exists and belongs to user
    const { data: dj, error: djError } = await supabase
      .from("djs")
      .select("id, user_id")
      .eq("id", djId)
      .single();

    if (djError || !dj) {
      return NextResponse.json(
        { error: "DJ not found" },
        { status: 404 }
      );
    }

    if (dj.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own DJ profile" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, image_url, bio, genres, country, status, is_active } = body;

    const updateData: any = {};

    if (name !== undefined) {
      if (name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (image_url !== undefined) updateData.image_url = image_url;
    if (bio !== undefined) updateData.bio = bio;
    if (genres !== undefined) updateData.genres = genres;
    if (country !== undefined) updateData.country = country;
    if (status !== undefined) {
      if (!["active", "inactive", "pending"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status. Must be 'active', 'inactive', or 'pending'" },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update DJ profile
    const { data: updatedDJ, error: updateError } = await supabase
      .from("djs")
      .update(updateData)
      .eq("id", djId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating DJ profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update DJ profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...updatedDJ,
      id: updatedDJ.id.toString(),
    });
  } catch (error) {
    console.error("Error in PUT /api/djs/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const djId = parseInt(id, 10);

    if (isNaN(djId)) {
      return NextResponse.json(
        { error: "Invalid DJ ID" },
        { status: 400 }
      );
    }

    // Check if DJ exists and belongs to user
    const { data: dj, error: djError } = await supabase
      .from("djs")
      .select("id, user_id")
      .eq("id", djId)
      .single();

    if (djError || !dj) {
      return NextResponse.json(
        { error: "DJ not found" },
        { status: 404 }
      );
    }

    if (dj.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own DJ profile" },
        { status: 403 }
      );
    }

    // Soft delete: set is_active to false and status to inactive
    const { error: updateError } = await supabase
      .from("djs")
      .update({
        is_active: false,
        status: "inactive",
      })
      .eq("id", djId);

    if (updateError) {
      console.error("Error deleting DJ profile:", updateError);
      return NextResponse.json(
        { error: "Failed to delete DJ profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "DJ profile deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/djs/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
