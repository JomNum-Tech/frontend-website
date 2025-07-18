import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { RoleService } from "@/lib/roleService";
import { BulkRoleUpdateRequest } from "@/types/admin/roles";
import { RoleErrorCode, createRoleError, logRoleError } from "@/lib/errors/roleErrors";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      const error = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
        message: "Authentication required for role management"
      });
      logRoleError(error, "bulk-update-api");
      
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin access
    const hasAdminAccess = await RoleService.checkAdminAccess(userId);
    if (!hasAdminAccess) {
      const error = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
        userId,
        message: "Admin access required for bulk role updates"
      });
      logRoleError(error, "bulk-update-api");
      
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Parse request body
    let body: BulkRoleUpdateRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
        userId,
        message: "Invalid JSON in request body",
        originalError: parseError instanceof Error ? parseError : undefined
      });
      logRoleError(error, "bulk-update-api");
      
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body.userIds || !Array.isArray(body.userIds) || body.userIds.length === 0) {
      const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
        userId,
        message: "Missing or invalid userIds: must be a non-empty array"
      });
      logRoleError(error, "bulk-update-api");
      
      return NextResponse.json(
        { error: "Missing or invalid userIds: must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!body.newRole) {
      const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
        userId,
        message: "Missing required field: newRole"
      });
      logRoleError(error, "bulk-update-api");
      
      return NextResponse.json(
        { error: "Missing required field: newRole" },
        { status: 400 }
      );
    }

    // Validate the new role
    const roleValidation = RoleService.validateRole(body.newRole);
    if (!roleValidation.isValid) {
      const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
        userId,
        role: body.newRole,
        message: `Invalid role: ${roleValidation.errors?.join(', ')}`
      });
      logRoleError(error, "bulk-update-api");
      
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
    if (body.userIds.includes(userId) && body.newRole !== 'admin') {
      const currentRole = await RoleService.getUserRole(userId);
      if (currentRole === 'admin') {
        const error = createRoleError(RoleErrorCode.SELF_DEMOTION_PREVENTED, {
          userId,
          role: body.newRole,
          message: "Administrators cannot remove their own admin role"
        });
        logRoleError(error, "bulk-update-api");
        
        return NextResponse.json(
          { error: "Cannot remove your own admin role" },
          { status: 403 }
        );
      }
    }

    // Process bulk update
    const result = await RoleService.bulkUpdateUserRoles(body.userIds, body.newRole);

    // Log successful operation
    console.info(`Bulk role update completed by admin ${userId}: ${result.successful.length} successful, ${result.failed.length} failed`);
    
    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    const roleError = createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
      message: error instanceof Error ? error.message : "Unknown error during bulk role update",
      originalError: error instanceof Error ? error : undefined
    });
    
    logRoleError(roleError, "bulk-update-api");
    
    return NextResponse.json(
      { error: "Internal server error", details: roleError.message },
      { status: 500 }
    );
  }
}