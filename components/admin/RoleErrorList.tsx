"use client";

import { useState } from 'react';
import { AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientRoleError } from '@/hooks/useRoleErrors';
import { RoleErrorDisplay } from './RoleErrorDisplay';

interface RoleErrorListProps {
  errors: ClientRoleError[];
  onClearAll?: () => void;
  onRetry?: () => void;
  maxVisible?: number;
}

export function RoleErrorList({
  errors,
  onClearAll,
  onRetry,
  maxVisible = 3
}: RoleErrorListProps) {
  const [showAll, setShowAll] = useState(false);
  const [dismissedErrors, setDismissedErrors] = useState<Set<number>>(new Set());

  // Filter out dismissed errors
  const visibleErrors = errors.filter((_, index) => !dismissedErrors.has(index));
  
  // Determine which errors to show based on maxVisible and showAll
  const displayErrors = showAll 
    ? visibleErrors 
    : visibleErrors.slice(0, maxVisible);
  
  // Handle dismissing a single error
  const handleDismiss = (index: number) => {
    setDismissedErrors(prev => new Set([...prev, index]));
  };

  // No errors to display
  if (errors.length === 0 || visibleErrors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
          {visibleErrors.length} {visibleErrors.length === 1 ? 'error' : 'errors'} occurred
        </h3>
        {onClearAll && (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onClearAll}
            className="text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {displayErrors.map((error, index) => (
          <RoleErrorDisplay
            key={index}
            error={error}
            onDismiss={() => handleDismiss(index)}
            onRetry={onRetry}
          />
        ))}
      </div>
      
      {/* Show more/less toggle if there are more errors than maxVisible */}
      {visibleErrors.length > maxVisible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center text-xs w-full justify-center"
        >
          {showAll ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show fewer errors
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show {visibleErrors.length - maxVisible} more {visibleErrors.length - maxVisible === 1 ? 'error' : 'errors'}
            </>
          )}
        </Button>
      )}
    </div>
  );
}