import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { RoleService } from "@/lib/roleService";
import { RoleErrorCode, createRoleError, logRoleError } from "@/lib/errors/roleErrors";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      const error = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
        message: "Authentication required for role migration"
      });
      logRoleError(error, "migrate-api");
      
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin access
    const hasAdminAccess = await RoleService.checkAdminAccess(userId);
    if (!hasAdminAccess) {
      const error = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
        userId,
        message: "Admin access required for role migration"
      });
      logRoleError(error, "migrate-api");
      
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Run the migration to assign default roles to users without roles
    const result = await RoleService.migrateUsersToDefaultRoles();

    // Log successful operation
    console.info(`Role migration completed by admin ${userId}: ${result.successful.length} successful, ${result.failed.length} failed`);
    
    return NextResponse.json({
      success: true,
      result,
      message: `Migration completed. ${result.successful.length} users updated, ${result.failed.length} failed.`
    });

  } catch (error) {
    const roleError = createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
      message: error instanceof Error ? error.message : "Unknown error during role migration",
      originalError: error instanceof Error ? error : undefined
    });
    
    logRoleError(roleError, "migrate-api");
    
    return NextResponse.json(
      { error: "Internal server error", details: roleError.message },
      { status: 500 }
    );
  }
}