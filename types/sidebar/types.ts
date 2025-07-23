import { LucideIcon } from 'lucide-react';
import { UserRole } from '../admin/roles';

export interface AdminSidebarProps {
  className?: string;
}

export interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  requiredRole?: UserRole;
  count?: number;
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  requiredRole?: UserRole;
  badgeCount?: number;
}

export interface AdminUser {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  imageUrl?: string;
}

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
}