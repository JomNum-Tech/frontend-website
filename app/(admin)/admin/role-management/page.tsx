"use client";

import { useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { BulkRoleAssignment } from '@/components/admin/BulkRoleAssignment';
import { RoleStats } from '@/components/admin/RoleStats';
import { UserFiltersComponent } from '@/components/admin/UserFilters';
import { Pagination } from '@/components/admin/Pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, RefreshCw, AlertCircle, Users, UserCheck, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBulkRoleManagement } from '@/hooks/useBulkRoleManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RoleManagementPage() {
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();
  
  const {
    users,
    loading,
    error,
    totalCount,
    currentPage,
    updateFilters,
    loadPage,
    refresh,
  } = useUsers();
  
  const { migrateUsersToDefaultRoles, isMigrating } = useBulkRoleManagement({
    onSuccess: (result) => {
      setMigrationResult({
        success: true,
        message: `Successfully migrated ${result.successful.length} users. ${result.failed.length} failed.`
      });
      refresh();
    }
  });
  
  const handleMigration = async () => {
    try {
      await migrateUsersToDefaultRoles();
    } catch (error) {
      setMigrationResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
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
              <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight">Role Management</h1>
              <p className="mt-2 text-base text-gray-500">
                Manage user roles in bulk and migrate existing users to default roles.
              </p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className={`group relative inline-flex items-center px-5 py-2.5 rounded-lg shadow transition-all duration-200
                text-sm font-semibold
                ${loading
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              `}
              aria-busy={loading}
            >
              <span className="flex items-center">
                <RefreshCw className={`h-5 w-5 mr-2 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:rotate-[-20deg]'}`} />
                <span>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </span>
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
        
        {/* Migration Card */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                Role Migration Utility
              </CardTitle>
              <CardDescription>
                Assign default roles to users who don&apos;t have roles assigned yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  This utility will scan all users in your system and assign the default role (Normal User) to any user who doesn&apos;t have a role assigned.
                  This is useful when implementing role-based access control for the first time or after adding new users through other means.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Note:</span> This operation cannot be undone. Make sure you want to assign default roles to all users without roles.
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default" disabled={isMigrating}>
                        {isMigrating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Migrating...
                          </>
                        ) : (
                          "Run Migration"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Role Migration</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will assign the default role (Normal User) to all users who don&apos;t have a role assigned.
                          This action cannot be undone. Are you sure you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMigration}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                {migrationResult && (
                  <div className={`mt-4 p-3 rounded-md ${migrationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center">
                      {migrationResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <p className={`text-sm ${migrationResult.success ? 'text-green-700' : 'text-red-700'}`}>
                        {migrationResult.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <UserFiltersComponent 
          onFiltersChange={updateFilters} 
          loading={loading} 
        />

        {/* Bulk Role Assignment with Tabs */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Role Assignment</CardTitle>
              <CardDescription>
                Assign roles to multiple users at once with validation and confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="enhanced" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="enhanced">Enhanced Version</TabsTrigger>
                  <TabsTrigger value="standard">Standard Version</TabsTrigger>
                </TabsList>
                
                <TabsContent value="standard">
                  <BulkRoleAssignment 
                    users={users.map(user => ({
                      ...user,
                      role: (user.publicMetadata?.role as 'admin' | 'student' | 'normal') || 'normal',
                      publicMetadata: {
                        ...user.publicMetadata,
                        role: (user.publicMetadata?.role as 'admin' | 'student' | 'normal') || 'normal'
                      }
                    }))} 
                    onSuccess={refresh} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

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