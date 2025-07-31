'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ServerTimestamp } from '@/components/ui/ServerTimestamp';
import { Eye, Heart, Clock, MessageCircle, Bookmark } from 'lucide-react';

import Image from "next/image";

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const blogUrl = `/blog/${post.slug}`;
  
  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex space-x-3">
            {post.featured_image && (
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  height={2000}
                  width={2000} 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={post.author_image || ''} alt={post.author_name} />
                  <AvatarFallback className="text-xs">
                    {post.author_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{post.author_name}</span>
              </div>
              
              <Link href={blogUrl}>
                <h4 className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer line-clamp-2 mb-1">
                  {post.title}
                </h4>
              </Link>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <ServerTimestamp 
                  formattedTime={post.created_at_formatted || 'Unknown time'}
                />
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likes_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Featured Image */}
      {post.featured_image && (
        <div className="aspect-video overflow-hidden">
          <Image
            height={2000}
            width={2000}
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author_image || ''} alt={post.author_name} />
              <AvatarFallback>
                {post.author_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{post.author_name}</p>
              <p className="text-xs text-muted-foreground">
                <ServerTimestamp 
                  formattedTime={post.created_at_formatted || 'Unknown time'}
                />
              </p>
            </div>
          </div>
          
          {/* Category Badge */}
          {post.category && (
            <Link href={`/blog/category/${encodeURIComponent(post.category)}`}>
              <Badge variant="outline" className="text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer">
                {post.category}
              </Badge>
            </Link>
          )}
        </div>
        
        {/* Title */}
        <Link href={blogUrl}>
          <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer line-clamp-2 mb-2">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      
      <CardContent>
        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time || 5}m</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </button>
            <Link 
              href={blogUrl}
              className="text-primary hover:underline font-medium text-sm"
            >
              Read →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}