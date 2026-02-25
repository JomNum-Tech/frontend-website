'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ServerTimestamp } from '@/components/ui/ServerTimestamp';
import { Eye, Heart, Clock, MessageCircle } from 'lucide-react';

import Image from "next/image";

interface RecentPostsProps {
  posts: BlogPost[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No posts found
          </h3>
          <p className="text-sm text-muted-foreground">
            Be the first to create a blog post!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-7">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="group border border-blue-100 bg-white/95 hover:shadow-md hover:border-blue-300 transition-all duration-200 rounded-xl"
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Featured Image */}
              {post.featured_image && (
                <div className="md:w-40 w-full h-40 md:h-auto flex-shrink-0 overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none relative bg-blue-50">
                  <Image
                    height={2000}
                    width={2000}
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0 p-6">
                {/* Author Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-9 w-9 border-2 border-blue-200 shadow">
                    <AvatarImage src={post.author_image || ''} alt={post.author_name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                      {post.author_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-900 truncate">{post.author_name}</p>
                    <p className="text-xs text-blue-400">
                      <ServerTimestamp
                        formattedTime={post.created_at_formatted || 'Unknown time'}
                      />
                    </p>
                  </div>
                  {/* Category */}
                  {post.category && (
                    <Badge
                      variant="outline"
                      className="border-blue-300 text-blue-700 bg-blue-50 px-2 py-0.5 text-xs font-medium"
                    >
                      {post.category}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-2xl font-extrabold text-black hover:text-blue-700 transition-colors cursor-pointer line-clamp-2 mb-2 leading-tight">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-blue-900 line-clamp-2 mb-3 text-base">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                      >
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats and Actions */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-5 text-sm text-blue-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-black" />
                      <span className="font-medium text-black">{post.views_count?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-red-500">{post.likes_count?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-blue-700" />
                      <span className="font-medium text-blue-900">{post.comments_count?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-700" />
                      <span className="text-blue-900">{post.reading_time || 5} min read</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-700 hover:text-blue-900 hover:underline font-semibold transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}