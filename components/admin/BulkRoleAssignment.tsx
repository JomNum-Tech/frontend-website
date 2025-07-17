import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  UserCheck,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserRole, BulkRoleUpdateResponse } from "@/types/admin/roles";
import { ClerkUserWithRole } from "@/types/admin/roles";
import { useBulkRoleManagement } from "@/hooks/useBulkRoleManagement";
import { useRoleManagement } from "@/hooks/useRoleManagement";

import Image from "next/image";

interface BulkRoleAssignmentProps {
  users: ClerkUserWithRole[];
  onSuccess?: () => void;
}

export function BulkRoleAssignment({
  users,
  onSuccess,
}: BulkRoleAssignmentProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("normal");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [result, setResult] = useState<BulkRoleUpdateResponse | null>(null);
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();
  const { getRoleDisplayName, getRoleColorClass, getValidRoles } =
    useRoleManagement();
  const {
    bulkUpdateRoles,
    migrateUsersToDefaultRoles,
    isProcessing,
    isMigrating,
    error,
  } = useBulkRoleManagement({
    onSuccess: (result) => {
      setResult(result);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  // Filter users based on selected role and search term
  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch =
      searchTerm === "" ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailAddresses?.[0]?.emailAddress
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Update selected users when filter changes
  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  }, [filterRole, searchTerm, selectAll, filteredUsers]);

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual user selection
  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      setSelectAll(false);
    }
  };

  // Handle bulk role update
  const handleBulkUpdate = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to update.",
        variant: "destructive",
      });
      return;
    }

    await bulkUpdateRoles(selectedUsers, selectedRole);
  };

  // Handle migration of users without roles
  const handleMigration = async () => {
    await migrateUsersToDefaultRoles();
  };

  // Reset filters
  const resetFilters = () => {
    setFilterRole("all");
    setSearchTerm("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Role Assignment</CardTitle>
        <CardDescription>
          Assign roles to multiple users at once or migrate existing users to
          default roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filter and Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Role Filter */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="filter-role" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter by Role
              </Label>
              <Select
                value={filterRole}
                onValueChange={(value) =>
                  setFilterRole(value as UserRole | "all")
                }
              >
                <SelectTrigger id="filter-role">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All Roles</SelectItem>
                  {getValidRoles().map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="search-users" className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Users
              </Label>
              <div className="relative">
                <input
                  id="search-users"
                  type="text"
                  className="w-full p-2 pl-8 border rounded-md"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchTerm && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <svg
                      className="h-4 w-4"
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
                )}
              </div>
            </div>

            {/* Role to Assign */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="role-select" className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                Role to Assign
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {getValidRoles().map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Status and Reset */}
          {(filterRole !== "all" || searchTerm) && (
            <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
              <div className="text-sm text-blue-700">
                <span className="font-medium">Filtered:</span>{" "}
                {filterRole !== "all" && (
                  <span className="mr-2">
                    Role: {getRoleDisplayName(filterRole)}
                  </span>
                )}
                {searchTerm && <span>Search: {searchTerm}</span>}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-blue-700"
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* User Selection */}
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
                <Label htmlFor="select-all" className="font-medium">
                  Select All{" "}
                  {filteredUsers.length > 0 ? `(${filteredUsers.length})` : ""}
                </Label>
              </div>
              <div className="text-sm text-gray-500">
                {selectedUsers.length} of {filteredUsers.length} selected
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto mt-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 py-2 hover:bg-gray-50 rounded-md px-2"
                  >
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleUserSelect(user.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`user-${user.id}`}
                      className="flex items-center flex-1 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <Image
                          height={300}
                          width={300}
                          src={user.imageUrl || "/default-avatar.png"}
                          alt={`${user.firstName || ""} ${user.lastName || ""}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {user.firstName || ""} {user.lastName || ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.emailAddresses?.[0]?.emailAddress || "No email"}
                        </p>
                      </div>
                      <span
                        className={`ml-2 text-xs px-2 py-1 rounded-full ${getRoleColorClass(
                          user.role
                        )}`}
                      >
                        {getRoleDisplayName(user.role)}
                      </span>
                    </Label>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No users match the current filters</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="mt-2"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex justify-between w-full">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isMigrating}>
                {isMigrating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Migrate Users Without Roles
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Migrate Users</AlertDialogTitle>
                <AlertDialogDescription>
                  This will assign the default role (normal user) to all users
                  who don&apos;t have a role assigned. Are you sure you want to
                  continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMigration}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={selectedUsers.length === 0 || isProcessing}
                variant={selectedUsers.length > 0 ? "default" : "outline"}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    {selectedUsers.length > 0
                      ? `Assign ${getRoleDisplayName(selectedRole)} to ${
                          selectedUsers.length
                        } Users`
                      : "Select Users to Update"}
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Bulk Role Update</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    You are about to change the role of{" "}
                    <strong>{selectedUsers.length}</strong> users to{" "}
                    <strong>{getRoleDisplayName(selectedRole)}</strong>.
                  </p>

                  {selectedRole === "admin" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <strong>Warning:</strong>
                      </div>
                      <p className="mt-1">
                        You are assigning admin privileges to multiple users.
                        Admin users have full access to all administrative
                        functions. Please ensure this is intended.
                      </p>
                    </div>
                  )}

                  <p className="text-gray-600">
                    This action cannot be easily undone and will need to be
                    reversed manually if made in error.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkUpdate}>
                  Confirm Role Change
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Selection Summary */}
        {selectedUsers.length > 0 && (
          <div className="w-full bg-blue-50 p-3 rounded-md text-sm">
            <div className="flex items-center justify-between">
              <div className="text-blue-700">
                <span className="font-medium">{selectedUsers.length}</span>{" "}
                users selected for role change to{" "}
                <span className="font-medium">
                  {getRoleDisplayName(selectedRole)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsers([])}
                className="h-8 text-blue-700"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </CardFooter>

      {result && (
        <div className="p-4 mt-4 border-t">
          <div className="flex items-center space-x-2 mb-2">
            {result.failed.length === 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <p className="text-sm font-medium">
                Bulk update completed: {result.successful.length} of{" "}
                {result.totalProcessed} successful
              </p>
              {result.failed.length > 0 && (
                <p className="text-xs text-red-500">
                  {result.failed.length} updates failed
                </p>
              )}
            </div>
          </div>

          {/* Detailed Results */}
          {result.failed.length > 0 && (
            <div className="mt-2 border rounded-md p-3 bg-red-50">
              <h4 className="text-sm font-medium text-red-800 mb-1">
                Failed Updates
              </h4>
              <div className="max-h-32 overflow-y-auto">
                <ul className="text-xs text-red-700 space-y-1">
                  {result.failed.map((failure, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        User ID:{" "}
                        <span className="font-mono">
                          {failure.userId.substring(0, 8)}...
                        </span>{" "}
                        - {failure.error}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result.successful.length > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-green-700">
                {result.successful.length} users successfully updated
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResult(null)}
                className="text-xs text-gray-500"
              >
                Clear Results
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
