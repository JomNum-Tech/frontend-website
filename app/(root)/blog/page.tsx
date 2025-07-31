import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, Clock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { BlogHero } from "@/components/blog/BlogHero";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { TrendingPosts } from "@/components/blog/TrendingPosts";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { RecentPosts } from "@/components/blog/RecentPosts";
import { Metadata } from "next";
import { BlogListJsonLd } from "@/components/seo/BlogJsonLd";

export const metadata: Metadata = {
  title: "Blog - Insights, Tutorials & Community Stories",
  description: "Discover the latest insights, tutorials, and stories from our community of learners and creators. Explore featured articles, trending posts, and expert knowledge across various topics.",
  keywords: [
    "blog",
    "tutorials",
    "insights",
    "community",
    "learning",
    "technology",
    "programming",
    "development",
    "articles",
    "stories"
  ],
  authors: [{ name: "Community Contributors" }],
  openGraph: {
    title: "Blog - Insights, Tutorials & Community Stories",
    description: "Discover the latest insights, tutorials, and stories from our community of learners and creators.",
    type: "website",
    url: "/blog",
    siteName: "Learning Platform",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Blog - Community Insights and Tutorials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Insights, Tutorials & Community Stories",
    description: "Discover the latest insights, tutorials, and stories from our community of learners and creators.",
    images: ["/og-blog.jpg"],
  },
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

async function getBlogFeed() {
  try {
    const { BlogService } = await import("@/lib/services/blogService");
    const feed = await BlogService.getBlogFeed();
    const stats = await BlogService.getBlogStats();

    return { feed, stats };
  } catch (error) {
    console.error("Error fetching blog feed:", error);
    return { 
      feed: {
        featured_posts: [],
        recent_posts: [],
        trending_posts: [],
        categories: [],
        popular_tags: []
      },
      stats: {
        total_posts: 0,
        total_authors: 0,
        total_views: 0,
        total_likes: 0,
        popular_tags: [],
        trending_posts: []
      }
    };
  }
}

function BlogSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="animate-pulse">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl h-64"></div>
      </div>
      
      {/* Featured Posts Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
      
      {/* Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="animate-pulse bg-gray-200 rounded-lg h-64"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
        </div>
      </div>
    </div>
  );
}

export default async function BlogPage() {
  const { userId } = await auth();
  const { feed, stats } = await getBlogFeed();

  return (
    <>
      <BlogListJsonLd 
        posts={feed.recent_posts} 
        url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/blog`}
        title="Blog - Insights, Tutorials & Community Stories"
        description="Discover the latest insights, tutorials, and stories from our community of learners and creators."
      />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <BlogHero stats={stats} />

      <div className="container mx-auto px-12 py-8">
        {/* Header with Write Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-blue-500 bg-clip-text text-transparent tracking-tight">
              Discover Blogs
            </h1>
            <p className="mt-2 text-lg text-gray-500 font-medium">
              Insights, tutorials, and blogs from our community of learners and creators
            </p>
          </div>

          {userId && (
            <Link href="/blog/create">
              <Button
                size="lg"
                className="bg-blue-500 hover:cursor-pointer hover:from-blue-700 hover:bg-blue-700 text-white font-semibold shadow-lg border border-blue-200/60 px-6 py-2 rounded-lg transition-all duration-200"
              >
                <PlusCircle className="mr-2 h-5 w-5 text-blue-100" />
                Create Blog
              </Button>
            </Link>
          )}
        </div>

        <Suspense fallback={<BlogSkeleton />}>

          <hr /><br />
          {/* Featured Posts */}
          {feed.featured_posts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 rounded-full p-2 shadow-sm">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-extrabold bg-black bg-clip-text text-transparent tracking-tight drop-shadow">
                  Featured Stories
                </h2>
              </div>
              <div className="rounded-xl border border-blue-100 bg-white p-4">
                <FeaturedPosts posts={feed.featured_posts} />
              </div>
            </section>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trending Posts */}
              {feed.trending_posts.length > 0 && (
                <section className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 rounded-full p-2 shadow-md">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-black bg-clip-text tracking-tight drop-shadow">
                      Trending Now
                    </h2>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-white/90 p-4 shadow-sm hover:shadow-lg transition-shadow duration-200">
                    <TrendingPosts posts={feed.trending_posts.slice(0, 3)} />
                  </div>
                </section>
              )}

              {/* Recent Posts */}
              <section className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 rounded-full p-2 shadow-sm">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-black tracking-tight drop-shadow-sm">
                    Latest Stories
                  </h2>
                </div>
                <div className="rounded-xl border border-blue-100 bg-white/90 p-4 shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <RecentPosts posts={feed.recent_posts} />
                </div>
              </section>

              {/* No Content Fallback */}
              {feed.recent_posts.length === 0 && feed.trending_posts.length === 0 && feed.featured_posts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No blog posts found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Be the first to create a blog post!
                  </p>
                  {userId && (
                    <Link href="/blog/create">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Write Your First Post
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <BlogSidebar 
                categories={feed.categories}
                popularTags={feed.popular_tags}
                stats={stats}
              />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
    </>
  );
}
