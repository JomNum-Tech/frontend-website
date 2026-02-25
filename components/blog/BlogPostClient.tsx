'use client';

import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HtmlContent } from '@/components/ui/html-content';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface BlogPostClientProps {
  slug: string;
}

export function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        console.log('Fetching post client-side for slug:', slug);
        const response = await fetch(`/api/blog/posts/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Post not found');
          } else {
            setError('Failed to fetch post');
          }
          return;
        }

        const postData = await response.json();
        console.log('Post data received:', postData);
        setPost(postData);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {error || 'Post not found'}
            </h3>
            <p className="text-sm text-muted-foreground">
              The blog post you are looking for doesn&apos;t exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author_image || ''} alt={post.author_name} />
                <AvatarFallback>
                  {post.author_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author_name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {post.published && (
                <Badge variant="secondary">Published</Badge>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
          
          {post.excerpt && (
            <p className="text-lg text-muted-foreground mt-4">
              {post.excerpt}
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          <HtmlContent 
            content={post.content} 
            className="mb-6"
          />
        </CardContent>
      </Card>
    </div>
  );
}