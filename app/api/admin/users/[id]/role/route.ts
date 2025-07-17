import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { RoleService } from "@/lib/roleService";
import { UserRole } from "@/types/admin/roles";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin access
    const hasAdminAccess = await RoleService.checkAdminAccess(userId);
    if (!hasAdminAccess) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }
    
    const targetUserId = id;

    // Validate target user ID
    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Parse request body
    let body: { role: UserRole };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body.role) {
      return NextResponse.json(
        { error: "Role is required in request body" },
        { status: 400 }
      );
    }

    // Validate the new role
    const roleValidation = RoleService.validateRole(body.role);
    if (!roleValidation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid role",
          details: roleValidation.errors,
          validRoles: RoleService.getValidRoles(),
        },
        { status: 400 }
      );
    }

    // Prevent users from removing their own admin role
    if (targetUserId === userId && body.role !== "admin") {
      const currentRole = await RoleService.getUserRole(userId);
      if (currentRole === "admin") {
        return NextResponse.json(
          { error: "Cannot remove your own admin role" },
          { status: 403 }
        );
      }
    }

    // Verify target user exists
    try {
      const client = await clerkClient();
      await client.users.getUser(targetUserId);
    } catch {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's role
    const updateResult = await RoleService.updateUserRole(
      targetUserId,
      body.role
    );

    if (!updateResult.success) {
      return NextResponse.json(
        {
          error: "Failed to update user role",
          details: updateResult.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: targetUserId,
      newRole: body.role,
      message: updateResult.message,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}