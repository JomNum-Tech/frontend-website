"use client";

import { useState } from 'react';
import { AlertCircle, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientRoleError, RoleErrorCategory } from '@/hooks/useRoleErrors';

interface RoleErrorDisplayProps {
  error: ClientRoleError;
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export function RoleErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showDetails = false
}: RoleErrorDisplayProps) {
  const [expanded, setExpanded] = useState(showDetails);

  // Get appropriate styling based on error category
  const getErrorStyles = (category: RoleErrorCategory) => {
    switch (category) {
      case RoleErrorCategory.PERMISSION:
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case RoleErrorCategory.VALIDATION:
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case RoleErrorCategory.NETWORK:
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case RoleErrorCategory.SERVER:
        return 'bg-red-50 border-red-200 text-red-800';
      case RoleErrorCategory.UNKNOWN:
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Get appropriate icon color based on error category
  const getIconColor = (category: RoleErrorCategory) => {
    switch (category) {
      case RoleErrorCategory.PERMISSION:
        return 'text-amber-500';
      case RoleErrorCategory.VALIDATION:
        return 'text-blue-500';
      case RoleErrorCategory.NETWORK:
        return 'text-purple-500';
      case RoleErrorCategory.SERVER:
        return 'text-red-500';
      case RoleErrorCategory.UNKNOWN:
      default:
        return 'text-gray-500';
    }
  };

  // Get user-friendly title for error category
  const getErrorTitle = (category: RoleErrorCategory): string => {
    switch (category) {
      case RoleErrorCategory.PERMISSION:
        return 'Permission Denied';
      case RoleErrorCategory.VALIDATION:
        return 'Invalid Input';
      case RoleErrorCategory.NETWORK:
        return 'Network Error';
      case RoleErrorCategory.SERVER:
        return 'Server Error';
      case RoleErrorCategory.UNKNOWN:
      default:
        return 'Error';
    }
  };

  // Get user-friendly description for error category
  const getErrorDescription = (category: RoleErrorCategory): string => {
    switch (category) {
      case RoleErrorCategory.PERMISSION:
        return 'You do not have permission to perform this action.';
      case RoleErrorCategory.VALIDATION:
        return 'The provided input is invalid.';
      case RoleErrorCategory.NETWORK:
        return 'A network error occurred. Please check your connection.';
      case RoleErrorCategory.SERVER:
        return 'The server encountered an error processing your request.';
      case RoleErrorCategory.UNKNOWN:
      default:
        return 'An unexpected error occurred.';
    }
  };

  // Get appropriate action button based on error category
  const getActionButton = (category: RoleErrorCategory) => {
    if (category === RoleErrorCategory.NETWORK && onRetry) {
      return (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onRetry}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-md border p-4 mb-4 ${getErrorStyles(error.category)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-5 w-5 ${getIconColor(error.category)}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {getErrorTitle(error.category)}
          </h3>
          <div className="mt-1 text-sm">
            <p>{error.message || getErrorDescription(error.category)}</p>
          </div>
          
          {/* Additional error details that can be expanded */}
          {(error.userId || error.role || error.statusCode || error.details) && (
            <div className="mt-2">
              <button
                type="button"
                className="flex items-center text-xs font-medium underline"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show details
                  </>
                )}
              </button>
              
              {expanded && (
                <div className="mt-2 text-xs space-y-1 border-t pt-2 border-opacity-20">
                  {error.userId && (
                    <p><span className="font-medium">User ID:</span> {error.userId}</p>
                  )}
                  {error.role && (
                    <p><span className="font-medium">Role:</span> {error.role}</p>
                  )}
                  {error.statusCode && (
                    <p><span className="font-medium">Status Code:</span> {error.statusCode}</p>
                  )}
                  {error.details && (
                    <div>
                      <p className="font-medium">Details:</p>
                      <pre className="mt-1 whitespace-pre-wrap bg-white bg-opacity-20 p-2 rounded overflow-auto max-h-32">
                        {error.details}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-3 flex gap-2 items-center justify-end">
            {getActionButton(error.category)}
            {onDismiss && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onDismiss}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}