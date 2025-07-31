'use client';

import Link from 'next/link';
import { FeaturedPost } from '@/types/blog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Heart, Clock, Star } from 'lucide-react';

import Image from "next/image";

interface FeaturedPostsProps {
  posts: FeaturedPost[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  
  if (posts.length === 0) return null;

  const [mainPost, ...otherPosts] = posts;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Main Featured Post */}
      <Card className="lg:row-span-2 group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
        <div className="relative">
          {mainPost.featured_image && (
            <div className="aspect-video overflow-hidden rounded-t-xl">
              <Image
                height={2000}
                width={2000}
                src={mainPost.featured_image}
                alt={mainPost.title}
                className="w-full h-full object-cover transition-transform duration-300"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent pointer-events-none rounded-t-xl" />
            </div>
          )}
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg px-3 py-1 text-sm font-semibold flex items-center gap-1">
              <Star className="w-4 h-4 mr-1 text-blue-100" />
              Featured
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3 pt-6 px-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12 border-2 border-blue-400 shadow">
              <AvatarImage src={mainPost.author_image || ''} alt={mainPost.author_name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                {mainPost.author_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg text-blue-900 truncate">{mainPost.author_name}</p>
              <p className="text-xs text-blue-500">
                {formatDistanceToNow(new Date(mainPost.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <Link href={`/blog/${mainPost.slug}`}>
            <h2 className="text-3xl font-extrabold hover:text-blue-700 transition-colors cursor-pointer line-clamp-2 mb-2 leading-tight">
              {mainPost.title}
            </h2>
          </Link>

          {mainPost.category && (
            <Badge variant="outline" className="w-fit mb-2 border-blue-300 text-blue-700 bg-blue-50 px-2 py-0.5 text-xs font-medium">
              {mainPost.category}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <p className="text-blue-900 line-clamp-3 mb-5 text-base">
            {mainPost.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-blue-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-black" />
                <span className="font-medium text-black">{mainPost.views_count?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-500">{mainPost.likes_count?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-black" />
                <span className="text-black">{mainPost.reading_time || 5} min read</span>
              </div>
            </div>

            <Link
              href={`/blog/${mainPost.slug}`}
              className="text-blue-700 hover:underline font-semibold text-base transition-colors"
            >
              Read more →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Other Featured Posts */}
      <div className="space-y-5">
        {otherPosts.map((post) => (
          <Card
            key={post.id}
            className="group hover:shadow-md transition-all duration-200 border-0 relative overflow-hidden"
          >
            <CardContent className="p-4 flex gap-4">
              {post.featured_image && (
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg relative">
                  <Image
                    height={2000}
                    width={2000}
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent pointer-events-none rounded-lg" />
                </div>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Avatar className="h-7 w-7 border border-blue-200 shadow">
                        <AvatarImage src={post.author_image || ''} alt={post.author_name} />
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-bold">
                          {post.author_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-blue-900 truncate">{post.author_name}</span>
                    </div>
                    <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs px-2 py-0.5 font-semibold flex items-center gap-1 shadow">
                      <Star className="w-2 h-2 mr-1 text-blue-100" />
                      Featured
                    </Badge>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-semibold hover:text-blue-700 transition-colors cursor-pointer line-clamp-2 mb-1 text-lg leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-blue-900 line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-3 text-xs text-black">
                    <span className="text-blue-500">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    <span>·</span>
                    <span className="">{post.reading_time || 5} min read</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-blue-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-black" />
                      <span className="text-black">{post.views_count?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className="text-red-500">{post.likes_count?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}