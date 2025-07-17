"use client";

import { useState, useCallback } from 'react';
import { useRoleErrors, ClientRoleError, RoleErrorCategory } from './useRoleErrors';
import { UserRole } from '@/types/admin/roles';

interface UseRoleErrorHandlingOptions {
  onError?: (error: ClientRoleError) => void;
  autoToast?: boolean;
}

/**
 * Custom hook for handling role-specific errors with enhanced features
 */
export function useRoleErrorHandling(options: UseRoleErrorHandlingOptions = {}) {
  const { handleRoleError, lastError, clearError } = useRoleErrors();
  const [errorsByOperation, setErrorsByOperation] = useState<Record<string, ClientRoleError[]>>({});
  
  /**
   * Handle an error for a specific operation
   * @param error - The error to handle
   * @param operation - The operation that caused the error
   * @returns The processed error
   */
  const handleOperationError = useCallback((error: unknown, operation: string): ClientRoleError => {
    // Process the error using the base error handler
    const processedError = handleRoleError(error, operation);
    
    // Store the error by operation
    setErrorsByOperation(prev => ({
      ...prev,
      [operation]: [...(prev[operation] || []), processedError]
    }));
    
    // Call the onError callback if provided
    if (options.onError) {
      options.onError(processedError);
    }
    
    return processedError;
  }, [handleRoleError, options]);
  
  /**
   * Clear errors for a specific operation
   * @param operation - The operation to clear errors for
   */
  const clearOperationErrors = useCallback((operation: string) => {
    setErrorsByOperation(prev => {
      const newErrors = { ...prev };
      delete newErrors[operation];
      return newErrors;
    });
  }, []);
  
  /**
   * Clear all operation errors
   */
  const clearAllOperationErrors = useCallback(() => {
    setErrorsByOperation({});
  }, []);
  
  /**
   * Get errors for a specific operation
   * @param operation - The operation to get errors for
   * @returns Array of errors for the operation
   */
  const getOperationErrors = useCallback((operation: string): ClientRoleError[] => {
    return errorsByOperation[operation] || [];
  }, [errorsByOperation]);
  
  /**
   * Check if an operation has errors
   * @param operation - The operation to check
   * @returns True if the operation has errors
   */
  const hasOperationErrors = useCallback((operation: string): boolean => {
    return (errorsByOperation[operation]?.length || 0) > 0;
  }, [errorsByOperation]);
  
  /**
   * Create a role error with the specified category and details
   * @param category - The error category
   * @param message - The error message
   * @param details - Additional error details
   * @returns A client role error
   */
  const createError = useCallback((
    category: RoleErrorCategory,
    message: string,
    details?: {
      userId?: string;
      role?: UserRole;
      statusCode?: number;
      details?: string;
    }
  ): ClientRoleError => {
    return {
      category,
      message,
      ...details
    };
  }, []);
  
  /**
   * Execute an operation with error handling
   * @param operation - The operation name
   * @param fn - The function to execute
   * @returns The result of the function
   */
  const executeWithErrorHandling = useCallback(async <T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      return await fn();
    } catch (error) {
      handleOperationError(error, operation);
      return null;
    }
  }, [handleOperationError]);
  
  return {
    handleOperationError,
    clearOperationErrors,
    clearAllOperationErrors,
    getOperationErrors,
    hasOperationErrors,
    createError,
    executeWithErrorHandling,
    lastError,
    clearError
  };
}