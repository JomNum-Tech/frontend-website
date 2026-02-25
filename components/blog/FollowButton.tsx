'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, isFollowing, onFollowChange }: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const { toast } = useToast();

  const handleFollow = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/blog/follow', {
        method: following ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followingId: userId,
        }),
      });

      if (response.ok) {
        const newFollowingState = !following;
        setFollowing(newFollowingState);
        onFollowChange?.(newFollowingState);
        
        toast({
          title: "Success",
          description: newFollowingState ? 'Successfully followed user' : 'Successfully unfollowed user',
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update follow status',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={following ? "outline" : "default"}
      size="sm"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {following ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}