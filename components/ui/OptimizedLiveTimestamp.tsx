"use client";

import {
  useOptimizedLiveTimestamp,
  useOptimizedLiveCommentTimestamp,
} from "@/hooks/useLiveTimestamp";

interface OptimizedLiveTimestampProps {
  timestamp: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function OptimizedLiveTimestamp({
  timestamp,
  prefix = "",
  suffix = "",
  className = "",
}: OptimizedLiveTimestampProps) {
  const displayTime = useOptimizedLiveTimestamp(timestamp);

  return (
    <span className={className}>
      {prefix}
      {displayTime}
      {suffix}
    </span>
  );
}

interface OptimizedLiveCommentTimestampProps {
  createdAt: string;
  updatedAt: string;
  className?: string;
}

export function OptimizedLiveCommentTimestamp({
  createdAt,
  updatedAt,
  className = "",
}: OptimizedLiveCommentTimestampProps) {
  const displayTime = useOptimizedLiveCommentTimestamp(createdAt, updatedAt);

  return <span className={className}>{displayTime}</span>;
}
