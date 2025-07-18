"use client";

import { useRoleStats } from "@/hooks/useRoleStats";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { UserRole } from "@/types/admin/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Users, UserCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { useRoleErrors, RoleErrorCategory } from "@/hooks/useRoleErrors";
import { useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  // Pie chart data for role distribution
  const pieLabels = validRoles.map((role) => getRoleDisplayName(role));
  const pieValues = validRoles.map((role) => stats?.[role] || 0);
  const pieColors = [
    'rgba(239, 68, 68, 0.7)',    // Admin - red
    'rgba(59, 130, 246, 0.7)',   // Student - blue
    'rgba(107, 114, 128, 0.7)',  // Normal - gray
  ];
  const pieBorderColors = [
    'rgba(239, 68, 68, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(107, 114, 128, 1)',
  ];

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: 'User Roles',
        data: pieValues,
        backgroundColor: pieColors,
        borderColor: pieBorderColors,
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // We'll use a custom legend below
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = stats?.total || 1;
            const percent = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percent}%)`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    maintainAspectRatio: false,
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-blue-50/80 rounded-t-xl border-b border-blue-200">
        <div>
          <CardTitle className="text-xl text-blue-800 font-bold">All Roles</CardTitle>
          <CardDescription className="text-blue-700">
            User role statistics across the platform
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className={`h-9 w-9 border-blue-300 shadow-sm bg-white hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 transition-colors ${loading || isRefreshing ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          <RefreshCcw className={`h-5 w-5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-blue-500'}`} />
          <span className="sr-only">Refresh stats</span>
        </Button>
      </CardHeader>
      
      <CardContent className="px-4 py-6 md:px-8">
        {/* Pie Chart for Role Distribution */}
        {!loading && stats && stats.total > 0 && (
          <section className="flex flex-col items-center mb-10">
            <div className="w-full flex justify-center">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
            {/* Custom Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {validRoles.map((role, idx) => (
                <div key={role} className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: pieColors[idx] }}
                  ></span>
                  <span className="text-sm font-medium text-gray-700">
                    {getRoleDisplayName(role)}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({stats[role] || 0})
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              <span className="font-medium text-blue-900">User Role Distribution</span>
            </div>
          </section>
        )}
        {(lastError || statsError) ? (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-6 w-6 text-red-500 mt-0.5" />
              <div>
                <p className="text-base font-semibold text-red-800 mb-1">
                  Error loading role statistics
                </p>
                <p className="text-sm text-red-700">
                  {lastError?.message || (statsError instanceof Error ? statsError.message : 'Unknown error')}
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRefresh}
                className="text-xs h-8 px-4"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : null}

        {showNoUsers ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <Users className="h-14 w-14 mb-3 text-gray-200" />
            <p className="text-base font-medium mb-2">No users found in the system.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              className="mt-2 px-5 py-2 rounded-md border-blue-200 hover:bg-blue-50 transition"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
              <div className="mt-10 space-y-8">
                <div className="space-y-5">
                  {roleDistribution.map(item => {
                    const roleName = getRoleDisplayName(item.role);
                    const isAdmin = roleName === 'Admin';
                    const isStudent = roleName === 'Student';
                    const badgeClass = isAdmin
                      ? 'border-red-500 bg-red-50 text-red-700 font-semibold shadow-sm'
                      : isStudent
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                        : 'border-gray-400 bg-gray-50 text-gray-700 font-semibold shadow-sm';

                    // Enhanced progress bar style
                    const progressBgClass = isAdmin
                      ? 'bg-gradient-to-r from-red-400 via-red-300 to-red-100'
                      : isStudent
                        ? 'bg-gradient-to-r from-blue-500 via-blue-300 to-blue-100'
                        : 'bg-gradient-to-r from-gray-500 via-gray-300 to-gray-100';

                    const progressOuterClass = "relative h-4 rounded-full bg-gray-100 overflow-hidden shadow-inner";
                    const percentColor = isAdmin
                      ? 'text-red-700'
                      : isStudent
                        ? 'text-blue-700'
                        : 'text-gray-600';

                    return (
                      <div
                        key={item.role}
                        className="space-y-2 p-4 rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={badgeClass + " px-3 py-1 text-sm"}
                            >
                              {roleName}
                            </Badge>
                            <span className="ml-4 text-gray-800 font-medium">
                              {item.count} {item.count === 1 ? 'user' : 'users'}
                            </span>
                          </div>
                          <span className={`font-semibold ${percentColor}`}>
                            {item.percentage}%
                          </span>
                        </div>
                        {/* Custom progress bar for better UX/UI */}
                        <div className={progressOuterClass}>
                          <div
                            className={`${progressBgClass} absolute left-0 top-0 h-full transition-all duration-500`}
                            style={{
                              width: `${item.percentage}%`,
                              minWidth: item.percentage > 0 ? '1.5rem' : '0',
                              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                            }}
                          />
                          {/* Animated indicator dot at the end of the progress */}
                          {item.percentage > 0 && (
                            <span
                              className={`absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 rounded-full border-2 border-white shadow ${isAdmin ? 'bg-red-400' : isStudent ? 'bg-blue-500' : 'bg-gray-500'} transition-all duration-500`}
                              style={{
                                left: `calc(${item.percentage}% - 0.5rem)`,
                                zIndex: 2,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <UserCheck className="h-6 w-6 mr-3 text-blue-500" />
                      <span className="text-lg font-semibold text-gray-800">Total Users</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900 drop-shadow-sm">{stats.total}</span>
                  </div>
                </div>
              </div>
            )}
            
            {stats && !loading && !showDetailedStats && (
              <div className="mt-6 text-center text-base text-muted-foreground">
                <span className="font-medium text-blue-900">Total users: {stats.total}</span>
                {lastUpdated && (
                  <span className="ml-3 text-xs text-gray-500">
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