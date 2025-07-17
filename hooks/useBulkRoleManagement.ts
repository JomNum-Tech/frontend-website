"use client";

import { useState } from 'react';
import { UserRole, BulkRoleUpdateResponse } from '@/types/admin/roles';
import { toast } from './use-toast';
import { useRoleErrors, RoleErrorCategory } from './useRoleErrors';

interface UseBulkRoleManagementProps {
  onSuccess?: (result: BulkRoleUpdateResponse) => void;
}

export function useBulkRoleManagement({ onSuccess }: UseBulkRoleManagementProps = {}) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { handleRoleError } = useRoleErrors();

  /**
   * Update roles for multiple users in bulk
   * @param userIds - Array of user IDs to update
   * @param newRole - The new role to assign to all users
   * @returns Promise<BulkRoleUpdateResponse | null> - Results of the bulk update operation
   */
  const bulkUpdateRoles = async (
    userIds: string[], 
    newRole: UserRole
  ): Promise<BulkRoleUpdateResponse | null> => {
    // Input validation
    if (!userIds.length) {
      handleRoleError({
        category: RoleErrorCategory.VALIDATION,
        message: "Please select at least one user to update",
        role: newRole
      }, "bulkUpdateRoles");
      return null;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // Attempt the API call with automatic retry for network errors
      const response = await fetchWithRetry('/api/admin/roles/bulk-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          newRole,
        }),
      }, 2); // Retry up to 2 times

      const data = await response.json();
      
      if (!response.ok) {
        // Handle API error responses with proper categorization
        const category = response.status === 403 ? RoleErrorCategory.PERMISSION :
                        response.status === 400 ? RoleErrorCategory.VALIDATION :
                        response.status >= 500 ? RoleErrorCategory.SERVER :
                        RoleErrorCategory.NETWORK;
                        
        throw handleRoleError({
          category,
          message: data.error || 'Failed to update roles',
          role: newRole,
          statusCode: response.status,
          details: data.details
        }, "bulkUpdateRoles");
      }

      const result = data.result as BulkRoleUpdateResponse;

      // Show success toast with detailed information
      toast({
        title: "Bulk role update completed",
        description: `Successfully updated ${result.successful.length} users to ${newRole}${result.failed.length > 0 ? `. ${result.failed.length} failed.` : ''}`,
        variant: result.failed.length > 0 ? "default" : "default",
      });
      
      // Log detailed results for debugging
      if (result.failed.length > 0) {
        console.info("Bulk update partial failures:", result.failed);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      // If error wasn't already handled by handleRoleError
      if (!error || typeof error !== 'object' || !('category' in error)) {
        handleRoleError(error, "bulkUpdateRoles");
      }
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Fetch with automatic retry for transient errors
   * @param url - The URL to fetch
   * @param options - Fetch options
   * @param maxRetries - Maximum number of retries
   * @returns Promise<Response>
   */
  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    maxRetries: number = 1
  ): Promise<Response> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Add exponential backoff delay for retries
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          console.info(`Retry attempt ${attempt} for ${url}`);
        }
        
        return await fetch(url, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Only retry on network errors, not on HTTP errors
        if (!(error instanceof TypeError) || attempt >= maxRetries) {
          throw lastError;
        }
      }
    }
    
    // This should never be reached due to the throw in the catch block
    throw lastError || new Error('Failed to fetch after retries');
  };

  /**
   * Migrate users without roles to the default role
   * @returns Promise<BulkRoleUpdateResponse | null> - Results of the migration operation
   */
  const migrateUsersToDefaultRoles = async (): Promise<BulkRoleUpdateResponse | null> => {
    setIsMigrating(true);
    setError(null);
    
    try {
      // Use retry utility for migration operation
      const response = await fetchWithRetry('/api/admin/roles/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }, 2); // Retry up to 2 times

      const data = await response.json();
      
      if (!response.ok) {
        // Handle API error responses with proper categorization
        const category = response.status === 403 ? RoleErrorCategory.PERMISSION :
                        response.status === 400 ? RoleErrorCategory.VALIDATION :
                        response.status >= 500 ? RoleErrorCategory.SERVER :
                        RoleErrorCategory.NETWORK;
                        
        throw handleRoleError({
          category,
          message: data.error || 'Failed to migrate users',
          statusCode: response.status,
          details: data.details
        }, "migrateUsersToDefaultRoles");
      }

      const result = data.result as BulkRoleUpdateResponse;

      // Show success toast with detailed information
      toast({
        title: "Role migration completed",
        description: data.message || `Successfully migrated ${result.successful.length} users${result.failed.length > 0 ? `. ${result.failed.length} failed.` : ''}`,
        variant: result.failed.length > 0 ? "default" : "default",
      });
      
      // Log detailed results for debugging
      if (result.failed.length > 0) {
        console.info("Migration partial failures:", result.failed);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      // If error wasn't already handled by handleRoleError
      if (!error || typeof error !== 'object' || !('category' in error)) {
        handleRoleError(error, "migrateUsersToDefaultRoles");
      }
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsMigrating(false);
    }
  };

  /**
   * Get all valid roles
   * @returns UserRole[] - Array of valid roles
   */
  const getValidRoles = (): UserRole[] => {
    return ['admin', 'student', 'normal'];
  };

  return {
    bulkUpdateRoles,
    migrateUsersToDefaultRoles,
    isProcessing,
    isMigrating,
    error,
    getValidRoles,
  };
}