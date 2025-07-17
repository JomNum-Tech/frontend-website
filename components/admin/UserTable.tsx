"use client";

import { ClerkUser } from '@/types/admin/users';
import { UserRole } from '@/types/admin/roles';
import { RoleSelector } from './RoleSelector';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import Image from "next/image";

// Simple date formatting utility
const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

interface UserTableProps {
  users: ClerkUser[];
  loading?: boolean;
  onUserUpdated?: () => void;
}

export function UserTable({ users, loading, onUserUpdated }: UserTableProps) {
  // Initialize the role management hook
  const { getRoleDisplayName, getRoleColorClass } = useRoleManagement({
    onSuccess: (userId, newRole) => {
      // This will be called when a role is successfully updated
      console.log(`Role updated for user ${userId} to ${newRole}`);
      // Trigger refresh of user data if callback provided
      if (onUserUpdated) {
        onUserUpdated();
      }
    }
  });
  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl">
        <div className="px-8 py-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 tracking-tight">Users</h3>
        </div>
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
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl">
        <div className="px-8 py-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 tracking-tight">Users</h3>
        </div>
        <div className="p-8 text-center text-gray-400 text-lg">
          <span className="inline-block mb-2 text-3xl">😕</span>
          <div>No users found.</div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp));
  };

  const getStatusBadge = (user: ClerkUser) => {
    if (user.banned) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full border border-red-200">
          <span className="h-2 w-2 bg-red-400 rounded-full inline-block"></span>
          Banned
        </span>
      );
    }
    if (user.locked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
          <span className="h-2 w-2 bg-yellow-400 rounded-full inline-block"></span>
          Locked
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full border border-green-200">
        <span className="h-2 w-2 bg-green-400 rounded-full inline-block"></span>
        Active
      </span>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="px-8 flex justify-between py-5 border-b border-gray-100">
        <h3 className="text-xl font-bold text-blue-900 tracking-tight">
          Users
        </h3>
        <div className="flex items-center gap-2 rounded-lg border-1 border border-blue-900 bg-white px-6 py-1">
          <span className="text-lg font-semibold text-blue-900 tracking-tigh italic">Total {users.length}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Username
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0zm0 0v1a4 4 0 01-8 0v-1" /></svg>
                  Email
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  Status
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                <span className="flex items-center gap-1 group relative">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  User Role
                  {/* Tooltip for role management column */}
                  <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                    Manage user roles and permissions. Click the dropdown to change a user&apos;s role.
                    <div className="absolute left-4 -top-1 border-4 border-transparent border-b-gray-800"></div>
                  </div>
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
                  Created
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-3-3.87M9 17a4 4 0 01-3-3.87V7a4 4 0 014-4h2a4 4 0 014 4v6a4 4 0 01-3 3.87" /></svg>
                  Last Sign In
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className={`transition-colors duration-150 hover:bg-blue-100/70 group cursor-pointer ${
                  user.publicMetadata?.role === 'admin' 
                    ? 'bg-red-50 border-l-4 border-red-400 shadow-sm shadow-red-100' : 
                  user.publicMetadata?.role === 'student' 
                    ? 'bg-blue-50 border-l-4 border-blue-400 shadow-sm shadow-blue-100' : 
                  'border-l-4 border-transparent'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-12 w-12 relative">
                      {user.imageUrl ? (
                        <Image
                          height={300}
                          width={300}
                          className={`h-12 w-12 rounded-full border-2 shadow-sm object-cover transition ${
                            user.publicMetadata?.role === 'admin' 
                              ? 'border-red-400 group-hover:border-red-500' 
                              : user.publicMetadata?.role === 'student'
                              ? 'border-blue-400 group-hover:border-blue-500'
                              : 'border-gray-300 group-hover:border-gray-400'
                          }`}
                          src={user.imageUrl}
                          alt={`${user.firstName || ''} ${user.lastName || ''}`.trim() || "User"}
                        />
                      ) : (
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-sm transition ${
                          user.publicMetadata?.role === 'admin' 
                            ? 'bg-gradient-to-br from-red-200 to-red-400 border-red-400 group-hover:border-red-500' 
                            : user.publicMetadata?.role === 'student'
                            ? 'bg-gradient-to-br from-blue-200 to-blue-400 border-blue-400 group-hover:border-blue-500'
                            : 'bg-gradient-to-br from-gray-200 to-gray-400 border-gray-300 group-hover:border-gray-400'
                        }`}>
                          <span className="text-lg font-bold text-white drop-shadow">
                            {user.firstName?.[0]?.toUpperCase() ||
                              user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
                              '?'}
                          </span>
                        </div>
                      )}
                      {/* Role indicator badge on avatar */}
                      {user.publicMetadata?.role === 'admin' && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736L3 15.152l-1.254.716a1 1 0 11-.992-1.736L2 13.42V12a1 1 0 011-1zm14 0a1 1 0 011 1v1.42l1.254.716a1 1 0 11-.992 1.736L17 15.152l-1.246.712a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 4.504a1 1 0 01.372-1.364L9 13.428l1.246.712a1 1 0 11-.992 1.736L9 15.152l-.254.145a1 1 0 01-1.364-.372zm7.236 0a1 1 0 01-1.364-.372L13 14.848l-.254.145a1 1 0 11-.992-1.736L13 12.545l1.246.712a1 1 0 01.372 1.364z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {user.publicMetadata?.role === 'student' && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName || user.lastName || <span className="italic text-gray-400">No name</span>
                        }
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 select-all font-mono tracking-tight">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium text-sm select-all">
                      {user.emailAddresses[0]?.emailAddress || <span className="italic text-gray-300">No email</span>}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {/* Enhanced Role badge with pulsing effect for admin */}
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-md shadow-sm transition-all ${
                      user.publicMetadata?.role === 'admin' 
                        ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-300 ring-2 ring-red-200 ring-opacity-50' 
                        : user.publicMetadata?.role === 'student'
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-300'
                    }`}>
                      <div className="relative">
                        {user.publicMetadata?.role === 'admin' && (
                          <>
                            <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-30"></div>
                            <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                            </svg>
                          </>
                        )}
                        {user.publicMetadata?.role === 'student' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                          </svg>
                        )}
                        {(!user.publicMetadata?.role || user.publicMetadata?.role === 'normal') && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-semibold ml-1">
                        {getRoleDisplayName((user.publicMetadata?.role as UserRole) || 'normal')}
                      </span>
                    </div>
                    
                    {/* Role change timestamp indicator */}
                    {user.publicMetadata?.role === 'admin' && (
                      <div className="flex items-center gap-1 text-xs text-red-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="italic">recently changed</span>
                      </div>
                    )}
                    
                    {/* Enhanced Role selector with better tooltip */}
                    <div className="relative group ml-auto">
                      <RoleSelector
                        user={user}
                        currentRole={(user.publicMetadata?.role as UserRole) || 'normal'}
                        onRoleUpdated={(userId, newRole) => {
                          console.log(`Role updated for ${userId} to ${newRole}`);
                          if (onUserUpdated) {
                            onUserUpdated();
                          }
                        }}
                        disabled={user.banned || user.locked}
                      />
                      
                      {/* Enhanced tooltip with role descriptions */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                        <div className="font-semibold mb-1 text-sm">Role Information</div>
                        {user.publicMetadata?.role === 'admin' 
                          ? 'Admin users have full access to all administrative functions and can manage other users.'
                          : user.publicMetadata?.role === 'student'
                          ? 'Student users have access to learning materials and can submit assignments.'
                          : 'Normal users have basic access to the platform features.'
                        }
                        <div className="mt-2 pt-2 border-t border-gray-700 text-gray-300">
                          Click to change this user&apos;s role
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-block bg-gray-50 px-2 py-0.5 rounded">
                    {formatDate(user.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastSignInAt ? (
                    <span className="inline-block bg-gray-50 px-2 py-0.5 rounded">
                      {formatDate(user.lastSignInAt)}
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
    </div>
  );
}