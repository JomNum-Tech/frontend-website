import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { RoleService } from "@/lib/roleService";
import { UserRole, RoleUpdateRequest } from "@/types/admin/roles";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin access
    const hasAdminAccess = await RoleService.checkAdminAccess(userId);
    if (!hasAdminAccess) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;
    const orderBy = searchParams.get("orderBy") || "created_at";
    const order = searchParams.get("order") || "desc";
    const roleFilter = searchParams.get("role") as UserRole | null;

    // Validate role filter if provided
    if (roleFilter && !RoleService.isValidRole(roleFilter)) {
      return NextResponse.json(
        { error: `Invalid role filter. Valid roles: ${RoleService.getValidRoles().join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Fetch users from Clerk
    const client = await clerkClient();

    // Build the orderBy parameter for Clerk API with proper typing
    let clerkOrderBy: 
      | "+created_at" | "-created_at" 
      | "+email_address" | "-email_address" 
      | "+last_sign_in_at" | "-last_sign_in_at";
      
    if (orderBy === "email_address") {
      clerkOrderBy = order === "asc" ? "+email_address" : "-email_address";
    } else if (orderBy === "last_sign_in_at") {
      clerkOrderBy = order === "asc" ? "+last_sign_in_at" : "-last_sign_in_at";
    } else {
      // Default to created_at
      clerkOrderBy = order === "asc" ? "+created_at" : "-created_at";
    }

    // For role filtering, we need to fetch more users and filter client-side
    // since Clerk doesn't support metadata filtering directly
    let fetchLimit = limit;
    let fetchOffset = offset;
    
    // If role filtering is applied, fetch more users to account for filtering
    if (roleFilter) {
      fetchLimit = Math.max(limit * 3, 50); // Fetch 3x more to account for filtering
      fetchOffset = 0; // Start from beginning when filtering
    }

    const response = await client.users.getUserList({
      limit: fetchLimit,
      offset: fetchOffset,
      query: search,
      orderBy: clerkOrderBy,
    });

    // Map users and add role information
    const usersWithRoles = await Promise.all(
      response.data.map(async (user) => {
        const role = await RoleService.getUserRole(user.id);
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddresses: user.emailAddresses,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          lastSignInAt: user.lastSignInAt,
          banned: user.banned,
          locked: user.locked,
          role,
        };
      })
    );

    // Apply role filtering if specified
    let filteredUsers = usersWithRoles;
    if (roleFilter) {
      filteredUsers = usersWithRoles.filter(user => user.role === roleFilter);
    }

    // Apply pagination to filtered results if role filtering was used
    let paginatedUsers = filteredUsers;
    let totalCount = response.totalCount;
    
    if (roleFilter) {
      const startIndex = (page - 1) * limit;
      paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
      totalCount = filteredUsers.length;
    }

    return NextResponse.json({
      users: paginatedUsers,
      totalCount,
      hasMore: roleFilter ? 
        (page * limit < filteredUsers.length) : 
        (response.data.length === fetchLimit),
      roleFilter: roleFilter || null,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin access
    const hasAdminAccess = await RoleService.checkAdminAccess(userId);
    if (!hasAdminAccess) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Parse request body
    let body: RoleUpdateRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body.userId || !body.newRole) {
      return NextResponse.json(
        { error: "Missing required fields: userId and newRole" },
        { status: 400 }
      );
    }

    // Validate the new role
    const roleValidation = RoleService.validateRole(body.newRole);
    if (!roleValidation.isValid) {
      return NextResponse.json(
        { 
          error: "Invalid role", 
          details: roleValidation.errors,
          validRoles: RoleService.getValidRoles()
        },
        { status: 400 }
      );
    }

    // Prevent users from removing their own admin role
    if (body.userId === userId && body.newRole !== 'admin') {
      const currentRole = await RoleService.getUserRole(userId);
      if (currentRole === 'admin') {
        return NextResponse.json(
          { error: "Cannot remove your own admin role" },
          { status: 403 }
        );
      }
    }

    // Verify target user exists
    try {
      const client = await clerkClient();
      await client.users.getUser(body.userId);
    } catch {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update the user's role
    const updateResult = await RoleService.updateUserRole(body.userId, body.newRole);

    if (!updateResult.success) {
      return NextResponse.json(
        { 
          error: "Failed to update user role",
          details: updateResult.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: body.userId,
      newRole: body.newRole,
      message: updateResult.message
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
