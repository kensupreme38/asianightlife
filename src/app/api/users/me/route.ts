import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
    });
  } catch (error) {
    console.error("Error in GET /api/users/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const { email, password, user_metadata } = body;

    const updateData: any = {};

    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = password;
    if (user_metadata !== undefined) updateData.data = user_metadata;

    // Update user - using updateUser instead of admin API
    const { data: updatedUser, error: updateError } = await supabase.auth.updateUser(
      updateData
    );

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    if (!updatedUser.user) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: updatedUser.user.id,
      email: updatedUser.user.email,
      user_metadata: updatedUser.user.user_metadata,
    });
  } catch (error) {
    console.error("Error in PUT /api/users/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

