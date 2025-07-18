/**
 * Role management specific error types and handling utilities
 */

import { UserRole } from '@/types/admin/roles';

// Role error codes
export enum RoleErrorCode {
  INVALID_ROLE = 'INVALID_ROLE',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ROLE_UPDATE_FAILED = 'ROLE_UPDATE_FAILED',
  ROLE_FETCH_FAILED = 'ROLE_FETCH_FAILED',
  ROLE_VALIDATION_FAILED = 'ROLE_VALIDATION_FAILED',
  SELF_DEMOTION_PREVENTED = 'SELF_DEMOTION_PREVENTED',
  CLERK_API_ERROR = 'CLERK_API_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Role error interface
export interface RoleError {
  code: RoleErrorCode;
  message: string;
  userId?: string;
  role?: UserRole;
  originalError?: Error;
}

// User-friendly error messages for each error code
const ERROR_MESSAGES: Record<RoleErrorCode, string> = {
  [RoleErrorCode.INVALID_ROLE]: 'The specified role is not valid.',
  [RoleErrorCode.PERMISSION_DENIED]: 'You do not have permission to perform this action.',
  [RoleErrorCode.ROLE_UPDATE_FAILED]: 'Failed to update the user role.',
  [RoleErrorCode.ROLE_FETCH_FAILED]: 'Failed to fetch user role information.',
  [RoleErrorCode.ROLE_VALIDATION_FAILED]: 'Role validation failed.',
  [RoleErrorCode.SELF_DEMOTION_PREVENTED]: 'You cannot remove your own admin role.',
  [RoleErrorCode.CLERK_API_ERROR]: 'An error occurred while communicating with the authentication service.',
  [RoleErrorCode.UNKNOWN_ERROR]: 'An unknown error occurred during role management.'
};

/**
 * Create a role error with the specified code and optional details
 * @param code - The error code
 * @param details - Additional error details
 * @returns RoleError object
 */
export function createRoleError(
  code: RoleErrorCode,
  details?: {
    userId?: string;
    role?: UserRole;
    message?: string;
    originalError?: Error;
  }
): RoleError {
  return {
    code,
    message: details?.message || ERROR_MESSAGES[code],
    userId: details?.userId,
    role: details?.role,
    originalError: details?.originalError
  };
}

/**
 * Get a user-friendly error message for a role error
 * @param error - The role error
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: RoleError): string {
  let message = error.message || ERROR_MESSAGES[error.code];
  
  // Add context-specific details to the message
  if (error.userId) {
    message += ` (User ID: ${error.userId.substring(0, 8)}...)`;
  }
  
  if (error.role) {
    message += ` (Role: ${error.role})`;
  }
  
  return message;
}

/**
 * Log a role error with appropriate details
 * @param error - The role error to log
 * @param context - Additional context information
 */
export function logRoleError(error: RoleError, context?: string): void {
  const timestamp = new Date().toISOString();
  const contextInfo = context ? ` [${context}]` : '';
  
  console.error(`[${timestamp}] Role Error${contextInfo}: ${error.code} - ${error.message}`);
  
  if (error.userId) {
    console.error(`User ID: ${error.userId}`);
  }
  
  if (error.role) {
    console.error(`Role: ${error.role}`);
  }
  
  if (error.originalError) {
    console.error('Original Error:', error.originalError);
  }
}

/**
 * Determine if an error is retryable
 * @param error - The role error to check
 * @returns boolean indicating if the error is retryable
 */
export function isRetryableError(error: RoleError): boolean {
  // Define which error types are retryable
  const retryableCodes = [
    RoleErrorCode.ROLE_UPDATE_FAILED,
    RoleErrorCode.ROLE_FETCH_FAILED,
    RoleErrorCode.CLERK_API_ERROR
  ];
  
  return retryableCodes.includes(error.code);
}

/**
 * Convert a generic error to a RoleError
 * @param error - The error to convert
 * @param userId - Optional user ID for context
 * @param role - Optional role for context
 * @returns RoleError object
 */
export function toRoleError(error: unknown, userId?: string, role?: UserRole): RoleError {
  if (error && typeof error === 'object' && 'code' in error && Object.values(RoleErrorCode).includes(error.code as RoleErrorCode)) {
    return error as RoleError;
  }
  
  let message = 'Unknown error';
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  return createRoleError(RoleErrorCode.UNKNOWN_ERROR, {
    message,
    userId,
    role,
    originalError: error instanceof Error ? error : new Error(String(error))
  });
}