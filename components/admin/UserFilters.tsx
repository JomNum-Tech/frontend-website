"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  Shield,
  UserCheck,
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
    <div className="bg-white rounded-xl p-6 mb-8 border border-1 border-blue-200">
      <div className="flex flex-col gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={loading}
              className="block w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 transition-all"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap w-full">
            {/* Role Filter - Enhanced with better UI, role counts, and accessibility */}
            <div className="relative flex-1 min-w-[220px]">
              <label
                htmlFor="role-filter"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                <div className="flex items-center group relative">
                  {role !== "all" ? (
                    <span className="mr-2">{roleIcons[role as UserRole]}</span>
                  ) : (
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                  )}
                  <span>Role</span>
                  {roleStatsLoading && (
                    <span
                      className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </span>
                  )}

                  {/* Tooltip explaining role filtering */}
                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 pointer-events-none">
                    Filter users by their assigned role (Admin, Student, or
                    Normal User). Role counts are shown in parentheses.
                    <div className="absolute left-4 -top-2 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              </label>
              <div className="relative">
                <select
                  id="role-filter"
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={loading}
                  className={`block w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 transition-all ${
                    role !== "all" ? "border-blue-200" : "border-gray-200"
                  }`}
                  aria-label="Filter by role"
                >
                  <option value="all">
                    All Roles
                    {roleStats && roleStats.total ? ` (${roleStats.total})` : ""}
                  </option>
                  {validRoles.map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {getRoleDisplayName(roleOption)}
                      {roleStats && roleStats[roleOption] !== undefined
                        ? ` (${roleStats[roleOption]})`
                        : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {role !== "all" && roleIcons[role as UserRole]}
                </div>
              </div>

              {/* Role badges to show active role filter */}
              {role !== "all" && (
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getRoleColorClass(
                      role as UserRole
                    )} bg-opacity-10 border border-blue-200`}
                  >
                    <span className="mr-1">{roleIcons[role as UserRole]}</span>
                    {getRoleDisplayName(role as UserRole)}
                    <button
                      onClick={() => handleRoleChange("all")}
                      className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full transition"
                      aria-label={`Clear ${getRoleDisplayName(
                        role as UserRole
                      )} role filter`}
                      tabIndex={0}
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

            </div>

            {/* Sort Options */}
            <div className="flex-1 min-w-[220px]">
              <label
                htmlFor="sort-by"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Sort</span>
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
                  className="block flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 transition-all"
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
                  className="block px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:opacity-50 transition-all"
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
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-50 transition-all"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Summary - Enhanced with better visual indicators */}
        {hasActiveFilters && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
            <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-400" />
              Active Filters
              {role !== "all" && search && (
                <span className="ml-2 text-xs text-blue-500 font-normal">
                  (Multiple filters applied)
                </span>
              )}
            </h4>
            <div className="flex flex-wrap gap-2 items-center">
              {role !== "all" && (
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full ${getRoleColorClass(
                    role as UserRole
                  )} bg-opacity-10 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm`}
                >
                  <span className="mr-1">{roleIcons[role as UserRole]}</span>
                  <span>
                    {getRoleDisplayName(role as UserRole)}
                  </span>
                  <button
                    onClick={() => handleRoleChange("all")}
                    className="ml-2 text-gray-400 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full transition"
                    aria-label="Clear role filter"
                    tabIndex={0}
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
                <div className="flex items-center gap-1 px-3 py-1 bg-white text-blue-700 rounded-full border border-blue-200 text-xs font-semibold shadow-sm">
                  <Search className="h-3 w-3" />
                  <span>{search}</span>
                  <button
                    onClick={() => handleSearchChange("")}
                    className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full transition"
                    aria-label="Clear search filter"
                    tabIndex={0}
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

              <div className="flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full border border-gray-200 text-xs font-semibold shadow-sm">
                <Filter className="h-3 w-3" />
                <span>
                  {orderBy === "created_at"
                    ? "Created Date"
                    : orderBy === "last_sign_in_at"
                    ? "Last Sign In"
                    : "Email"}
                  {" "}
                  ({order === "desc" ? "newest first" : "oldest first"})
                </span>
              </div>

              <button
                onClick={clearFilters}
                className="ml-auto px-3 py-1 text-xs text-red-600 hover:text-white hover:bg-red-500 border border-red-200 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-200"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
