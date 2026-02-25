'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { parseTimestamp } from '@/lib/utils/dateUtils';
import { getTimestampManager } from '@/lib/utils/timestampManager';

interface UseLiveTimestampOptions {
  updateInterval?: number; // in milliseconds
  pauseWhenHidden?: boolean; // pause updates when tab is not visible
  smartInterval?: boolean; // adjust interval based on age of timestamp
}

export function useLiveTimestamp(
  timestamp: string,
  options: UseLiveTimestampOptions = {}
) {
  const {
    updateInterval = 60000, // 1 minute default
    pauseWhenHidden = true,
    smartInterval = true
  } = options;

  const [displayTime, setDisplayTime] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  const getSmartInterval = useCallback((date: Date) => {
    if (!smartInterval) return updateInterval;

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    // More frequent updates for recent timestamps
    if (diffInMinutes < 1) return 10000; // 10 seconds for very recent
    if (diffInMinutes < 5) return 30000; // 30 seconds for recent
    if (diffInMinutes < 60) return 60000; // 1 minute for last hour
    if (diffInMinutes < 1440) return 300000; // 5 minutes for last day
    return 900000; // 15 minutes for older
  }, [smartInterval, updateInterval]);

  const updateDisplayTime = useCallback(() => {
    const parsedDate = parseTimestamp(timestamp);
    const formatted = formatDistanceToNow(parsedDate, { addSuffix: true });
    setDisplayTime(formatted);
    
    // Update interval based on age if smart interval is enabled
    if (smartInterval && intervalRef.current) {
      clearInterval(intervalRef.current);
      const newInterval = getSmartInterval(parsedDate);
      intervalRef.current = setInterval(updateDisplayTime, newInterval);
    }
  }, [timestamp, smartInterval, getSmartInterval]);

  useEffect(() => {
    // Initial update
    updateDisplayTime();

    // Set up visibility change listener
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      
      if (pauseWhenHidden) {
        if (document.hidden) {
          // Pause updates when tab is hidden
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          // Resume updates when tab becomes visible
          updateDisplayTime();
          const parsedDate = parseTimestamp(timestamp);
          const interval = getSmartInterval(parsedDate);
          intervalRef.current = setInterval(updateDisplayTime, interval);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up initial interval
    const parsedDate = parseTimestamp(timestamp);
    const interval = getSmartInterval(parsedDate);
    intervalRef.current = setInterval(updateDisplayTime, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timestamp, updateDisplayTime, pauseWhenHidden, getSmartInterval]);

  return displayTime;
}

export function useLiveCommentTimestamp(
  createdAt: string,
  updatedAt: string,
  options: UseLiveTimestampOptions = {}
) {
  const [displayTime, setDisplayTime] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    updateInterval = 60000,
    pauseWhenHidden = true,
    smartInterval = true
  } = options;

  const getSmartInterval = useCallback((date: Date) => {
    if (!smartInterval) return updateInterval;

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 10000; // 10 seconds
    if (diffInMinutes < 5) return 30000; // 30 seconds
    if (diffInMinutes < 60) return 60000; // 1 minute
    if (diffInMinutes < 1440) return 300000; // 5 minutes
    return 900000; // 15 minutes
  }, [smartInterval, updateInterval]);

  const updateDisplayTime = useCallback(() => {
    const created = parseTimestamp(createdAt);
    const updated = parseTimestamp(updatedAt);
    const timeDiff = Math.abs(updated.getTime() - created.getTime());
    
    if (timeDiff > 1000) {
      const formatted = formatDistanceToNow(updated, { addSuffix: true });
      setDisplayTime(`Edited ${formatted}`);
    } else {
      const formatted = formatDistanceToNow(created, { addSuffix: true });
      setDisplayTime(formatted);
    }

    // Update interval based on age if smart interval is enabled
    if (smartInterval && intervalRef.current) {
      clearInterval(intervalRef.current);
      const referenceDate = timeDiff > 1000 ? updated : created;
      const newInterval = getSmartInterval(referenceDate);
      intervalRef.current = setInterval(updateDisplayTime, newInterval);
    }
  }, [createdAt, updatedAt, smartInterval, getSmartInterval]);

  useEffect(() => {
    updateDisplayTime();

    const handleVisibilityChange = () => {
      if (pauseWhenHidden) {
        if (document.hidden) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          updateDisplayTime();
          const created = parseTimestamp(createdAt);
          const updated = parseTimestamp(updatedAt);
          const timeDiff = Math.abs(updated.getTime() - created.getTime());
          const referenceDate = timeDiff > 1000 ? updated : created;
          const interval = getSmartInterval(referenceDate);
          intervalRef.current = setInterval(updateDisplayTime, interval);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up initial interval
    const created = parseTimestamp(createdAt);
    const updated = parseTimestamp(updatedAt);
    const timeDiff = Math.abs(updated.getTime() - created.getTime());
    const referenceDate = timeDiff > 1000 ? updated : created;
    const interval = getSmartInterval(referenceDate);
    intervalRef.current = setInterval(updateDisplayTime, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [createdAt, updatedAt, updateDisplayTime, pauseWhenHidden, getSmartInterval]);

  return displayTime;
}

// Optimized version using global timestamp manager
export function useOptimizedLiveTimestamp(timestamp: string) {
  const [displayTime, setDisplayTime] = useState('');
  const idRef = useRef<string>('');

  useEffect(() => {
    const manager = getTimestampManager();
    const id = `timestamp_${Date.now()}_${Math.random()}`;
    idRef.current = id;

    const unsubscribe = manager.subscribe(
      id,
      timestamp,
      setDisplayTime,
      'simple'
    );

    return unsubscribe;
  }, [timestamp]);

  return displayTime;
}

export function useOptimizedLiveCommentTimestamp(createdAt: string, updatedAt: string) {
  const [displayTime, setDisplayTime] = useState('');
  const idRef = useRef<string>('');

  useEffect(() => {
    const manager = getTimestampManager();
    const id = `comment_${Date.now()}_${Math.random()}`;
    idRef.current = id;

    const unsubscribe = manager.subscribe(
      id,
      createdAt, // Use createdAt as primary timestamp
      setDisplayTime,
      'comment',
      createdAt,
      updatedAt
    );

    return unsubscribe;
  }, [createdAt, updatedAt]);

  return displayTime;
}