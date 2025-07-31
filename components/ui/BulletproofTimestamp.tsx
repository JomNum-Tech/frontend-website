'use client';

import { useState, useEffect, useRef } from 'react';

interface BulletproofTimestampProps {
  timestamp: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  updateInterval?: number;
  showDebug?: boolean;
}

// Simple time formatting without external dependencies
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 0) {
    return 'in the future';
  }
  
  if (diffInSeconds < 60) {
    return diffInSeconds <= 1 ? 'just now' : `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
}

// Robust timestamp parsing
function parseTimestampRobust(timestamp: string): Date {
  if (!timestamp || typeof timestamp !== 'string') {
    console.warn('[BulletproofTimestamp] Invalid timestamp:', timestamp);
    return new Date();
  }
  
  // Try different parsing approaches
  let date: Date;
  
  // First, try direct parsing
  date = new Date(timestamp);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // If that fails, try adding Z for UTC
  if (!timestamp.includes('Z') && !timestamp.includes('+') && !timestamp.includes('-', 10)) {
    date = new Date(timestamp + 'Z');
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // If all else fails, try parsing as ISO string
  try {
    date = new Date(timestamp.replace(' ', 'T'));
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    console.warn('[BulletproofTimestamp] Failed to parse timestamp:', timestamp, e);
  }
  
  // Last resort - return current time
  return new Date();
}

export function BulletproofTimestamp({ 
  timestamp, 
  prefix = '', 
  suffix = '', 
  className = '',
  updateInterval = 30000,
  showDebug = false
}: BulletproofTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const updateTime = () => {
    if (!mountedRef.current) return;
    
    try {
      const now = new Date();
      const parsedDate = parseTimestampRobust(timestamp);
      const formatted = formatTimeAgo(parsedDate);
      
      setDisplayTime(`${prefix}${formatted}${suffix}`);
      setUpdateCount(prev => prev + 1);
      setLastUpdate(now);
      
      if (showDebug) {
        const ageInSeconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);
        const ageInMinutes = Math.floor(ageInSeconds / 60);
        
        console.log(`[BulletproofTimestamp] Update #${updateCount + 1}:`, {
          originalTimestamp: timestamp,
          parsedDate: parsedDate.toISOString(),
          now: now.toISOString(),
          ageInSeconds,
          ageInMinutes,
          formatted,
          lastUpdate: lastUpdate.toISOString()
        });
      }
    } catch (error) {
      console.error('[BulletproofTimestamp] Error updating timestamp:', error);
      setDisplayTime(`${prefix}Error${suffix}`);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Immediate update
    updateTime();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
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

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && mountedRef.current) {
        // Force update when tab becomes visible
        setTimeout(updateTime, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <span className={className}>
      {displayTime}
      {showDebug && (
        <span className="ml-2 text-xs opacity-50" title={`Updates: ${updateCount}, Last: ${lastUpdate.toLocaleTimeString()}`}>
          (#{updateCount})
        </span>
      )}
    </span>
  );
}

interface BulletproofCommentTimestampProps {
  createdAt: string;
  updatedAt: string;
  className?: string;
  updateInterval?: number;
  showDebug?: boolean;
}

export function BulletproofCommentTimestamp({ 
  createdAt, 
  updatedAt, 
  className = '',
  updateInterval = 30000,
  showDebug = false
}: BulletproofCommentTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const updateTime = () => {
    if (!mountedRef.current) return;
    
    try {
      const now = new Date();
      const created = parseTimestampRobust(createdAt);
      const updated = parseTimestampRobust(updatedAt);
      const timeDiff = Math.abs(updated.getTime() - created.getTime());
      
      let formatted: string;
      let referenceDate: Date;
      
      if (timeDiff > 1000) { // More than 1 second difference
        formatted = `Edited ${formatTimeAgo(updated)}`;
        referenceDate = updated;
      } else {
        formatted = formatTimeAgo(created);
        referenceDate = created;
      }
      
      setDisplayTime(formatted);
      setUpdateCount(prev => prev + 1);
      
      if (showDebug) {
        const ageInSeconds = Math.floor((now.getTime() - referenceDate.getTime()) / 1000);
        const ageInMinutes = Math.floor(ageInSeconds / 60);
        
        console.log(`[BulletproofCommentTimestamp] Update #${updateCount + 1}:`, {
          createdAt,
          updatedAt,
          created: created.toISOString(),
          updated: updated.toISOString(),
          timeDiff,
          isEdited: timeDiff > 1000,
          referenceDate: referenceDate.toISOString(),
          now: now.toISOString(),
          ageInSeconds,
          ageInMinutes,
          formatted
        });
      }
    } catch (error) {
      console.error('[BulletproofCommentTimestamp] Error updating timestamp:', error);
      setDisplayTime('Error');
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Immediate update
    updateTime();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
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

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && mountedRef.current) {
        setTimeout(updateTime, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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