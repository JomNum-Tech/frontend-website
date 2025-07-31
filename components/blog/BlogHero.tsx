'use client';

import { BlogStats } from '@/types/blog';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Eye, Heart } from 'lucide-react';

interface BlogHeroProps {
  stats: BlogStats;
}

export function BlogHero({ stats }: BlogHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-500 to-blue-400 text-white py-20 overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-900 opacity-10 rounded-full blur-2xl"></div>
      </div>
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
            JomNum-Tech Blog
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 max-w-2xl mx-auto font-medium drop-shadow">
            Where knowledge meets innovation. Discover insights, tutorials, and stories 
            that shape the future of technology and education.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="bg-blue-500 border-blue-200/40 shadow-xl hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-7 w-7 text-blue-100 drop-shadow" />
              </div>
              <div className="text-3xl font-extrabold text-white drop-shadow">{stats.total_posts}</div>
              <div className="text-sm font-medium text-blue-100 tracking-wide">Blogs</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500 border-blue-200/40 shadow-xl hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-7 w-7 text-blue-100 drop-shadow" />
              </div>
              <div className="text-3xl font-extrabold text-white drop-shadow">{stats.total_authors}</div>
              <div className="text-sm font-medium text-blue-100 tracking-wide">Writers</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500 border-blue-200/40 shadow-xl hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Eye className="h-7 w-7 text-blue-100 drop-shadow" />
              </div>
              <div className="text-3xl font-extrabold text-white drop-shadow">{stats.total_views.toLocaleString()}</div>
              <div className="text-sm font-medium text-blue-100 tracking-wide">Views</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500 border-blue-200/40 shadow-xl hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Heart className="h-7 w-7 text-blue-100 drop-shadow" />
              </div>
              <div className="text-3xl font-extrabold text-white drop-shadow">{stats.total_likes.toLocaleString()}</div>
              <div className="text-sm font-medium text-blue-100 tracking-wide">Likes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}