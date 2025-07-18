"use client";

import { useState } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { UserRole } from '@/types/admin/roles';
import { ClerkUser } from '@/types/admin/users';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface RoleSelectorProps {
  user: ClerkUser;
  currentRole: UserRole;
  onRoleUpdated: (userId: string, newRole: UserRole) => void;
  disabled?: boolean;
}

export function RoleSelector({ 
  user, 
  currentRole, 
  onRoleUpdated, 
  disabled = false 
}: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  
  // Use our role management hook
  const { 
    updateUserRole, 
    isUpdatingRole, 
    getRoleDisplayName, 
    getRoleColorClass, 
    getValidRoles 
  } = useRoleManagement({
    onSuccess: (userId, newRole) => {
      setSelectedRole(newRole);
      onRoleUpdated(userId, newRole);
    }
  });
  
  // Get loading state for this specific user
  const isLoading = isUpdatingRole(user.id);
  
  // Get all valid roles
  const validRoles = getValidRoles();

  // Handle role selection from dropdown
  const handleRoleSelect = (role: UserRole) => {
    if (role === currentRole) return;
    
    // For admin role changes, always show confirmation
    if (role === 'admin' || currentRole === 'admin') {
      setPendingRole(role);
      setShowConfirmDialog(true);
    } else {
      // For non-admin role changes, proceed directly
      handleRoleUpdate(role);
    }
  };

  // Handle confirmation dialog confirm action
  const handleConfirm = () => {
    if (pendingRole) {
      handleRoleUpdate(pendingRole);
    }
    setShowConfirmDialog(false);
    setPendingRole(null);
  };

  // Handle confirmation dialog cancel action
  const handleCancel = () => {
    setShowConfirmDialog(false);
    setPendingRole(null);
  };

  // Update user role via our hook
  const handleRoleUpdate = async (newRole: UserRole) => {
    const success = await updateUserRole(user.id, newRole);
    
    // If update failed, reset to current role
    if (!success) {
      setSelectedRole(currentRole);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled || isLoading}>
          <Button 
            variant="outline" 
            className={`min-w-[120px] ${getRoleColorClass(selectedRole)} border`}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {getRoleDisplayName(selectedRole)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {validRoles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={role === selectedRole ? 'bg-muted' : ''}
            >
              {getRoleDisplayName(role)}
              {role === selectedRole && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRole === 'admin' 
                ? `Are you sure you want to grant admin privileges to ${user.firstName || 'this user'}? This will give them full access to the admin dashboard and all administrative functions.`
                : `Are you sure you want to remove admin privileges from ${user.firstName || 'this user'}? They will no longer have access to the admin dashboard.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}