"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { RoleStats, UserRole } from '@/types/admin/roles';
import { useRoleErrors, RoleErrorCategory } from './useRoleErrors';

interface UseRoleStatsProps {
  refreshInterval?: number;
  onError?: (error: unknown) => void;
}

export function useRoleStats({ refreshInterval, onError }: UseRoleStatsProps = {}) {
  const [stats, setStats] = useState<RoleStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [validRoles, setValidRoles] = useState<UserRole[]>([]);
  const [defaultRole, setDefaultRole] = useState<UserRole>('normal');
  const { handleRoleError } = useRoleErrors();
  const isFetching = useRef(false); 
  
  // Use refs to store the latest values without causing re-renders
  const onErrorRef = useRef(onError);
  const handleRoleErrorRef = useRef(handleRoleError);
  
  // Update refs when values change
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  
  useEffect(() => {
    handleRoleErrorRef.current = handleRoleError;
  }, [handleRoleError]);

  /**
   * Fetch with automatic retry for transient errors
   * @param url - The URL to fetch
   * @param options - Fetch options
   * @param maxRetries - Maximum number of retries
   * @returns Promise<Response>
   */
  const fetchWithRetry = useCallback(async (
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
  }, []);

  /**
   * Fetch role statistics from the API
   */
  const fetchStats = useCallback(async () => {
    if (isFetching.current) return; // Prevent overlapping fetches
    isFetching.current = true;
    setLoading(true);
    
    try {
      // Use fetch with automatic retry for network errors
      const response = await fetchWithRetry('/api/admin/roles/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }, 2); // Retry up to 2 times

      const data = await response.json();
      
      if (!response.ok) {
        // Handle API error responses with proper categorization
        const category = response.status === 403 ? RoleErrorCategory.PERMISSION :
                        response.status === 400 ? RoleErrorCategory.VALIDATION :
                        response.status >= 500 ? RoleErrorCategory.SERVER :
                        RoleErrorCategory.NETWORK;
                        
        throw handleRoleErrorRef.current({
          category,
          message: data.error || 'Failed to fetch role statistics',
          statusCode: response.status,
          details: data.details
        }, "fetchRoleStats");
      }

      // Update state with fetched data
      setStats(data.stats);
      setLastUpdated(new Date(data.timestamp || Date.now()));
      setValidRoles(data.validRoles || []);
      setDefaultRole(data.defaultRole || 'normal');
      
      return data.stats;
    } catch (error) {
      // If error wasn't already handled by handleRoleError
      if (!error || typeof error !== 'object' || !('category' in error)) {
        handleRoleErrorRef.current(error, "fetchRoleStats");
      }
      
      // Call onError callback if provided
      if (onErrorRef.current) {
        onErrorRef.current(error);
      }
      
      return null;
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [fetchWithRetry]);

  // Fetch stats on initial load - FIXED: Remove fetchStats from dependencies
  useEffect(() => {
    fetchStats();
  }, []); // Empty dependency array for initial load only

  // Set up refresh interval if specified - FIXED: Remove fetchStats from dependencies
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;
    
    // Use a ref to track if component is mounted
    const isMounted = { current: true };
    
    const intervalId = setInterval(() => {
      // Only fetch if component is still mounted
      if (isMounted.current && !isFetching.current) {
        fetchStats();
      }
    }, refreshInterval);
    
    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [refreshInterval]); // Only depend on refreshInterval

  /**
   * Get the percentage of users with a specific role
   * @param role - The role to get percentage for
   * @returns Percentage of users with the role
   */
  const getRolePercentage = useCallback((role: UserRole): number => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats[role] / stats.total) * 100);
  }, [stats]);

  /**
   * Get the distribution of roles as an array of objects
   * @returns Array of role distribution objects
   */
  const getRoleDistribution = useCallback((): Array<{ role: UserRole; count: number; percentage: number }> => {
    if (!stats) return [];
    
    return Object.entries(stats)
      .filter(([key]) => key !== 'total')
      .map(([role, count]) => ({
        role: role as UserRole,
        count,
        percentage: getRolePercentage(role as UserRole)
      }))
      .sort((a, b) => b.count - a.count);
  }, [stats, getRolePercentage]);

  return {
    stats,
    loading,
    lastUpdated,
    validRoles,
    defaultRole,
    fetchStats,
    getRolePercentage,
    getRoleDistribution
  };
}