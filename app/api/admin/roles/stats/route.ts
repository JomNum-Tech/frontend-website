import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { RoleService } from "@/lib/roleService";
import { RoleErrorCode, createRoleError, logRoleError } from "@/lib/errors/roleErrors";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      const error = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
        message: "Authentication required for role statistics"
      });
      logRoleError(error, "stats-api");
      
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin access
    const hasAdminAccess = await RoleService.checkAdminAccess(userId);
    if (!hasAdminAccess) {
      const error = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
        userId,
        message: "Admin access required for role statistics"
      });
      logRoleError(error, "stats-api");
      
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get role statistics
    const stats = await RoleService.getRoleStats();

    // Add additional metadata
    const response = {
      stats,
      timestamp: new Date().toISOString(),
      validRoles: RoleService.getValidRoles(),
      defaultRole: RoleService.getDefaultRole(),
    };

    return NextResponse.json(response);
  } catch (error) {
    const roleError = createRoleError(RoleErrorCode.ROLE_FETCH_FAILED, {
      message: error instanceof Error ? error.message : "Unknown error fetching role statistics",
      originalError: error instanceof Error ? error : undefined
    });
    
    logRoleError(roleError, "stats-api");
    
    return NextResponse.json(
      { error: "Internal server error", details: roleError.message },
      { status: 500 }
    );
  }
}