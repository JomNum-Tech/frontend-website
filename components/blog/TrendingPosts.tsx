'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LiveTimestamp } from '@/components/ui/LiveTimestamp';
import { TrendingUp, Eye, Heart, Clock } from 'lucide-react';

import Image from "next/image";

interface TrendingPostsProps {
  posts: BlogPost[];
}

export function TrendingPosts({ posts }: TrendingPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <Card
          key={post.id}
          className="group hover:shadow-md  transition-all duration-200 relative overflow-hidden border  bg-white"
        >
          {/* Trending Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md shadow-blue-200/40">
              <TrendingUp className="w-3 h-3 mr-1 text-blue-100" />
              #{index + 1}
            </Badge>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-t-md">
              <Image
                height={2000}
                width={2000}
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ background: "#e0e7ef" }}
              />
            </div>
          )}

          <CardContent className="p-5">
            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8 border-2 border-blue-200 shadow-sm">
                <AvatarImage src={post.author_image || ''} alt={post.author_name} />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {post.author_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-blue-900">{post.author_name}</p>
                <p className="text-xs text-blue-400">
                  <LiveTimestamp
                    timestamp={post.created_at}
                    updateInterval={120000}
                  />
                </p>
              </div>
            </div>

            {/* Category */}
            {post.category && (
              <Badge
                variant="outline"
                className="mb-2 text-xs border-blue-300 text-blue-600 bg-blue-50"
              >
                {post.category}
              </Badge>
            )}

            {/* Title */}
            <Link href={`/blog/${post.slug}`}>
              <h3 className="font-semibold text-black hover:text-blue-700 transition-colors cursor-pointer line-clamp-2 mb-2 text-lg">
                {post.title}
              </h3>
            </Link>

            {/* Excerpt */}
            <p className="text-sm text-blue-900 line-clamp-2 mb-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                  >
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                  >
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-blue-400 mt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3 text-black" />
                  <span className="text-black">{post.views_count || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span className="text-red-500">{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-black" />
                  <span className="text-black">{post.reading_time || 5}m</span>
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
              >
                Read →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}