import { ClerkUser } from './users';

// Core role type definition
export type UserRole = 'admin' | 'student' | 'normal';

// Extended ClerkUser interface with role information
export interface ClerkUserWithRole extends Omit<ClerkUser, 'role'> {
  role: UserRole;
  publicMetadata: {
    role?: UserRole;
  };
}

// Role update request interface
export interface RoleUpdateRequest {
  userId: string;
  newRole: UserRole;
}

// Role statistics interface
export interface RoleStats {
  admin: number;
  student: number;
  normal: number;
  total: number;
}

// Role assignment response interface
export interface RoleUpdateResponse {
  success: boolean;
  userId: string;
  newRole: UserRole;
  message?: string;
}

// Role validation interface
export interface RoleValidation {
  isValid: boolean;
  role: UserRole;
  errors?: string[];
}

// Bulk role assignment interface
export interface BulkRoleUpdateRequest {
  userIds: string[];
  newRole: UserRole;
}

export interface BulkRoleUpdateResponse {
  successful: string[];
  failed: Array<{
    userId: string;
    error: string;
  }>;
  totalProcessed: number;
}