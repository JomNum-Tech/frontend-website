"use client";

import { useRoleStats } from "@/hooks/useRoleStats";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { UserRole } from "@/types/admin/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Users } from "lucide-react";
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
    <Card className="overflow-hidden shadow-md border border-gray-200 transition-transform hover:scale-[1.025] hover:shadow-xl bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <CardHeader
        className={`
          flex flex-row items-center gap-2 py-3 px-4
          ${getRoleColorClass(role)} 
          bg-opacity-90
          border-b
          ${role === 'admin' ? 'bg-red-50 border-red-100' : role === 'student' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}
        `}
      >
        <div className="flex items-center gap-2">
          <span
            className={`
              inline-block w-3 h-3 rounded-full
              ${role === 'admin' ? 'bg-red-500' : role === 'student' ? 'bg-blue-500' : 'bg-gray-400'}
              shadow
            `}
          />
          <CardTitle className="text-base font-semibold tracking-tight text-gray-800">
            {getRoleDisplayName(role)}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-extrabold text-gray-900">{count}</span>
              <span className="text-sm font-medium text-gray-500">{percentage}%</span>
            </div>
            <div className="relative mt-2 h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`
                  absolute left-0 top-0 h-full transition-all duration-500
                  ${role === 'admin' ? 'bg-gradient-to-r from-red-400 to-red-600' : role === 'student' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-gray-400 to-gray-600'}
                `}
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
  const { lastError, clearError } = useRoleErrors();
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
    <Card className={`border border-1 border-blue-200 bg-white ${className}`}>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Users />
            All Users
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className={`h-9 w-9 border border-blue-200 bg-white hover:bg-blue-50 transition-colors duration-150 shadow-sm ${isRefreshing ? "ring-2 ring-blue-200" : ""}`}
          aria-label="Refresh stats"
        >
          <RefreshCcw className={`h-5 w-5 text-blue-500 transition-transform duration-200 ${isRefreshing ? 'animate-spin' : 'hover:rotate-[-20deg]'}`} />
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
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
          <div className="text-center text-muted-foreground py-10 text-lg font-medium">
            <span className="inline-flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-gray-300 animate-pulse" />
              No users found.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-semibold text-blue-900">
                Total users:
              </span>
              <span className="text-2xl font-extrabold text-blue-700 drop-shadow-sm">
                {stats.total}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}