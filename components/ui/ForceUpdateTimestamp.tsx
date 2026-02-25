'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { parseTimestamp } from '@/lib/utils/dateUtils';

interface ForceUpdateTimestampProps {
  timestamp: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  updateInterval?: number;
  showDebug?: boolean;
}

export function ForceUpdateTimestamp({ 
  timestamp, 
  prefix = '', 
  suffix = '', 
  className = '',
  updateInterval = 30000,
  showDebug = false
}: ForceUpdateTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const lastUpdateRef = useRef<Date>(new Date());

  const forceUpdate = useCallback(() => {
    if (!mountedRef.current) return;
    
    try {
      const now = new Date();
      const parsedDate = parseTimestamp(timestamp);
      const formatted = formatDistanceToNow(parsedDate, { addSuffix: true });
      
      setDisplayTime(`${prefix}${formatted}${suffix}`);
      setUpdateCount(prev => prev + 1);
      lastUpdateRef.current = now;
      
      if (showDebug || process.env.NODE_ENV === 'development') {
        console.log(`[ForceUpdateTimestamp] Update #${updateCount + 1}:`, {
          timestamp,
          parsedDate: parsedDate.toISOString(),
          now: now.toISOString(),
          ageInMinutes: Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60)),
          formatted,
          lastUpdate: lastUpdateRef.current.toISOString()
        });
      }
    } catch (error) {
      console.error('[ForceUpdateTimestamp] Error:', error);
      setDisplayTime(`${prefix}Error${suffix}`);
    }
  }, [timestamp, prefix, suffix, updateCount, showDebug]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Force immediate update
    forceUpdate();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval with forced updates
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        forceUpdate();
      }
    }, updateInterval);

    // Cleanup
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timestamp, forceUpdate, updateInterval]);

  // Force update when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && mountedRef.current) {
        setTimeout(forceUpdate, 100); // Small delay to ensure proper rendering
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [forceUpdate]);

  return (
    <span className={className}>
      {displayTime}
      {showDebug && (
        <span className="ml-2 text-xs opacity-50">
          (#{updateCount})
        </span>
      )}
    </span>
  );
}

interface ForceUpdateCommentTimestampProps {
  createdAt: string;
  updatedAt: string;
  className?: string;
  updateInterval?: number;
  showDebug?: boolean;
}

export function ForceUpdateCommentTimestamp({ 
  createdAt, 
  updatedAt, 
  className = '',
  updateInterval = 30000,
  showDebug = false
}: ForceUpdateCommentTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const forceUpdate = useCallback(() => {
    if (!mountedRef.current) return;
    
    try {
      const now = new Date();
      const created = parseTimestamp(createdAt);
      const updated = parseTimestamp(updatedAt);
      const timeDiff = Math.abs(updated.getTime() - created.getTime());
      
      let formatted: string;
      if (timeDiff > 1000) {
        formatted = `Edited ${formatDistanceToNow(updated, { addSuffix: true })}`;
      } else {
        formatted = formatDistanceToNow(created, { addSuffix: true });
      }
      
      setDisplayTime(formatted);
      setUpdateCount(prev => prev + 1);
      
      if (showDebug || process.env.NODE_ENV === 'development') {
        const referenceDate = timeDiff > 1000 ? updated : created;
        console.log(`[ForceUpdateCommentTimestamp] Update #${updateCount + 1}:`, {
          createdAt,
          updatedAt,
          created: created.toISOString(),
          updated: updated.toISOString(),
          timeDiff,
          isEdited: timeDiff > 1000,
          referenceDate: referenceDate.toISOString(),
          now: now.toISOString(),
          ageInMinutes: Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60)),
          formatted
        });
      }
    } catch (error) {
      console.error('[ForceUpdateCommentTimestamp] Error:', error);
      setDisplayTime('Error');
    }
  }, [createdAt, updatedAt, updateCount, showDebug]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Force immediate update
    forceUpdate();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        forceUpdate();
      }
    }, updateInterval);

    // Cleanup
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [createdAt, updatedAt, forceUpdate, updateInterval]);

  // Force update when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && mountedRef.current) {
        setTimeout(forceUpdate, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [forceUpdate]);

  return (
    <span className={className}>
      {displayTime}
      {showDebug && (
        <span className="ml-2 text-xs opacity-50">
          (#{updateCount})
        </span>
      )}
    </span>
  );
}