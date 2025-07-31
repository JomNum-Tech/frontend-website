'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlogComment } from '@/types/blog';
import { ServerCommentTimestamp } from '@/components/ui/ServerTimestamp';

interface CommentSectionProps {
  postSlug: string;
  initialComments: BlogComment[];
  userId?: string;
}

export function CommentSection({ postSlug, initialComments, userId }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/blog/posts/${postSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment('');
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add comment',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border border-blue-100 bg-white/90">
      <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white/80 rounded-t-lg">
        <CardTitle className="flex items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-blue-700 tracking-tight">
              Comments <span className="text-xs text-blue-400 font-normal">({comments.length})</span>
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 pt-6 pb-8 px-2 sm:px-6">
        {/* Add Comment Form */}
        {userId && (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              disabled={loading}
              className="resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-200/50 bg-blue-50/30"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition-colors"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </Button>
            </div>
          </form>
        )}

        {!userId && (
          <div className="text-center py-4 text-muted-foreground bg-blue-50/50 rounded-lg border border-blue-100">
            <p className="text-blue-700 font-medium">Please sign in to leave a comment</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-40 text-blue-300" />
              <p className="text-blue-500 font-medium">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex space-x-3 p-4 bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Avatar className="h-10 w-10 border-2 border-blue-200 shadow">
                  <AvatarImage src={comment.author_image || ''} alt={comment.author_name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-blue-700">{comment.author_name}</span>
                    <ServerCommentTimestamp
                      formattedTime={comment.timestamp_formatted || 'Unknown time'}
                      className="text-xs text-muted-foreground"
                    />
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}