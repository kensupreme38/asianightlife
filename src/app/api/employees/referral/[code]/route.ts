import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const supabase = await createClient();
    const { code } = await params;

    const { data: employee, error } = await supabase
      .from("employee_profiles")
      .select("id, full_name, phone, email, referral_code")
      .eq("referral_code", code.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error("Error fetching employee by referral code:", error);
      return NextResponse.json(
        { error: "Failed to fetch employee" },
        { status: 500 }
      );
    }

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error in GET /api/employees/referral/[code]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

