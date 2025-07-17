"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  Shield,
  UserCheck,
  PieChart,
} from "lucide-react";
import { UserFilters } from "@/types/admin/users";
import { UserRole } from "@/types/admin/roles";
import { useRoleManagement } from "@/hooks/useRoleManagement";

interface UserFiltersProps {
  onFiltersChange: (filters: UserFilters) => void;
  loading?: boolean;
  initialFilters?: UserFilters;
  roleStats?: Record<string, number>;
  /**
   * Flag to indicate if role statistics are currently loading
   */
  roleStatsLoading?: boolean;
}

export function UserFiltersComponent({
  onFiltersChange,
  loading,
  initialFilters,
  roleStats,
  roleStatsLoading = false,
}: UserFiltersProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [orderBy, setOrderBy] = useState<
    "created_at" | "last_sign_in_at" | "email_address"
  >(initialFilters?.orderBy || "created_at");
  const [order, setOrder] = useState<"asc" | "desc">(
    initialFilters?.order || "desc"
  );
  const [role, setRole] = useState<UserRole | "all">(
    (initialFilters?.role as UserRole) || "all"
  );

  const { getValidRoles, getRoleDisplayName, getRoleColorClass } =
    useRoleManagement();
  const validRoles = getValidRoles();

  // Role icons mapping
  const roleIcons = useMemo(
    () => ({
      admin: <Shield className="h-4 w-4" />,
      student: <UserCheck className="h-4 w-4" />,
      normal: <Users className="h-4 w-4" />,
    }),
    []
  );

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onFiltersChange({
        search: search || undefined,
        orderBy,
        order,
        role: role !== "all" ? role : undefined,
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [search, orderBy, order, role, onFiltersChange]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleOrderByChange = (
    value: "created_at" | "last_sign_in_at" | "email_address"
  ) => {
    setOrderBy(value);
    // Immediate update for sort
    onFiltersChange({
      search: search || undefined,
      orderBy: value,
      order,
      role: role !== "all" ? role : undefined,
    });
  };

  const handleOrderChange = (value: "asc" | "desc") => {
    setOrder(value);
    // Immediate update for sort
    onFiltersChange({
      search: search || undefined,
      orderBy,
      order: value,
      role: role !== "all" ? role : undefined,
    });
  };

  const handleRoleChange = (value: string) => {
    const newRole = value as UserRole | "all";
    setRole(newRole);
    // Immediate update for role filter
    onFiltersChange({
      search: search || undefined,
      orderBy,
      order,
      role: newRole !== "all" ? newRole : undefined,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setOrderBy("created_at");
    setOrder("desc");
    setRole("all");

    onFiltersChange({
      search: undefined,
      orderBy: "created_at",
      order: "desc",
      role: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    !!search || orderBy !== "created_at" || order !== "desc" || role !== "all";

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            {/* Role Filter - Enhanced with better UI, role counts, and accessibility */}
            <div className="relative flex-1 min-w-[200px]">
              <label
                htmlFor="role-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <div className="flex items-center group relative">
                  {role !== "all" ? (
                    roleIcons[role as UserRole]
                  ) : (
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span>Filter by Role</span>
                  {roleStatsLoading && (
                    <span
                      className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </span>
                  )}

                  {/* Tooltip explaining role filtering */}
                  <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                    Filter users by their assigned role (Admin, Student, or
                    Normal User). Role counts are shown in parentheses.
                    <div className="absolute left-4 -top-1 border-4 border-transparent border-b-gray-800"></div>
                  </div>
                </div>
              </label>
              <div className="relative">
                <select
                  id="role-filter"
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={loading}
                  className={`block w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${
                    role !== "all" ? "border-blue-300" : "border-gray-300"
                  }`}
                  aria-label="Filter by role"
                >
                  <option value="all">
                    All Roles{" "}
                    {roleStats && roleStats.total ? `(${roleStats.total})` : ""}
                  </option>
                  {validRoles.map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {getRoleDisplayName(roleOption)}{" "}
                      {roleStats && roleStats[roleOption] !== undefined
                        ? `(${roleStats[roleOption]})`
                        : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  {role !== "all" && roleIcons[role as UserRole]}
                </div>
              </div>

              {/* Role badges to show active role filter */}
              {role !== "all" && (
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColorClass(
                      role as UserRole
                    )}`}
                  >
                    <span className="mr-1">{roleIcons[role as UserRole]}</span>
                    {getRoleDisplayName(role as UserRole)}
                    <button
                      onClick={() => handleRoleChange("all")}
                      className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 rounded-full"
                      aria-label={`Clear ${getRoleDisplayName(
                        role as UserRole
                      )} role filter`}
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

              {/* Role filter description with stats */}
              <div className="mt-1 text-xs text-gray-500 flex items-center">
                {role === "all" ? (
                  <>
                    <span>Showing users with any role</span>
                    {roleStats && !roleStatsLoading && (
                      <span className="ml-1 flex items-center">
                        <PieChart className="h-3 w-3 ml-1 mr-1" />
                        {Object.entries(roleStats)
                          .filter(
                            ([key]) =>
                              key !== "total" &&
                              validRoles.includes(key as UserRole)
                          )
                          .map(([key, count]) => (
                            <span
                              key={key}
                              className="mx-1"
                              title={`${getRoleDisplayName(
                                key as UserRole
                              )}: ${count}`}
                            >
                              {count} {key.charAt(0).toUpperCase()}
                            </span>
                          ))}
                      </span>
                    )}
                  </>
                ) : (
                  `Filtering to only show ${getRoleDisplayName(
                    role as UserRole
                  ).toLowerCase()} users ${
                    roleStats && roleStats[role] !== undefined
                      ? `(${roleStats[role]} total)`
                      : ""
                  }`
                )}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="sort-by"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-500 mr-1" />
                  <span>Sort By</span>
                </div>
              </label>
              <div className="flex gap-2">
                <select
                  id="sort-by"
                  value={orderBy}
                  onChange={(e) =>
                    handleOrderByChange(
                      e.target.value as
                        | "created_at"
                        | "last_sign_in_at"
                        | "email_address"
                    )
                  }
                  disabled={loading}
                  className="block flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="created_at">Created Date</option>
                  <option value="last_sign_in_at">Last Sign In</option>
                  <option value="email_address">Email</option>
                </select>

                <select
                  value={order}
                  onChange={(e) =>
                    handleOrderChange(e.target.value as "asc" | "desc")
                  }
                  disabled={loading}
                  className="block px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  aria-label="Sort order"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Summary - Enhanced with better visual indicators */}
        {hasActiveFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Active Filters:
              {role !== "all" && search && (
                <span className="ml-2 text-xs text-blue-600 font-normal">
                  (Multiple filters are combined to narrow results)
                </span>
              )}
            </h4>
            <div className="flex flex-wrap gap-2">
              {role !== "all" && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md ${getRoleColorClass(
                    role as UserRole
                  )}`}
                >
                  <span className="mr-1">{roleIcons[role as UserRole]}</span>
                  <span className="text-sm font-medium">
                    {getRoleDisplayName(role as UserRole)}
                  </span>
                  <button
                    onClick={() => handleRoleChange("all")}
                    className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Clear role filter"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {search && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                  <Search className="h-3 w-3" />
                  <span className="text-sm">{search}</span>
                  <button
                    onClick={() => handleSearchChange("")}
                    className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Clear search filter"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md border border-gray-300">
                <Filter className="h-3 w-3" />
                <span className="text-sm">
                  {orderBy === "created_at"
                    ? "Created Date"
                    : orderBy === "last_sign_in_at"
                    ? "Last Sign In"
                    : "Email"}
                  ({order === "desc" ? "newest first" : "oldest first"})
                </span>
              </div>

              <button
                onClick={clearFilters}
                className="ml-auto px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:underline focus:outline-none"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
