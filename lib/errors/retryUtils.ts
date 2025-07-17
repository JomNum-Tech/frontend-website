/**
 * Utility functions for retrying operations
 */

import { RoleError, isRetryableError, logRoleError } from './roleErrors';

interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retryableCheck?: (error: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRetry?: (error: any, attempt: number, delay: number) => void;
  // Add a flag to control whether to retry on the first attempt
  retryImmediately?: boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 5000,
  backoffFactor: 2,
  retryableCheck: isRetryableError,
  retryImmediately: false,
  onRetry: (error, attempt, delay) => {
    if (error && typeof error === 'object' && 'code' in error) {
      logRoleError(error as RoleError, `Retry attempt ${attempt}`);
    } else {
      console.warn(`Retrying operation after error (attempt ${attempt}, delay ${delay}ms):`, error);
    }
  }
};

/**
 * Sleep for the specified number of milliseconds
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay with jitter
 * @param attempt - Current attempt number (0-based)
 * @param options - Retry options
 * @returns Delay in milliseconds
 */
function calculateBackoffDelay(attempt: number, options: RetryOptions): number {
  const exponentialDelay = options.initialDelayMs * Math.pow(options.backoffFactor, attempt);
  const cappedDelay = Math.min(exponentialDelay, options.maxDelayMs);
  
  // Add jitter (±20%) to prevent thundering herd problem
  const jitterFactor = 0.8 + Math.random() * 0.4; // Random between 0.8 and 1.2
  return Math.floor(cappedDelay * jitterFactor);
}

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param options - Retry options
 * @returns Promise resolving to the function result
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lastError: any;
  
  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      // Only delay if it's not the first attempt or if retryImmediately is true
      if (attempt > 0) {
        const delay = calculateBackoffDelay(attempt - 1, retryOptions);
        if (retryOptions.onRetry) {
          retryOptions.onRetry(lastError, attempt, delay);
        }
        await sleep(delay);
      }
      
      return await fn();
    } catch (error) {
      lastError = error;
      
      // If this was the last attempt or error is not retryable, throw
      const isRetryable = retryOptions.retryableCheck ? retryOptions.retryableCheck(error) : true;
      if (attempt >= retryOptions.maxRetries || !isRetryable) {
        throw error;
      }
    }
  }
  
  // This should never be reached due to the throw in the catch block
  throw lastError;
}