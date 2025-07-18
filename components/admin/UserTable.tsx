"use client";

import { useState, useMemo, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { useRoleStats } from "@/hooks/useRoleStats";
import { ClerkUserWithRole, UserRole } from "@/types/admin/roles";
import { RefreshCw, AlertCircle, Users, Shield, UserCheck, Filter } from "lucide-react";
import { Pagination } from "@/components/admin/Pagination";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple date formatting utility
const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getClerkUserRole(user: any): UserRole {
  const role = user?.publicMetadata?.role;
  if (role === "admin" || role === "student" || role === "normal") {
    return role;
  }
  return "normal";
}

export default function UserTable() {
  const [activeTab, setActiveTab] = useState<UserRole | "all">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const {
    users: rawUsers,
    loading,
    error,
    totalCount,
    currentPage,
    loadPage,
    refresh,
  } = useUsers();

  const { getRoleDisplayName, getValidRoles } = useRoleManagement();
  const validRoles = getValidRoles();
  
  const { stats, loading: statsLoading } = useRoleStats({
    refreshInterval: 60000,
  });

  // Transform ClerkUser[] to ClerkUserWithRole[] by adding the role property
  const users = useMemo(() => {
    return rawUsers.map((user) => ({
      ...user,
      role: getClerkUserRole(user),
      publicMetadata: {
        ...user.publicMetadata,
        role: getClerkUserRole(user),
      },
    })) as ClerkUserWithRole[];
  }, [rawUsers]);

  // Filter users based on active tab
  const filteredUsers = useMemo(() => {
    if (activeTab === "all") return rawUsers;
    return rawUsers.filter((user) => user?.role === activeTab);
  }, [rawUsers, activeTab]);

  const getRoleCount = (role: UserRole | "all") => {
    if (role === "all") return users.length;
    return users.filter((user) => user.role === role).length;
  };

  const handleRefresh = async () => {
    if (isRefreshing || loading) return;
    
    setIsRefreshing(true);
    try {
      await refresh();
    } catch (error) {
      console.error('Failed to refresh users:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper function to get role badge styling
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      case "student":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "normal":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  // Helper function to get role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "student":
        return <UserCheck className="h-4 w-4" />;
      case "normal":
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    console.log("Transformed users:", users.map(u => ({ id: u.id, role: u.publicMetadata?.role })));
  }, [users]);

  useEffect(() => {
    console.log("RAW USERS FROM CLERK:", rawUsers);
  }, [rawUsers]);

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
      <div className="max-w-7xl mx-auto">

        {/* Role Stats Summary */}
        <div className="mb-8">
          <Card className="border border-blue-200 bg-white shadow-sm rounded-xl">
            <CardContent className="pt-4 pb-4 px-4">
              <div className="flex flex-wrap gap-3 items-center justify-start">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full border font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300
                    ${
                      activeTab === "all"
                        ? "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400 text-blue-900 shadow"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                    }
                  `}
                  aria-pressed={activeTab === "all"}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">All Users</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm
                    ${activeTab === "all" ? "bg-blue-200 text-blue-900" : "bg-gray-100 text-blue-700"}
                  `}>
                    {statsLoading ? <span className="animate-pulse">...</span> : stats?.total || users.length}
                  </span>
                </button>

                {validRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border border-2 border-gray-100 font-semibold transition-all duration-150 focus:outline-none focus:ring-2
                      ${
                        activeTab === role
                          ? `${getRoleBadgeClass(role)} border-2 shadow focus:ring-${role === "admin" ? "red" : role === "student" ? "blue" : "gray"}-200`
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-300"
                      }
                    `}
                    aria-pressed={activeTab === role}
                  >
                    {getRoleIcon(role)}
                    <span className="font-medium">{getRoleDisplayName(role)}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm
                      ${activeTab === role
                        ? role === "admin"
                          ? "bg-red-200 text-red-900"
                          : role === "student"
                          ? "bg-blue-200 text-blue-900"
                          : "bg-gray-200 text-gray-900"
                        : "bg-gray-100 text-blue-700"}
                    `}>
                      {statsLoading ? <span className="animate-pulse">...</span> : stats?.[role] || getRoleCount(role)}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced User Table with Role Column */}
        <Card className="border border-1 border-blue-200 bg-white">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2 border-b">
            <div>
              <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                {activeTab === "all" 
                  ? "All Users" 
                  : `${getRoleDisplayName(activeTab)} Users`}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 rounded-lg border-1 border border-blue-900 bg-white px-6 py-1">
              <span className="text-lg font-semibold text-blue-900 tracking-tight italic">
                Total {filteredUsers.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8">
                <div className="animate-pulse space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-5">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-lg">
                <span className="inline-block mb-2 text-3xl">😕</span>
                <div>
                  {activeTab !== "all" 
                    ? `No ${getRoleDisplayName(activeTab)} users found.`
                    : "No users found."}
                </div>
                {activeTab !== "all" && (
                  <button 
                    className="mt-4 text-blue-600 hover:underline"
                    onClick={() => setActiveTab("all")}
                  >
                    View all users
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          User
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                        <span className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-blue-400" />
                          Role
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1" />
                          </svg>
                          Email
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 8v4l3 3" />
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                          Created
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17 21v-2a4 4 0 00-3-3.87M9 17a4 4 0 01-3-3.87V7a4 4 0 014-4h2a4 4 0 014 4v6a4 4 0 01-3 3.87" />
                          </svg>
                          Last Sign In
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <tr
                        key={user.id}
                        className="transition-colors duration-150 hover:bg-blue-100/70 group cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-12 w-12 relative">
                              {user.imageUrl ? (
                                <Image
                                  height={300}
                                  width={300}
                                  className={`h-12 w-12 rounded-full border-2 shadow-sm object-cover transition ${
                                    user.publicMetadata?.role === "admin" 
                                      ? "border-red-400 group-hover:border-red-500" 
                                      : user.publicMetadata?.role === "student" 
                                      ? "border-blue-400 group-hover:border-blue-500" 
                                      : "border-gray-300 group-hover:border-gray-400"
                                  }`}
                                  src={user.imageUrl}
                                  alt={
                                    `${user.firstName || ""} ${
                                      user.lastName || ""
                                    }`.trim() || "User"
                                  }
                                />
                              ) : (
                                <div
                                  className={`h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-sm transition ${
                                    user.publicMetadata?.role === "admin" 
                                      ? "bg-gradient-to-br from-red-200 to-red-400 border-red-400 group-hover:border-red-500" 
                                      : user.publicMetadata?.role === "student" 
                                      ? "bg-gradient-to-br from-blue-200 to-blue-400 border-blue-400 group-hover:border-blue-500" 
                                      : "bg-gradient-to-br from-gray-200 to-gray-400 border-gray-300 group-hover:border-gray-400"
                                  }`}
                                >
                                  <span className="text-lg font-bold text-white drop-shadow">
                                    {user.firstName?.[0]?.toUpperCase() ||
                                      user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
                                      "?"}
                                  </span>
                                </div>
                              )}
                              {/* Role indicator badge on avatar */}
                              {user.publicMetadata?.role === "admin" && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736L3 15.152l-1.254.716a1 1 0 11-.992-1.736L2 13.42V12a1 1 0 011-1zm14 0a1 1 0 011 1v1.42l1.254.716a1 1 0 11-.992 1.736L17 15.152l-1.246.712a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 4.504a1 1 0 01.372-1.364L9 13.428l1.246.712a1 1 0 11-.992 1.736L9 15.152l-.254.145a1 1 0 01-1.364-.372zm7.236 0a1 1 0 01-1.364-.372L13 14.848l-.254.145a1 1 0 11-.992-1.736L13 12.545l1.246.712a1 1 0 01.372 1.364z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                              {user.publicMetadata?.role === "student" && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-base font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.firstName ||
                                    user.lastName || (
                                      <span className="italic text-gray-400">
                                        No name
                                      </span>
                                    )}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5 select-all font-mono tracking-tight">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-medium text-sm">
                              {user.role
                                ? String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)
                                : <span className="italic text-gray-300">No role</span>
                              }
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium text-sm select-all">
                              {user.emailAddresses[0]?.emailAddress || (
                                <span className="italic text-gray-300">No email</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-block bg-gray-50 px-2 py-0.5 rounded">
                            {formatDistanceToNow(new Date(user.createdAt))}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastSignInAt ? (
                            <span className="inline-block bg-gray-50 px-2 py-0.5 rounded">
                              {formatDistanceToNow(new Date(user.lastSignInAt))}
                            </span>
                          ) : (
                            <span className="italic text-gray-300">Never</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>  
        </Card>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
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