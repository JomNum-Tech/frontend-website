'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { parseTimestamp } from '@/lib/utils/dateUtils';

interface LiveTimestampProps {
  timestamp: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  updateInterval?: number; // in milliseconds, default 60000 (1 minute)
}

export function LiveTimestamp({ 
  timestamp, 
  prefix = '', 
  suffix = '', 
  className = '',
  updateInterval = 60000 
}: LiveTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');

  const updateDisplayTime = () => {
    const parsedDate = parseTimestamp(timestamp);
    const formatted = formatDistanceToNow(parsedDate, { addSuffix: true });
    setDisplayTime(`${prefix}${formatted}${suffix}`);
  };

  useEffect(() => {
    // Initial update
    updateDisplayTime();

    // Set up interval for updates
    const interval = setInterval(updateDisplayTime, updateInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [timestamp, prefix, suffix, updateInterval]);

  return <span className={className}>{displayTime}</span>;
}

interface LiveCommentTimestampProps {
  createdAt: string;
  updatedAt: string;
  className?: string;
  updateInterval?: number;
}

export function LiveCommentTimestamp({ 
  createdAt, 
  updatedAt, 
  className = '',
  updateInterval = 60000 
}: LiveCommentTimestampProps) {
  const [displayTime, setDisplayTime] = useState('');

  const updateDisplayTime = () => {
    const created = parseTimestamp(createdAt);
    const updated = parseTimestamp(updatedAt);
    const timeDiff = Math.abs(updated.getTime() - created.getTime());
    
    // If the difference is more than 1 second, consider it edited
    if (timeDiff > 1000) {
      const formatted = formatDistanceToNow(updated, { addSuffix: true });
      setDisplayTime(`Edited ${formatted}`);
    } else {
      const formatted = formatDistanceToNow(created, { addSuffix: true });
      setDisplayTime(formatted);
    }
  };

  useEffect(() => {
    // Initial update
    updateDisplayTime();

    // Set up interval for updates
    const interval = setInterval(updateDisplayTime, updateInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [createdAt, updatedAt, updateInterval]);

  return <span className={className}>{displayTime}</span>;
}

interface LivePostTimestampProps {
  createdAt: string;
  updatedAt: string;
  showCreated?: boolean;
  showUpdated?: boolean;
  className?: string;
  updateInterval?: number;
}

export function LivePostTimestamp({ 
  createdAt, 
  updatedAt, 
  showCreated = true,
  showUpdated = true,
  className = '',
  updateInterval = 60000 
}: LivePostTimestampProps) {
  const [displayTime, setDisplayTime] = useState({ created: '', updated: '', isEdited: false });

  const updateDisplayTime = () => {
    const created = parseTimestamp(createdAt);
    const updated = parseTimestamp(updatedAt);
    const timeDiff = Math.abs(updated.getTime() - created.getTime());
    
    const createdText = formatDistanceToNow(created, { addSuffix: true });
    
    if (timeDiff > 1000) {
      const updatedText = formatDistanceToNow(updated, { addSuffix: true });
      setDisplayTime({
        created: createdText,
        updated: updatedText,
        isEdited: true
      });
    } else {
      setDisplayTime({
        created: createdText,
        updated: '',
        isEdited: false
      });
    }
  };

  useEffect(() => {
    // Initial update
    updateDisplayTime();

    // Set up interval for updates
    const interval = setInterval(updateDisplayTime, updateInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [createdAt, updatedAt, updateInterval]);

  return (
    <span className={className}>
      {showCreated && `Created ${displayTime.created}`}
      {showCreated && showUpdated && displayTime.isEdited && ' • '}
      {showUpdated && displayTime.isEdited && `Updated ${displayTime.updated}`}
    </span>
  );
}