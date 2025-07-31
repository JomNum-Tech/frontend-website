import { formatDistanceToNow, format } from 'date-fns';

/**
 * Safely parse a timestamp string, handling timezone issues
 * @param timestamp - The timestamp string from the database
 * @returns Date object
 */
export function parseTimestamp(timestamp: string): Date {
  // Handle null, undefined, or non-string values
  if (!timestamp || typeof timestamp !== 'string') {
    console.warn('[parseTimestamp] Invalid timestamp:', timestamp);
    return new Date();
  }
  
  // Clean up the timestamp string
  const cleanTimestamp = timestamp.trim();
  
  // If timestamp doesn't have timezone info, treat it as UTC
  const hasTimezone = cleanTimestamp.includes('Z') || 
                     cleanTimestamp.includes('+') || 
                     cleanTimestamp.lastIndexOf('-') > 10; // Check for timezone offset after date part
  
  if (!hasTimezone) {
    // Add 'Z' to indicate UTC if no timezone info is present
    const utcTimestamp = cleanTimestamp + 'Z';
    const result = new Date(utcTimestamp);
    
    // Validate the result
    if (isNaN(result.getTime())) {
      console.warn('[parseTimestamp] Invalid date after UTC conversion:', cleanTimestamp);
      return new Date();
    }
    
    return result;
  }
  
  const result = new Date(cleanTimestamp);
  
  // Validate the result
  if (isNaN(result.getTime())) {
    console.warn('[parseTimestamp] Invalid date:', cleanTimestamp);
    return new Date();
  }
  
  return result;
}
/**
 * Format a timestamp for display, showing "edited" if different from created
 * @param createdAt - Creation timestamp
 * @param updatedAt - Last update timestamp
 * @returns Formatted string
 */
export function formatCommentTime(createdAt: string, updatedAt: string): string {
  const created = parseTimestamp(createdAt);
  const updated = parseTimestamp(updatedAt);
  const timeDiff = Math.abs(updated.getTime() - created.getTime());
  
  // If the difference is more than 1 second, consider it edited
  if (timeDiff > 1000) {
    return `Edited ${formatDistanceToNow(updated, { addSuffix: true })}`;
  } else {
    return formatDistanceToNow(created, { addSuffix: true });
  }
}

/**
 * Format a post timestamp, showing creation and edit time if different
 * @param createdAt - Creation timestamp
 * @param updatedAt - Last update timestamp
 * @returns Object with formatted strings
 */
export function formatPostTime(createdAt: string, updatedAt: string) {
  const created = parseTimestamp(createdAt);
  const updated = parseTimestamp(updatedAt);
  const timeDiff = Math.abs(updated.getTime() - created.getTime());
  
  const createdText = formatDistanceToNow(created, { addSuffix: true });
  
  if (timeDiff > 1000) {
    const updatedText = formatDistanceToNow(updated, { addSuffix: true });
    return {
      created: createdText,
      updated: updatedText,
      isEdited: true
    };
  }
  
  return {
    created: createdText,
    updated: null,
    isEdited: false
  };
}

/**
 * Debug function to log timestamp information
 * @param label - Label for the log
 * @param timestamp - Timestamp to debug
 */
export function debugTimestamp(label: string, timestamp: string) {
  const parsed = parseTimestamp(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  console.log(`${label}:`, {
    original: timestamp,
    parsed: parsed.toISOString(),
    local: parsed.toString(),
    utc: parsed.toUTCString(),
    timestamp: parsed.getTime(),
    now: now.toISOString(),
    diff: {
      milliseconds: diffMs,
      minutes: diffMinutes,
      hours: diffHours,
      formatted: formatDistanceToNow(parsed, { addSuffix: true })
    }
  });
}

/**
 * Get update interval based on timestamp age for smart updating
 * @param timestamp - The timestamp to check
 * @returns Update interval in milliseconds
 */
export function getSmartUpdateInterval(timestamp: string): number {
  const date = parseTimestamp(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  // More frequent updates for recent timestamps
  if (diffInMinutes < 1) return 10000; // 10 seconds for very recent
  if (diffInMinutes < 5) return 30000; // 30 seconds for recent
  if (diffInMinutes < 60) return 60000; // 1 minute for last hour
  if (diffInMinutes < 1440) return 300000; // 5 minutes for last day
  return 900000; // 15 minutes for older
}