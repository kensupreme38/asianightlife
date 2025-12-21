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

    // Query employee profile for current user
    const { data: employee, error } = await supabase
      .from("employee_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") {
        // No profile found
        return NextResponse.json({ employee: null });
      }
      console.error("Error fetching employee profile:", error);
      return NextResponse.json(
        { error: "Failed to fetch employee profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error in GET /api/employees/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

