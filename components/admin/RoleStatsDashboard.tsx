"use client";

import { useRoleStats } from "@/hooks/useRoleStats";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { UserRole } from "@/types/admin/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Users, UserCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useRoleErrors, RoleErrorCategory } from "@/hooks/useRoleErrors";
import { useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

interface RoleStatsDashboardProps {
  className?: string;
  refreshInterval?: number; // in milliseconds
  showDetailedStats?: boolean;
}

export function RoleStatsDashboard({ 
  className = "", 
  refreshInterval,
  showDetailedStats = false
}: RoleStatsDashboardProps) {
  const { handleRoleError, lastError, clearError } = useRoleErrors();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statsError, setStatsError] = useState<unknown>(null);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  // Use our enhanced role stats hook with error handling
  const { 
    stats, 
    loading, 
    fetchStats, 
    lastUpdated,
    getRoleDistribution
  } = useRoleStats({
    refreshInterval,
    onError: (error) => {
      setStatsError(error);
    }
  });

  // Get valid roles from role management
  const { getValidRoles, getRoleDisplayName } = useRoleManagement();
  const validRoles = getValidRoles();

  // Handle refresh with error handling
  const handleRefresh = () => {
    if (isRefreshing || loading) return;
    if (refreshTimeout.current) return;

    setIsRefreshing(true);
    clearError();
    setStatsError(null);
  };

  // If stats is loaded and total is 0, show a message
  const showNoUsers = stats && !loading && stats.total === 0;
  
  // Get role distribution data
  const roleDistribution = getRoleDistribution();

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
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Error loading role statistics
                </p>
                <p className="text-xs text-red-700">
                  {lastError?.message || (statsError instanceof Error ? statsError.message : 'Unknown error')}
                </p>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="text-xs h-7"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        {showNoUsers ? (
          <div className="text-center text-muted-foreground py-8">
            <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No users found in the system.</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4">
              Refresh
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            
            {showDetailedStats && stats && !loading && (
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Detailed Distribution</h3>
                
                {roleDistribution.map(item => (
                  <div key={item.role} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <Badge variant="outline" className={getRoleDisplayName(item.role) === 'Admin' ? 'border-red-500 text-red-700' : 
                                                           getRoleDisplayName(item.role) === 'Student' ? 'border-blue-500 text-blue-700' : 
                                                           'border-gray-500 text-gray-700'}>
                          {getRoleDisplayName(item.role)}
                        </Badge>
                        <span className="ml-2">{item.count} users</span>
                      </div>
                      <span>{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
                
                <div className="pt-4 border-t mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm font-medium">Total Users</span>
                    </div>
                    <span className="text-sm font-bold">{stats.total}</span>
                  </div>
                </div>
              </div>
            )}
            
            {stats && !loading && !showDetailedStats && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Total users: {stats.total}
                {lastUpdated && (
                  <span className="ml-2 text-xs">
                    (Last updated: {lastUpdated.toLocaleTimeString()})
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}