"use client";

import { useState, useCallback } from 'react';
import { toast } from './use-toast';
import { UserRole } from '@/types/admin/roles';

/**
 * Error categories for role management operations
 */
export enum RoleErrorCategory {
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  NETWORK = 'network',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

/**
 * Role error interface for client-side error handling
 */
export interface ClientRoleError {
  category: RoleErrorCategory;
  message: string;
  userId?: string;
  role?: UserRole;
  statusCode?: number;
  details?: string;
}

/**
 * Hook for handling role management errors on the client side
 */
export function useRoleErrors() {
  const [lastError, setLastError] = useState<ClientRoleError | null>(null);
  const [errorHistory, setErrorHistory] = useState<ClientRoleError[]>([]);

  /**
   * Handle a role management error
   * @param error - The error to handle
   * @param context - Optional context information
   */
  const handleRoleError = useCallback((error: unknown, context?: string): ClientRoleError => {
    let roleError: ClientRoleError;

    // Parse the error based on its type
    if (error instanceof Response || (error && typeof error === 'object' && 'status' in error)) {
      // Handle fetch Response errors
      const response = error as Response;
      roleError = {
        category: response.status === 403 ? RoleErrorCategory.PERMISSION : 
                 response.status === 400 ? RoleErrorCategory.VALIDATION :
                 response.status >= 500 ? RoleErrorCategory.SERVER :
                 RoleErrorCategory.NETWORK,
        message: `Request failed with status: ${response.status}`,
        statusCode: response.status
      };
    } else if (error instanceof Error) {
      // Handle standard Error objects
      roleError = {
        category: error.name === 'TypeError' ? RoleErrorCategory.NETWORK : RoleErrorCategory.UNKNOWN,
        message: error.message,
        details: error.stack
      };
    } else if (error && typeof error === 'object' && 'message' in error) {
      // Handle error-like objects
      const errorObj = error as { message: string; code?: string; userId?: string; role?: UserRole };
      roleError = {
        category: errorObj.code === 'permission_denied' ? RoleErrorCategory.PERMISSION :
                 errorObj.code === 'invalid_role' ? RoleErrorCategory.VALIDATION :
                 RoleErrorCategory.UNKNOWN,
        message: String(errorObj.message),
        userId: errorObj.userId as string,
        role: errorObj.role as UserRole
      };
    } else {
      // Handle other error types
      roleError = {
        category: RoleErrorCategory.UNKNOWN,
        message: error ? String(error) : 'An unknown error occurred'
      };
    }

    // Add context to the error message if provided
    if (context) {
      roleError.message = `[${context}] ${roleError.message}`;
    }

    // Update error state
    setLastError(roleError);
    setErrorHistory(prev => [...prev, roleError]);

    // Show toast notification for the error
    showErrorToast(roleError);

    return roleError;
  }, []);

  /**
   * Show a toast notification for a role error
   * @param error - The role error to display
   */
  const showErrorToast = useCallback((error: ClientRoleError) => {
    const title = getErrorTitle(error.category);
    
    toast({
      title,
      description: error.message,
      variant: "destructive",
    });
  }, []);

  /**
   * Get a user-friendly title for an error category
   * @param category - The error category
   * @returns User-friendly title
   */
  const getErrorTitle = (category: RoleErrorCategory): string => {
    switch (category) {
      case RoleErrorCategory.PERMISSION:
        return 'Permission Denied';
      case RoleErrorCategory.VALIDATION:
        return 'Invalid Input';
      case RoleErrorCategory.NETWORK:
        return 'Network Error';
      case RoleErrorCategory.SERVER:
        return 'Server Error';
      case RoleErrorCategory.UNKNOWN:
      default:
        return 'Error';
    }
  };

  /**
   * Clear the last error
   */
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  /**
   * Clear the error history
   */
  const clearErrorHistory = useCallback(() => {
    setErrorHistory([]);
  }, []);

  return {
    lastError,
    errorHistory,
    handleRoleError,
    clearError,
    clearErrorHistory,
    showErrorToast
  };
}