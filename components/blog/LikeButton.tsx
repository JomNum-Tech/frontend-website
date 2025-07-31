'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postSlug: string;
  initialLiked: boolean;
  initialCount: number;
  userId?: string;
}

export function LikeButton({ postSlug, initialLiked, initialCount, userId }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/blog/posts/${postSlug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        setLiked(result.liked);
        setCount(result.likesCount);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to toggle like',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={cn(
        "flex items-center space-x-1 transition-colors",
        liked && "text-red-500 hover:text-red-600"
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
      )}
      <span>{count}</span>
    </Button>
  );
}