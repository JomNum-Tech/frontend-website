"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClerkUser, UserListResponse, UserFilters } from '@/types/admin/users';
import { UserRole, RoleStats, RoleUpdateResponse } from '@/types/admin/roles';
import { toast } from './use-toast';

export interface RoleError {
  code: 'INVALID_ROLE' | 'PERMISSION_DENIED' | 'ROLE_UPDATE_FAILED' | 'USER_NOT_FOUND';
  message: string;
  userId?: string;
}

export interface UseUsersOptions {
  includeRoleStats?: boolean;
  initialFilters?: UserFilters;
}

export function useUsers(options: UseUsersOptions = {}) {
  // User state
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>(options.initialFilters || {});
  
  // Role-specific state
  const [roleStats, setRoleStats] = useState<RoleStats | null>(null);
  const [roleStatsLoading, setRoleStatsLoading] = useState(false);
  const [roleError, setRoleError] = useState<RoleError | null>(null);
  const [updatingRoles, setUpdatingRoles] = useState<Record<string, boolean>>({});

  // Fetch users with role data
  const fetchUsers = useCallback(async (page: number = 1, newFilters: UserFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(newFilters.search && { search: newFilters.search }),
        ...(newFilters.orderBy && { orderBy: newFilters.orderBy }),
        ...(newFilters.order && { order: newFilters.order }),
        ...(newFilters.role && { role: newFilters.role }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data: UserListResponse = await response.json();
      
      setUsers(data.users);
      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch role statistics
  const fetchRoleStats = useCallback(async () => {
    if (!options.includeRoleStats) return;
    
    try {
      setRoleStatsLoading(true);
      setRoleError(null);
      
      const response = await fetch('/api/admin/roles/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch role statistics');
      }
      
      const data = await response.json();
      setRoleStats(data.stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setRoleError({
        code: 'ROLE_UPDATE_FAILED',
        message: errorMessage
      });
      console.error('Error fetching role statistics:', err);
    } finally {
      setRoleStatsLoading(false);
    }
  }, [options.includeRoleStats]);

  // Update a user's role
  const updateUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<boolean> => {
    setUpdatingRoles(prev => ({ ...prev, [userId]: true }));
    setRoleError(null);
    
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
        let errorCode: RoleError['code'] = 'ROLE_UPDATE_FAILED';
        
        if (response.status === 400) {
          errorCode = 'INVALID_ROLE';
        } else if (response.status === 403) {
          errorCode = 'PERMISSION_DENIED';
        } else if (response.status === 404) {
          errorCode = 'USER_NOT_FOUND';
        }
        
        throw {
          code: errorCode,
          message: data.message || `Failed to update role: ${response.statusText}`,
          userId
        };
      }

      // Update the user in the local state with the correct role structure
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === userId) {
            // Ensure publicMetadata exists and update the role
            const updatedMetadata = { 
              ...(user.publicMetadata || {}), 
              role: newRole 
            };
            
            return { 
              ...user, 
              publicMetadata: updatedMetadata 
            };
          }
          return user;
        })
      );
      
      // Refresh role stats if they're being tracked
      if (options.includeRoleStats) {
        fetchRoleStats();
      }
      
      // Show success toast
      toast({
        title: "Role updated",
        description: data.message || `User role updated to ${newRole}`,
      });
      
      return true;
    } catch (error) {
      const roleError: RoleError = error instanceof Error 
        ? { code: 'ROLE_UPDATE_FAILED', message: error.message, userId }
        : (error as RoleError);
      
      setRoleError(roleError);
      
      // Show error toast
      toast({
        title: "Error updating role",
        description: roleError.message,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setUpdatingRoles(prev => ({ ...prev, [userId]: false }));
    }
  }, [fetchRoleStats, options.includeRoleStats]);

  // Check if a specific user's role is being updated
  const isUpdatingRole = useCallback((userId: string): boolean => {
    return !!updatingRoles[userId];
  }, [updatingRoles]);

  // Update filters and fetch users
  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    fetchUsers(1, newFilters);
  }, [fetchUsers]);

  // Filter users by role (client-side filtering)
  const filterUsersByRole = useCallback((role: UserRole | null) => {
    if (!role) {
      // Clear role filter
      const newFilters = { ...filters };
      delete newFilters.role;
      updateFilters(newFilters);
    } else {
      // Apply role filter
      updateFilters({ ...filters, role });
    }
  }, [filters, updateFilters]);

  // Get role distribution from current users (for quick client-side stats)
  const currentRoleDistribution = useMemo(() => {
    const distribution: Partial<RoleStats> = {
      admin: 0,
      student: 0,
      normal: 0,
      total: users.length
    };
    
    users.forEach(user => {
      const role = user.publicMetadata?.role as UserRole || 'normal';
      if (role in distribution) {
        distribution[role as keyof RoleStats] = (distribution[role as keyof RoleStats] || 0) + 1;
      }
    });
    
    return distribution as RoleStats;
  }, [users]);

  // Load a specific page
  const loadPage = useCallback((page: number) => {
    fetchUsers(page, filters);
  }, [fetchUsers, filters]);

  // Refresh current data
  const refresh = useCallback(() => {
    fetchUsers(currentPage, filters);
    if (options.includeRoleStats) {
      fetchRoleStats();
    }
  }, [fetchUsers, currentPage, filters, fetchRoleStats, options.includeRoleStats]);

  // Get valid roles helper
  const getValidRoles = useCallback((): UserRole[] => {
    return ['admin', 'student', 'normal'];
  }, []);

  // Get role display name helper
  const getRoleDisplayName = useCallback((role: UserRole): string => {
    const displayNames: Record<UserRole, string> = {
      admin: 'Admin',
      student: 'Student',
      normal: 'Normal User'
    };
    
    return displayNames[role] || role;
  }, []);
  
  // Get role color class for UI
  const getRoleColorClass = useCallback((role: UserRole): string => {
    const colorClasses: Record<UserRole, string> = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      student: 'bg-blue-100 text-blue-800 border-blue-200',
      normal: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colorClasses[role] || '';
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchUsers(1, options.initialFilters || {});
    
    if (options.includeRoleStats) {
      fetchRoleStats();
    }
  }, [fetchUsers, fetchRoleStats, options.includeRoleStats, options.initialFilters]);

  return {
    // Basic user data and pagination
    users,
    loading,
    error,
    totalCount,
    hasMore,
    currentPage,
    updateFilters,
    loadPage,
    refresh,
    
    // Role-specific functionality
    roleStats,
    roleStatsLoading,
    roleError,
    updateUserRole,
    isUpdatingRole,
    filterUsersByRole,
    currentRoleDistribution,
    getValidRoles,
    getRoleDisplayName,
    getRoleColorClass
  };
}

export function useUserRole(classTermId: string) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/user/role?classTermId=${classTermId}`)
      .then(res => res.json())
      .then(data => setRole(data.role));
  }, [classTermId]);

  return role;
}