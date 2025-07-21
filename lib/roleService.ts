import { clerkClient } from '@clerk/nextjs/server';
import { UserRole, RoleStats, RoleUpdateResponse, RoleValidation, BulkRoleUpdateResponse } from '@/types/admin/roles';
import { RoleErrorCode, createRoleError, logRoleError } from '@/lib/errors/roleErrors';
import { withRetry } from '@/lib/errors/retryUtils';

/**
 * Service class for managing user roles using Clerk's metadata system
 * Handles role assignment, validation, and statistics
 */
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function assignRoleToUser(userId: string, classTermId: string, role: string) {
  await sql`
    INSERT INTO user_roles (user_id, class_term_id, role, assigned_at)
    VALUES (${userId}, ${classTermId}, ${role}, NOW())
    ON CONFLICT (user_id, class_term_id, role) DO NOTHING
  `;
}

export class RoleService {
  private static readonly DEFAULT_ROLE: UserRole = 'normal';
  private static readonly VALID_ROLES: UserRole[] = ['admin', 'student', 'normal'];

  /**
   * Synchronously get role display information (safe for client-side use)
   * @param role - The role to get info for
   * @returns { displayName: string, colorClass: string } - Display information for the role
   */
  static getRoleDisplayInfo(role: UserRole | undefined): { displayName: string, colorClass: string } {
    const validatedRole = this.validateRole(role || this.DEFAULT_ROLE).role;
    
    const displayNames: Record<UserRole, string> = {
      admin: 'Administrator',
      student: 'Student',
      normal: 'Normal User'
    };

    const colorClasses: Record<UserRole, string> = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      student: 'bg-blue-100 text-blue-700 border-blue-200',
      normal: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return {
      displayName: displayNames[validatedRole],
      colorClass: colorClasses[validatedRole]
    };
  }

  /**
   * Get a user's role from their Clerk metadata
   * @param userId - The Clerk user ID
   * @returns Promise<UserRole> - The user's role, defaults to 'normal' if not set
   */
  static async getUserRole(userId: string): Promise<UserRole> {
    try {
      if (!userId) {
        const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
          message: 'User ID is required to fetch role'
        });
        logRoleError(error, 'getUserRole');
        return this.DEFAULT_ROLE;
      }

      // Use retry utility for Clerk API calls
      return await withRetry(async () => {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const role = user.publicMetadata?.role as UserRole;
        
        // Validate the role and return default if invalid
        if (!role || !this.VALID_ROLES.includes(role)) {
          return this.DEFAULT_ROLE;
        }

        return role;
      }, {
        maxRetries: 3,
        onRetry: (error, attempt) => {
          logRoleError(
            createRoleError(RoleErrorCode.ROLE_FETCH_FAILED, {
              userId,
              message: `Retry attempt ${attempt} for getUserRole`,
              originalError: error instanceof Error ? error : undefined
            }),
            'getUserRole retry'
          );
        }
      });
    } catch (error) {
      // Log the error with our enhanced error logging
      const roleError = createRoleError(RoleErrorCode.ROLE_FETCH_FAILED, {
        userId,
        message: error instanceof Error ? error.message : 'Unknown error fetching user role',
        originalError: error instanceof Error ? error : undefined
      });
      
      logRoleError(roleError, 'getUserRole');
      
      // Return default role on error for security (fail-safe)
      return this.DEFAULT_ROLE;
    }
  }

  /**
   * Update a user's role in their Clerk metadata
   * @param userId - The Clerk user ID
   * @param newRole - The new role to assign
   * @returns Promise<RoleUpdateResponse> - Response indicating success/failure
   */
  static async updateUserRole(userId: string, newRole: UserRole): Promise<RoleUpdateResponse> {
    try {
      if (!userId) {
        const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
          message: 'User ID is required for role update'
        });
        logRoleError(error, 'updateUserRole');
        
        return {
          success: false,
          userId: '',
          newRole,
          message: error.message
        };
      }

      // Validate the new role
      const validation = this.validateRole(newRole);
      if (!validation.isValid) {
        const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
          userId,
          role: newRole,
          message: `Invalid role: ${validation.errors?.join(', ')}`
        });
        logRoleError(error, 'updateUserRole');
        
        return {
          success: false,
          userId,
          newRole,
          message: error.message
        };
      }

      // Update the user's metadata with retry logic
      return await withRetry(async () => {
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            role: newRole
          }
        });

        // Log successful role update
        console.info(`Role updated successfully: User ${userId} is now ${newRole}`);
        
        return {
          success: true,
          userId,
          newRole,
          message: `Role updated successfully to ${newRole}`
        };
      }, {
        maxRetries: 3,
        onRetry: (error, attempt) => {
          logRoleError(
            createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
              userId,
              role: newRole,
              message: `Retry attempt ${attempt} for updateUserRole`,
              originalError: error instanceof Error ? error : undefined
            }),
            'updateUserRole retry'
          );
        }
      });
    } catch (error) {
      // Create and log a role error
      const roleError = createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
        userId,
        role: newRole,
        message: error instanceof Error ? error.message : 'Failed to update role',
        originalError: error instanceof Error ? error : undefined
      });
      
      logRoleError(roleError, 'updateUserRole');
      
      return {
        success: false,
        userId,
        newRole,
        message: roleError.message
      };
    }
  }

  /**
   * Check if a user has admin access
   * @param userId - The Clerk user ID
   * @returns Promise<boolean> - True if user has admin role
   */
  static async checkAdminAccess(userId: string): Promise<boolean> {
    try {
      if (!userId) {
        const error = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
          message: 'User ID is required to check admin access'
        });
        logRoleError(error, 'checkAdminAccess');
        return false;
      }
      
      // Use retry utility for role checks
      return await withRetry(async () => {
        const role = await this.getUserRole(userId);
        return role === 'admin';
      }, {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          logRoleError(
            createRoleError(RoleErrorCode.PERMISSION_DENIED, {
              userId,
              message: `Retry attempt ${attempt} for checkAdminAccess`,
              originalError: error instanceof Error ? error : undefined
            }),
            'checkAdminAccess retry'
          );
        }
      });
    } catch (error) {
      const roleError = createRoleError(RoleErrorCode.PERMISSION_DENIED, {
        userId,
        message: error instanceof Error ? error.message : 'Failed to check admin access',
        originalError: error instanceof Error ? error : undefined
      });
      
      logRoleError(roleError, 'checkAdminAccess');
      
      // Return false on error for security
      return false;
    }
  }

  /**
   * Get role distribution statistics across all users
   * @returns Promise<RoleStats> - Statistics for each role type
   */
  static async getRoleStats(): Promise<RoleStats> {
    try {
      // Initialize stats
      const stats: RoleStats = {
        admin: 0,
        student: 0,
        normal: 0,
        total: 0
      };

      // Use retry utility for fetching statistics
      return await withRetry(async () => {
        // Reset stats for each retry attempt
        const retryStats: RoleStats = {
          admin: 0,
          student: 0,
          normal: 0,
          total: 0
        };
        
        // Fetch all users with pagination
        let hasMore = true;
        let offset = 0;
        const limit = 100; // Process in batches
        const client = await clerkClient();

        while (hasMore) {
          const response = await client.users.getUserList({
            limit,
            offset
          });

          // Count roles in this batch
          response.data.forEach(user => {
            const role = (user.publicMetadata?.role as UserRole) || this.DEFAULT_ROLE;
            
            if (this.VALID_ROLES.includes(role)) {
              retryStats[role]++;
            } else {
              // Count invalid/missing roles as normal
              retryStats.normal++;
            }
            retryStats.total++;
          });

          // Check if there are more users
          hasMore = response.data.length === limit;
          offset += limit;
        }

        return retryStats;
      }, {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          logRoleError(
            createRoleError(RoleErrorCode.ROLE_FETCH_FAILED, {
              message: `Retry attempt ${attempt} for getRoleStats`,
              originalError: error instanceof Error ? error : undefined
            }),
            'getRoleStats retry'
          );
        }
      });
    } catch (error) {
      const roleError = createRoleError(RoleErrorCode.ROLE_FETCH_FAILED, {
        message: error instanceof Error ? error.message : 'Failed to fetch role statistics',
        originalError: error instanceof Error ? error : undefined
      });
      
      logRoleError(roleError, 'getRoleStats');
      
      // Return empty stats on error
      return {
        admin: 0,
        student: 0,
        normal: 0,
        total: 0
      };
    }
  }

  /**
   * Validate a role value
   * @param role - The role to validate
   * @returns RoleValidation - Validation result with errors if any
   */
  static validateRole(role: UserRole): RoleValidation {
    const errors: string[] = [];

    if (!role) {
      errors.push('Role is required');
    } else if (typeof role !== 'string') {
      errors.push('Role must be a string');
    } else if (!this.VALID_ROLES.includes(role as UserRole)) {
      errors.push(`Role must be one of: ${this.VALID_ROLES.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      role: role as UserRole || this.DEFAULT_ROLE,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Get all valid role options
   * @returns UserRole[] - Array of valid role values
   */
  static getValidRoles(): UserRole[] {
    return [...this.VALID_ROLES];
  }

  /**
   * Get the default role for new users
   * @returns UserRole - The default role
   */
  static getDefaultRole(): UserRole {
    return this.DEFAULT_ROLE;
  }

  /**
   * Check if a role is valid
   * @param role - The role to check
   * @returns boolean - True if the role is valid
   */
  static isValidRole(role: UserRole): role is UserRole {
    return typeof role === 'string' && this.VALID_ROLES.includes(role as UserRole);
  }

  /**
   * Update roles for multiple users in bulk
   * @param userIds - Array of user IDs to update
   * @param newRole - The new role to assign to all users
   * @returns Promise<BulkRoleUpdateResponse> - Results of the bulk update operation
   */
  static async bulkUpdateUserRoles(userIds: string[], newRole: UserRole): Promise<BulkRoleUpdateResponse> {
    try {
      const result: BulkRoleUpdateResponse = {
        successful: [],
        failed: [],
        totalProcessed: 0
      };

      // Input validation
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
          message: 'User IDs array is required and cannot be empty'
        });
        logRoleError(error, 'bulkUpdateUserRoles');
        
        return {
          successful: [],
          failed: [{
            userId: 'validation',
            error: error.message
          }],
          totalProcessed: 0
        };
      }

      // Validate the role first
      const validation = this.validateRole(newRole);
      if (!validation.isValid) {
        // If role is invalid, fail all updates
        const error = createRoleError(RoleErrorCode.INVALID_ROLE, {
          role: newRole,
          message: `Invalid role: ${validation.errors?.join(', ')}`
        });
        logRoleError(error, 'bulkUpdateUserRoles');
        
        result.failed = userIds.map(userId => ({
          userId,
          error: error.message
        }));
        result.totalProcessed = userIds.length;
        return result;
      }

      // Process users in batches to avoid overwhelming the Clerk API
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        
        // Process each user in the batch concurrently
        const updatePromises = batch.map(async (userId) => {
          try {
            const updateResult = await this.updateUserRole(userId, newRole);
            result.totalProcessed++;
            
            if (updateResult.success) {
              result.successful.push(userId);
              console.info(`Bulk update: Successfully updated user ${userId} to role ${newRole}`);
            } else {
              result.failed.push({
                userId,
                error: updateResult.message || 'Unknown error'
              });
              
              logRoleError(
                createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
                  userId,
                  role: newRole,
                  message: updateResult.message || 'Failed in bulk update operation'
                }),
                'bulkUpdateUserRoles - individual failure'
              );
            }
          } catch (error) {
            result.totalProcessed++;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            result.failed.push({
              userId,
              error: errorMessage
            });
            
            logRoleError(
              createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
                userId,
                role: newRole,
                message: errorMessage,
                originalError: error instanceof Error ? error : undefined
              }),
              'bulkUpdateUserRoles - individual exception'
            );
          }
        });
        
        // Wait for all updates in this batch to complete
        await Promise.all(updatePromises);
      }

      // Log summary of bulk operation
      console.info(`Bulk role update completed: ${result.successful.length} successful, ${result.failed.length} failed out of ${result.totalProcessed} total`);
      
      return result;
    } catch (error) {
      // Handle unexpected errors in the bulk update process
      const roleError = createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
        role: newRole,
        message: error instanceof Error ? error.message : 'Failed to perform bulk role update',
        originalError: error instanceof Error ? error : undefined
      });
      
      logRoleError(roleError, 'bulkUpdateUserRoles - critical failure');
      
      return {
        successful: [],
        failed: [{
          userId: 'bulk-operation',
          error: roleError.message
        }],
        totalProcessed: 0
      };
    }
  }

  /**
   * Assign default roles to users without roles
   * @returns Promise<BulkRoleUpdateResponse> - Results of the migration operation
   */
  static async migrateUsersToDefaultRoles(): Promise<BulkRoleUpdateResponse> {
    try {
      // Initialize result object
      const result: BulkRoleUpdateResponse = {
        successful: [],
        failed: [],
        totalProcessed: 0
      };

      // Use retry utility for the migration operation
      return await withRetry(async () => {
        // Reset for each retry attempt
        const usersWithoutRoles: string[] = [];
        
        // Fetch all users with pagination
        let hasMore = true;
        let offset = 0;
        const limit = 100; // Process in batches
        const client = await clerkClient();

        while (hasMore) {
          const response = await client.users.getUserList({
            limit,
            offset
          });

          // Find users without roles
          response.data.forEach(user => {
            const role = user.publicMetadata?.role as UserRole | undefined;
            
            if (!role || !this.VALID_ROLES.includes(role)) {
              usersWithoutRoles.push(user.id);
            }
          });

          // Check if there are more users
          hasMore = response.data.length === limit;
          offset += limit;
        }

        // Log the number of users found without roles
        console.info(`Found ${usersWithoutRoles.length} users without valid roles`);

        // If there are users without roles, assign the default role
        if (usersWithoutRoles.length > 0) {
          return await this.bulkUpdateUserRoles(usersWithoutRoles, this.DEFAULT_ROLE);
        }

        return result;
      }, {
        maxRetries: 2,
        onRetry: (error, attempt) => {
          logRoleError(
            createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
              message: `Retry attempt ${attempt} for migrateUsersToDefaultRoles`,
              originalError: error instanceof Error ? error : undefined
            }),
            'migrateUsersToDefaultRoles retry'
          );
        }
      });
    } catch (error) {
      // Create and log a role error
      const roleError = createRoleError(RoleErrorCode.ROLE_UPDATE_FAILED, {
        message: error instanceof Error ? error.message : 'Failed to migrate users to default roles',
        originalError: error instanceof Error ? error : undefined
      });
      
      logRoleError(roleError, 'migrateUsersToDefaultRoles');
      
      return {
        successful: [],
        failed: [{
          userId: 'migration',
          error: roleError.message
        }],
        totalProcessed: 0
      };
    }
  }
}