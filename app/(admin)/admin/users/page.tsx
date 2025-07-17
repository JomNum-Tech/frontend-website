"use client";

import { useState, useEffect, useMemo } from "react";
import { useUsers } from "@/hooks/useUsers";
import { UserTable } from "@/components/admin/UserTable";
import { UserFiltersComponent } from "@/components/admin/UserFilters";
import { Pagination } from "@/components/admin/Pagination";
import { RoleStats } from "@/components/admin/RoleStats";
import { BulkRoleAssignment } from "@/components/admin/BulkRoleAssignment";
import { RefreshCw, AlertCircle, Users } from "lucide-react";
import { ClerkUserWithRole } from "@/types/admin/roles";

export default function UserManagement() {
  const [roleStats, setRoleStats] = useState<Record<string, number>>({});
  const [roleStatsLoading, setRoleStatsLoading] = useState(false);

  const {
    users: rawUsers,
    loading,
    error,
    totalCount,
    currentPage,
    updateFilters,
    loadPage,
    refresh,
  } = useUsers();

  // Transform ClerkUser[] to ClerkUserWithRole[] by adding the role property
  const users = useMemo(() => {
    return rawUsers.map((user) => {
      // Extract role from publicMetadata or use 'normal' as default
      const role = (user.publicMetadata?.role as string) || "normal";
      return {
        ...user,
        role: role as "admin" | "student" | "normal",
        publicMetadata: {
          ...user.publicMetadata,
          role: role as "admin" | "student" | "normal",
        },
      } as ClerkUserWithRole;
    });
  }, [rawUsers]);

  // Fetch role statistics
  const fetchRoleStats = async () => {
    try {
      setRoleStatsLoading(true);
      const response = await fetch("/api/admin/roles/stats");

      if (!response.ok) {
        throw new Error("Failed to fetch role statistics");
      }

      const data = await response.json();
      setRoleStats(data.stats || {});
    } catch (error) {
      console.error("Error fetching role statistics:", error);
    } finally {
      setRoleStatsLoading(false);
    }
  };

  // Fetch role statistics on initial load
  useEffect(() => {
    fetchRoleStats();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading users
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={refresh}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">
                User Management
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Easily manage and view all users in your application.
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className={`group relative inline-flex items-center px-5 py-2.5 rounded-lg shadow transition-all duration-200
                text-sm font-semibold
                ${
                  loading
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              `}
              aria-busy={loading}
            >
              <span className="flex items-center">
                <RefreshCw
                  className={`h-5 w-5 mr-2 transition-transform duration-200 ${
                    loading ? "animate-spin" : "group-hover:rotate-[-20deg]"
                  }`}
                />
                <span>{loading ? "Refreshing..." : "Refresh"}</span>
              </span>
              {loading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-200 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Role Stats Dashboard */}
        <div className="mb-8">
          <RoleStats refreshInterval={60000} />
        </div>

        {/* Bulk Role Assignment */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Bulk Role Management
                </h3>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Assign roles to multiple users at once or migrate users without
                roles.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <BulkRoleAssignment users={users} onSuccess={refresh} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <UserFiltersComponent
          onFiltersChange={updateFilters}
          loading={loading}
          roleStats={roleStats}
          roleStatsLoading={roleStatsLoading}
        />

        {/* User Table */}
        <UserTable users={users} loading={loading} />

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={10}
              onPageChange={loadPage}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
