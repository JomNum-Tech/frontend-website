'use client';

import Link from 'next/link';
import { BlogCategory, BlogTag, BlogStats } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Folder, 
  Tag, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface BlogSidebarProps {
  categories: BlogCategory[];
  popularTags: BlogTag[];
  stats: BlogStats;
}

export function BlogSidebar({ categories, popularTags, stats }: BlogSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <Card className="bg-blue-500 border-blue-200 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-blue-900 text-lg font-bold">
            <TrendingUp className="h-5 w-5 text-white" />
            <span className="text-white">Community Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-1">
          <div className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-xs text-blue-700 font-medium">Blogs</div>
              <div className="font-bold text-blue-900 text-base">{stats.total_posts}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-xs text-purple-700 font-medium">Writers</div>
              <div className="font-bold text-purple-900 text-base">{stats.total_authors}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
            <Eye className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-xs text-green-700 font-medium">Views</div>
              <div className="font-bold text-green-900 text-base">{stats.total_views.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
            <Heart className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-xs text-red-700 font-medium">Likes</div>
              <div className="font-bold text-red-900 text-base">{stats.total_likes.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {categories.length > 0 && (
        <Card className="shadow-sm rounded-xl border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700 font-semibold">
              <Folder className="h-5 w-5 text-orange-500" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {categories.slice(0, 6).map((category) => (
              <Link 
                key={category.id} 
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-50/70 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium group-hover:text-orange-700 transition-colors">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                    {category.posts_count}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-orange-400 group-hover:text-orange-700 transition-colors" />
                </div>
              </Link>
            ))}
            {categories.length > 6 && (
              <Link href="/blog/categories">
                <Button variant="ghost" size="sm" className="w-full mt-2 text-orange-700 hover:bg-orange-50">
                  View all categories
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700 font-semibold">
              <Tag className="h-5 w-5 text-green-500" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularTags.slice(0, 15).map((tag) => (
                <Link key={tag.name} href={`/blog/tag/${tag.slug}`}>
                  <Badge 
                    variant="outline" 
                    className="hover:bg-green-600 hover:text-white border-green-200 text-green-700 transition-colors cursor-pointer px-2 py-1"
                  >
                    #{tag.name}
                    <span className="ml-1 text-xs opacity-70">
                      {tag.posts_count}
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
            {popularTags.length > 15 && (
              <Link href="/blog/tags">
                <Button variant="ghost" size="sm" className="w-full mt-3 text-green-700 hover:bg-green-50">
                  View all tags
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trending Posts */}
      {stats.trending_posts.length > 0 && (
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-pink-700 font-semibold">
              <TrendingUp className="h-5 w-5 text-pink-500" />
              Trending This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.trending_posts.slice(0, 3).map((post, index) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="block px-3 py-2 rounded-lg hover:bg-pink-50/70 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-pink-700 transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-pink-600/80">
                      <span>
                        <Eye className="inline h-3 w-3 mr-1" />
                        {post.views_count || 0}
                      </span>
                      <span>•</span>
                      <span>
                        <Heart className="inline h-3 w-3 mr-1 text-red-500" />
                        {post.likes_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}