'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptimizedLiveTimestamp, OptimizedLiveCommentTimestamp } from '@/components/ui/OptimizedLiveTimestamp';
import { LiveTimestamp, LiveCommentTimestamp } from '@/components/ui/LiveTimestamp';

export function TimestampDemo() {
  const [timestamps, setTimestamps] = useState([
    new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
    new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  ]);

  const addNewTimestamp = () => {
    const newTimestamp = new Date().toISOString();
    setTimestamps([newTimestamp, ...timestamps]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Live Timestamp Demo
          <Button onClick={addNewTimestamp} size="sm">
            Add New Timestamp
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          These timestamps update automatically every 30 seconds. Watch them change in real-time!
        </div>
        
        {timestamps.map((timestamp, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <div className="text-sm font-medium">
                Timestamp #{index + 1}
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {new Date(timestamp).toLocaleString()}
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm">
                <OptimizedLiveTimestamp 
                  timestamp={timestamp}
                  className="font-medium text-blue-600"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                (Updates every 30s)
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Comment Timestamp Example</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm">Sample Comment</div>
              <div className="text-xs text-muted-foreground">
                Created: {new Date(timestamps[0]).toLocaleString()}
              </div>
            </div>
            <OptimizedLiveCommentTimestamp
              createdAt={timestamps[0]}
              updatedAt={timestamps[0]}
              className="text-xs text-blue-600 font-medium"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
          <strong>Performance Note:</strong> All timestamps on this page share a single update interval, 
          making it very efficient even with many timestamps displayed simultaneously.
        </div>
      </CardContent>
    </Card>
  );
}