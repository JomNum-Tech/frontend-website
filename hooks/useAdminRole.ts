"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserRole } from '@/types/admin/roles';

/**
 * Hook for managing admin role information in the admin layout
 * Provides role information and verification for the current user
 */
export function useAdminRole() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole>('normal');
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Get role from user metadata
      const role = user.publicMetadata?.role as UserRole;
      setUserRole(role || 'normal');
      setIsLoadingRole(false);
    } else if (isLoaded && !user) {
      setIsLoadingRole(false);
    }
  }, [isLoaded, user]);

  // Check if user has admin role
  const isAdmin = userRole === 'admin';

  // Get a display name for the role
  const getRoleDisplayName = (role: UserRole): string => {
    const displayNames: Record<UserRole, string> = {
      admin: 'Administrator',
      student: 'Student',
      normal: 'Normal User'
    };
    
    return displayNames[role] || role;
  };

  return {
    userRole,
    isAdmin,
    isLoadingRole,
    getRoleDisplayName
  };
}