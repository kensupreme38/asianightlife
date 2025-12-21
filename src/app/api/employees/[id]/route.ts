import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: employee, error } = await supabase
      .from("employee_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Error in GET /api/employees/[id]:", error);
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

    // Check if employee exists and belongs to user
    const { data: employee, error: employeeError } = await supabase
      .from("employee_profiles")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    if (employee.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own employee profile" },
        { status: 403 }
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

    const updateData: any = {};

    if (email !== undefined) updateData.email = email;
    if (full_name !== undefined) {
      if (full_name.trim().length === 0) {
        return NextResponse.json(
          { error: "Full name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.full_name = full_name.trim();
    }
    if (phone !== undefined) updateData.phone = phone;
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (referral_code !== undefined) updateData.referral_code = referral_code;
    if (position !== undefined) updateData.position = position;
    if (department !== undefined) updateData.department = department;
    if (hire_date !== undefined) updateData.hire_date = hire_date;

    // Update employee profile
    const { data: updatedEmployee, error: updateError } = await supabase
      .from("employee_profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating employee profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update employee profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Error in PUT /api/employees/[id]:", error);
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

    // Check if employee exists and belongs to user
    const { data: employee, error: employeeError } = await supabase
      .from("employee_profiles")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    if (employee.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own employee profile" },
        { status: 403 }
      );
    }

    // Delete employee profile
    const { error: deleteError } = await supabase
      .from("employee_profiles")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting employee profile:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete employee profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Employee profile deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/employees/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

