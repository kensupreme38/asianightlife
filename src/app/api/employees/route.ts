import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const email = searchParams.get("email");
    const referral_code = searchParams.get("referral_code");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("employee_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    if (email) {
      query = query.eq("email", email);
    }

    if (referral_code) {
      query = query.eq("referral_code", referral_code.toUpperCase());
    }

    const { data: employees, error } = await query;

    if (error) {
      console.error("Error fetching employees:", error);
      return NextResponse.json(
        { error: "Failed to fetch employees" },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from("employee_profiles")
      .select("*", { count: "exact", head: true });

    if (search) {
      countQuery = countQuery.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    if (email) {
      countQuery = countQuery.eq("email", email);
    }

    if (referral_code) {
      countQuery = countQuery.eq("referral_code", referral_code.toUpperCase());
    }

    const { count: total } = await countQuery;

    return NextResponse.json({
      employees: employees || [],
      total: total || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error in GET /api/employees:", error);
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
    const {
      email,
      full_name,
      phone,
      date_of_birth,
      gender,
      address,
      avatar,
      referral_code,
      position,
      department,
      hire_date,
    } = body;

    if (!email || !full_name) {
      return NextResponse.json(
        { error: "Email and full name are required" },
        { status: 400 }
      );
    }

    // Check if employee profile already exists
    const { data: existingEmployee } = await supabase
      .from("employee_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee profile with this email already exists" },
        { status: 400 }
      );
    }

    // Create employee profile
    const { data: employee, error: employeeError } = await supabase
      .from("employee_profiles")
      .insert({
        user_id: user.id,
        email,
        full_name: full_name.trim(),
        phone: phone || null,
        date_of_birth: date_of_birth || null,
        gender: gender || null,
        address: address || null,
        avatar: avatar || null,
        referral_code: referral_code || null,
        position: position || null,
        department: department || null,
        hire_date: hire_date || null,
      })
      .select()
      .single();

    if (employeeError) {
      console.error("Error creating employee profile:", employeeError);
      return NextResponse.json(
        { error: "Failed to create employee profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

