'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { parseTimestamp } from '@/lib/utils/dateUtils';

interface SimpleLiveTimestampProps {
  timestamp: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  updateInterval?: number;
}

export function SimpleLiveTimestamp({ 
  timestamp, 
  prefix = '', 
  suffix = '', 
  className = '',
  updateInterval = 30000 // 30 seconds default
}: SimpleLiveTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const updateTime = () => {
    if (!mountedRef.current) return;
    
    try {
      const parsedDate = parseTimestamp(timestamp);
      const now = new Date();
      const formatted = formatDistanceToNow(parsedDate, { addSuffix: true });
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        const ageInMinutes = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60));
        console.log(`[SimpleLiveTimestamp] Update:`, {
          timestamp,
          parsedDate: parsedDate.toISOString(),
          now: now.toISOString(),
          ageInMinutes,
          formatted
        });
      }
      
      setDisplayTime(`${prefix}${formatted}${suffix}`);
    } catch (error) {
      console.error('[SimpleLiveTimestamp] Error updating timestamp:', error);
      setDisplayTime(`${prefix}Invalid date${suffix}`);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial update
    updateTime();

    // Set up interval
    intervalRef.current = setInterval(updateTime, updateInterval);

    // Cleanup
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timestamp, prefix, suffix, updateInterval]);

  return <span className={className}>{displayTime}</span>;
}

interface SimpleLiveCommentTimestampProps {
  createdAt: string;
  updatedAt: string;
  className?: string;
  updateInterval?: number;
}

export function SimpleLiveCommentTimestamp({ 
  createdAt, 
  updatedAt, 
  className = '',
  updateInterval = 30000
}: SimpleLiveCommentTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const updateTime = () => {
    if (!mountedRef.current) return;
    
    try {
      const created = parseTimestamp(createdAt);
      const updated = parseTimestamp(updatedAt);
      const timeDiff = Math.abs(updated.getTime() - created.getTime());
      
      let formatted: string;
      if (timeDiff > 1000) {
        formatted = `Edited ${formatDistanceToNow(updated, { addSuffix: true })}`;
      } else {
        formatted = formatDistanceToNow(created, { addSuffix: true });
      }
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        const now = new Date();
        const referenceDate = timeDiff > 1000 ? updated : created;
        const ageInMinutes = Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60));
        
        console.log(`[SimpleLiveCommentTimestamp] Update:`, {
          createdAt,
          updatedAt,
          created: created.toISOString(),
          updated: updated.toISOString(),
          timeDiff,
          isEdited: timeDiff > 1000,
          ageInMinutes,
          formatted
        });
      }
      
      setDisplayTime(formatted);
    } catch (error) {
      console.error('[SimpleLiveCommentTimestamp] Error updating timestamp:', error);
      setDisplayTime('Invalid date');
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial update
    updateTime();

    // Set up interval
    intervalRef.current = setInterval(updateTime, updateInterval);

    // Cleanup
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [createdAt, updatedAt, updateInterval]);

  return <span className={className}>{displayTime}</span>;
}