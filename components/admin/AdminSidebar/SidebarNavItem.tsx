"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SidebarNavItemProps } from '../../../types/sidebar/types';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Badge } from '@/components/ui/badge';

export function SidebarNavItem({ 
  href, 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick,
  requiredRole
}: SidebarNavItemProps) {
  const { userRole } = useAdminRole();
  
  // Check if the user has access to this navigation item
  const hasAccess = !requiredRole || userRole === requiredRole;
  
  if (!hasAccess) {
    return null;
  }
  
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 rounded-lg mx-2",
        isActive && "bg-blue-600 text-white hover:bg-blue-700"
      )}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
      {requiredRole && (
        <Badge variant="outline" className="ml-auto text-xs bg-blue-900/30 border-blue-700 text-blue-300">
          {requiredRole}
        </Badge>
      )}
    </Link>
  );
}