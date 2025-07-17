"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/types/admin/roles";
import { ClerkUserWithRole } from "@/types/admin/roles";
import { useBulkRoleManagement } from "@/hooks/useBulkRoleManagement";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { Loader2 } from "lucide-react";

interface BulkRoleManagerProps {
  users: ClerkUserWithRole[];
  onComplete?: () => void;
}

export function BulkRoleManager({ users, onComplete }: BulkRoleManagerProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>("normal");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showMigrateDialog, setShowMigrateDialog] = useState(false);
  
  const { bulkUpdateRoles, migrateUsersToDefaultRoles, isProcessing, isMigrating } = useBulkRoleManagement({
    onSuccess: () => {
      // Reset selections and call onComplete callback
      setSelectedUsers([]);
      if (onComplete) {
        onComplete();
      }
    },
  });
  
  const { getRoleDisplayName, getRoleColorClass, getValidRoles } = useRoleManagement();
  
  const validRoles = getValidRoles();
  
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };
  
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleBulkUpdate = async () => {
    setShowConfirmDialog(false);
    await bulkUpdateRoles(selectedUsers, selectedRole);
  };
  
  const handleMigrate = async () => {
    setShowMigrateDialog(false);
    await migrateUsersToDefaultRoles();
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bulk Role Management</CardTitle>
          <CardDescription>
            Assign roles to multiple users at once or migrate existing users without roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all" 
                checked={selectedUsers.length > 0 && selectedUsers.length === users.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {selectedUsers.length === 0 ? "Select All" : 
                 selectedUsers.length === users.length ? "Deselect All" : 
                 `Selected ${selectedUsers.length} of ${users.length}`}
              </label>
            </div>
            
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              <div className="space-y-2">
                {users.map(user => (
                  <div key={user.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                    <Checkbox 
                      id={`user-${user.id}`} 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                    <label htmlFor={`user-${user.id}`} className="flex-1 text-sm">
                      <span className="font-medium">{user.firstName} {user.lastName}</span>
                      <span className="text-gray-500 ml-2">{user.emailAddresses?.[0]?.emailAddress}</span>
                      {user.role && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getRoleColorClass(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No users available</div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Select Role to Assign</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                >
                  {validRoles.map(role => (
                    <option key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end space-x-2">
                <Button 
                  variant="default" 
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={selectedUsers.length === 0 || isProcessing}
                  className="flex-1 sm:flex-none"
                >
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Assign Role
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {selectedUsers.length > 0 ? `${selectedUsers.length} users selected` : "Select users to update"}
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowMigrateDialog(true)}
            disabled={isMigrating}
          >
            {isMigrating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Migrate Users Without Roles
          </Button>
        </CardFooter>
      </Card>
      
      {/* Confirmation Dialog for Bulk Update */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Update</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change the role of {selectedUsers.length} users to{" "}
              <strong>{getRoleDisplayName(selectedRole)}</strong>. This action cannot be undone.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkUpdate}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirmation Dialog for Migration */}
      <AlertDialog open={showMigrateDialog} onOpenChange={setShowMigrateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Migration</AlertDialogTitle>
            <AlertDialogDescription>
              This will assign the default role (Normal User) to all users who currently don&apos; t have a role assigned.
              This action cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleMigrate}>
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}