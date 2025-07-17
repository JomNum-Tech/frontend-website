"use client";

import { useState } from 'react';
import { UserRole, RoleUpdateResponse } from '@/types/admin/roles';
import { ClerkUser } from '@/types/admin/users';
import { toast } from './use-toast';

interface UseRoleManagementProps {
  onSuccess?: (userId: string, newRole: UserRole) => void;
}

export function useRoleManagement({ onSuccess }: UseRoleManagementProps = {}) {
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  /**
   * Update a user's role
   * @param userId - The user's ID
   * @param newRole - The new role to assign
   * @returns Promise<boolean> - Whether the update was successful
   */
  const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    setIsUpdating(prev => ({ ...prev, [userId]: true }));
    setError(null);
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newRole,
        }),
      });

      const data: RoleUpdateResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update role');
      }

      // Show success toast
      toast({
        title: "Role updated",
        description: data.message || `User role updated to ${newRole}`,
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userId, newRole);
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      setError(errorMessage);
      
      // Show error toast
      toast({
        title: "Error updating role",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsUpdating(prev => ({ ...prev, [userId]: false }));
    }
  };

  /**
   * Check if a specific user's role is being updated
   * @param userId - The user's ID
   * @returns boolean - Whether the user's role is being updated
   */
  const isUpdatingRole = (userId: string): boolean => {
    return !!isUpdating[userId];
  };

  /**
   * Get role display name for UI
   * @param role - The role
   * @returns string - The display name
   */
  const getRoleDisplayName = (role: UserRole): string => {
    const displayNames: Record<UserRole, string> = {
      admin: 'Admin',
      student: 'Student',
      normal: 'Normal User'
    };
    
    return displayNames[role] || role;
  };

  /**
   * Get role color class for UI
   * @param role - The role
   * @returns string - The color class
   */
  const getRoleColorClass = (role: UserRole): string => {
    const colorClasses: Record<UserRole, string> = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      student: 'bg-blue-100 text-blue-800 border-blue-200',
      normal: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colorClasses[role] || '';
  };

  /**
   * Get all valid roles
   * @returns UserRole[] - Array of valid roles
   */
  const getValidRoles = (): UserRole[] => {
    return ['admin', 'student', 'normal'];
  };

  return {
    updateUserRole,
    isUpdatingRole,
    error,
    getRoleDisplayName,
    getRoleColorClass,
    getValidRoles,
  };
}