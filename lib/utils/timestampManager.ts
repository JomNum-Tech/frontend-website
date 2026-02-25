'use client';

import { formatDistanceToNow } from 'date-fns';
import { parseTimestamp } from './dateUtils';

type TimestampCallback = (formattedTime: string) => void;

interface TimestampSubscription {
  id: string;
  timestamp: string;
  callback: TimestampCallback;
  type: 'simple' | 'comment';
  createdAt?: string;
  updatedAt?: string;
}

class TimestampManager {
  private subscriptions: Map<string, TimestampSubscription> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private updateInterval = 30000; // 30 seconds global update
  private isVisible = true;

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for visibility changes
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = () => {
    this.isVisible = !document.hidden;
    
    if (this.isVisible) {
      // Resume updates when tab becomes visible
      this.updateAllTimestamps();
      this.startInterval();
    } else {
      // Pause updates when tab is hidden
      this.stopInterval();
    }
  };

  private startInterval() {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      if (this.isVisible && this.subscriptions.size > 0) {
        this.updateAllTimestamps();
      }
    }, this.updateInterval);
  }

  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateAllTimestamps() {
    const now = new Date();
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[TimestampManager] Updating ${this.subscriptions.size} timestamps at ${now.toISOString()}`);
    }
    
    this.subscriptions.forEach((subscription) => {
      let formattedTime: string;

      try {
        if (subscription.type === 'comment' && subscription.createdAt && subscription.updatedAt) {
          const created = parseTimestamp(subscription.createdAt);
          const updated = parseTimestamp(subscription.updatedAt);
          const timeDiff = Math.abs(updated.getTime() - created.getTime());
          
          if (timeDiff > 1000) {
            formattedTime = `Edited ${formatDistanceToNow(updated, { addSuffix: true })}`;
          } else {
            formattedTime = formatDistanceToNow(created, { addSuffix: true });
          }
        } else {
          const parsedDate = parseTimestamp(subscription.timestamp);
          formattedTime = formatDistanceToNow(parsedDate, { addSuffix: true });
        }

        // Debug logging for stuck timestamps
        if (process.env.NODE_ENV === 'development') {
          const parsedDate = parseTimestamp(subscription.timestamp);
          const ageInMinutes = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60));
          
          if (formattedTime.includes('less than a minute') && ageInMinutes > 1) {
            console.warn(`[TimestampManager] Potentially stuck timestamp:`, {
              id: subscription.id,
              originalTimestamp: subscription.timestamp,
              parsedDate: parsedDate.toISOString(),
              now: now.toISOString(),
              ageInMinutes,
              formattedTime
            });
          }
        }

        subscription.callback(formattedTime);
      } catch (error) {
        console.error(`[TimestampManager] Error updating timestamp ${subscription.id}:`, error);
      }
    });
  }

  subscribe(
    id: string,
    timestamp: string,
    callback: TimestampCallback,
    type: 'simple' | 'comment' = 'simple',
    createdAt?: string,
    updatedAt?: string
  ) {
    const subscription: TimestampSubscription = {
      id,
      timestamp,
      callback,
      type,
      createdAt,
      updatedAt
    };

    this.subscriptions.set(id, subscription);

    // Start interval if this is the first subscription
    if (this.subscriptions.size === 1) {
      this.startInterval();
    }

    // Immediate update
    let formattedTime: string;
    if (type === 'comment' && createdAt && updatedAt) {
      const created = parseTimestamp(createdAt);
      const updated = parseTimestamp(updatedAt);
      const timeDiff = Math.abs(updated.getTime() - created.getTime());
      
      if (timeDiff > 1000) {
        formattedTime = `Edited ${formatDistanceToNow(updated, { addSuffix: true })}`;
      } else {
        formattedTime = formatDistanceToNow(created, { addSuffix: true });
      }
    } else {
      const parsedDate = parseTimestamp(timestamp);
      formattedTime = formatDistanceToNow(parsedDate, { addSuffix: true });
    }
    
    callback(formattedTime);

    return () => this.unsubscribe(id);
  }

  unsubscribe(id: string) {
    this.subscriptions.delete(id);

    // Stop interval if no more subscriptions
    if (this.subscriptions.size === 0) {
      this.stopInterval();
    }
  }

  destroy() {
    this.stopInterval();
    this.subscriptions.clear();
    
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }
}

// Global instance
let timestampManager: TimestampManager | null = null;

export function getTimestampManager(): TimestampManager {
  if (!timestampManager) {
    timestampManager = new TimestampManager();
  }
  return timestampManager;
}