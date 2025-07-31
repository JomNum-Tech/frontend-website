import { formatDistanceToNow } from 'date-fns';

/**
 * Server-side timestamp formatting utilities
 * These functions should be used on the server to format timestamps before sending to client
 */

/**
 * Format a timestamp on the server side
 * @param timestamp - Database timestamp string
 * @returns Formatted string like "2 minutes ago"
 */
export function formatServerTimestamp(timestamp: string | Date): string {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting server timestamp:', error);
    return 'Unknown time';
  }
}

/**
 * Format comment timestamp (handles created vs edited)
 * @param createdAt - Creation timestamp
 * @param updatedAt - Update timestamp
 * @returns Formatted string
 */
export function formatServerCommentTimestamp(createdAt: string | Date, updatedAt: string | Date): string {
  try {
    const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    const updated = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
    
    if (isNaN(created.getTime()) || isNaN(updated.getTime())) {
      return 'Invalid date';
    }
    
    const timeDiff = Math.abs(updated.getTime() - created.getTime());
    
    // If difference is more than 1 second, consider it edited
    if (timeDiff > 1000) {
      return `Edited ${formatDistanceToNow(updated, { addSuffix: true })}`;
    } else {
      return formatDistanceToNow(created, { addSuffix: true });
    }
  } catch (error) {
    console.error('Error formatting server comment timestamp:', error);
    return 'Unknown time';
  }
}

/**
 * Get current server timestamp for comparison
 * @returns Current server time as ISO string
 */
export function getServerTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format post timestamps (created and updated)
 * @param createdAt - Creation timestamp
 * @param updatedAt - Update timestamp
 * @returns Object with formatted strings
 */
export function formatServerPostTimestamp(createdAt: string | Date, updatedAt: string | Date) {
  try {
    const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    const updated = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
    
    if (isNaN(created.getTime()) || isNaN(updated.getTime())) {
      return {
        created: 'Invalid date',
        updated: undefined,
        isEdited: false
      };
    }
    
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
      updated: undefined,
      isEdited: false
    };
  } catch (error) {
    console.error('Error formatting server post timestamp:', error);
    return {
      created: 'Unknown time',
      updated: undefined,
      isEdited: false
    };
  }
}