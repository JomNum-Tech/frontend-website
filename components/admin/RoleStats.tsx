"use client";

import { useRoleStats } from "@/hooks/useRoleStats";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { UserRole } from "@/types/admin/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useRoleErrors, RoleErrorCategory } from "@/hooks/useRoleErrors";
import { RoleErrorDisplay } from "./RoleErrorDisplay";

interface RoleStatCardProps {
  role: UserRole;
  count: number;
  total: number;
  isLoading: boolean;
}

const RoleStatCard = ({ role, count, total, isLoading }: RoleStatCardProps) => {
  const { getRoleDisplayName, getRoleColorClass } = useRoleManagement();
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${getRoleColorClass(role)} py-3`}>
        <CardTitle className="text-sm font-medium">{getRoleDisplayName(role)}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{count}</span>
              <span className="text-sm text-muted-foreground">{percentage}%</span>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${role === 'admin' ? 'bg-red-500' : role === 'student' ? 'bg-blue-500' : 'bg-gray-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface RoleStatsProps {
  className?: string;
  refreshInterval?: number; // in milliseconds
}

export function RoleStats({ className = "", refreshInterval }: RoleStatsProps) {
  const { handleRoleError, lastError, clearError } = useRoleErrors();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statsError, setStatsError] = useState<unknown>(null);
  

  // Use our enhanced role stats hook with error handling
  const { stats, loading, fetchStats } = useRoleStats({
    refreshInterval,
    onError: (error) => {
      setStatsError(error);
    }
  });

  // Get valid roles from role management
  const { getValidRoles } = useRoleManagement();
  const validRoles = getValidRoles();

  // Handle refresh with error handling - FIXED
  const handleRefresh = async () => {
    if (isRefreshing || loading) return;
    
    setIsRefreshing(true);
    clearError();
    setStatsError(null);
    
    try {
      await fetchStats();
    } catch (error) {
      // Error will be handled by the onError callback
      console.error('Failed to refresh stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // If stats is loaded and total is 0, show a message
  const showNoUsers = stats && !loading && stats.total === 0;

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Role Distribution</CardTitle>
          <CardDescription>User role statistics across the platform</CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="h-8 w-8"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh stats</span>
        </Button>
      </CardHeader>
      <CardContent>
        
        {(lastError || statsError) ? (
          <div className="mb-4">
            <RoleErrorDisplay
              error={
                lastError ??
                {
                  category: RoleErrorCategory.SERVER,
                  message:
                    statsError instanceof Error
                      ? statsError.message
                      : 'Failed to load role statistics'
                }
              }
              onDismiss={clearError}
              onRetry={handleRefresh}
            />
          </div>
        ) : null}

        {showNoUsers ? (
          <div className="text-center text-muted-foreground py-8">
            No users found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {validRoles.map((role) => (
              <RoleStatCard
                key={role}
                role={role}
                count={stats?.[role] || 0}
                total={stats?.total || 0}
                isLoading={loading}
              />
            ))}
          </div>
        )}

        {stats && !loading && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Total users: {stats.total}
          </div>
        )}
      </CardContent>
    </Card>
  );
}