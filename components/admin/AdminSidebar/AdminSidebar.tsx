"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Users, LogOut, Menu, X, BarChart, HammerIcon, Table, FolderOpen, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./SidebarNavItem";
import { AdminSidebarProps, NavItem } from "../../../types/sidebar/types";
import { useAdminRole } from "@/hooks/useAdminRole";
import { UserRole } from "@/types/admin/roles";

import Image from "next/image";

// Define role-based navigation items
const getNavItems = (role: UserRole): (NavItem & { showComingSoonBadge?: boolean })[] => {
  // Base navigation items available to all admin users
  const baseItems: (NavItem & { showComingSoonBadge?: boolean })[] = [
    {
      href: "/admin/users",
      label: "Overview",
      icon: Users,
    },
    {
      href: "/admin/list-table",
      label: "Users",
      icon: Table, 
    },
    {
      href: "/admin/role-stats",
      label: "Roles",
      icon: BarChart, 
    },
    {
      href: "/admin/storage",
      label: "Storage",
      icon: FolderOpen,
    },
    {
      href: "/admin/resources",
      label: "Resources",
      icon: Book,
    },
    {
      href: "#",
      label: "",
      icon: HammerIcon, // Changed icon to BarChart for coming soon
      showComingSoonBadge: true, // Use a local property for badge display
    },
  ];

  return baseItems.filter(
    (item) => !item.requiredRole || item.requiredRole === role
  );
};

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { userRole, getRoleDisplayName, isLoadingRole } = useAdminRole();

  const navItems = getNavItems(userRole);

  const handleLogout = () => {
    signOut();
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {user?.imageUrl ? (
                <Image
                  height={300}
                  width={300}
                  src={user.imageUrl}
                  alt="Admin avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.firstName?.[0] ||
                      user?.emailAddresses?.[0]?.emailAddress?.[0] ||
                      "A"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.emailAddresses?.[0]?.emailAddress || "Admin User"}
                </p>
                <p className="text-xs text-gray-400">
                  {isLoadingRole ? "Loading..." : getRoleDisplayName(userRole)}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isComingSoon = item.showComingSoonBadge;
                // Always pass a string to label prop, never JSX
                const label = isComingSoon
                  ? `${item.label} (Coming Soon)`
                  : item.label;
                return (
                  <div
                    key={item.href}
                    className={isComingSoon ? "opacity-50 pointer-events-none select-none" : ""}
                  >
                    <SidebarNavItem
                      href={item.href}
                      icon={item.icon}
                      label={label}
                      isActive={pathname === item.href}
                      onClick={closeMobileSidebar}
                      requiredRole={item.requiredRole}
                    />
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Logout Section */}
          <div className="p-4 mb-10 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
