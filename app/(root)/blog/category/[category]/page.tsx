import { auth } from "@clerk/nextjs/server";
import { BlogService } from "@/lib/services/blogService";
import { BlogCard } from "@/components/blog/BlogCard";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Filter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

async function getCategoryPosts(category: string, userId?: string) {
  try {
    const decodedCategory = decodeURIComponent(category);
    const posts = await BlogService.getPostsByCategory(decodedCategory, userId);
    return posts;
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return [];
  }
}

async function getCategoryStats(category: string) {
  try {
    const decodedCategory = decodeURIComponent(category);
    const stats = await BlogService.getCategoryStats(decodedCategory);
    return stats;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return { totalPosts: 0, totalViews: 0, totalLikes: 0 };
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  try {
    const [posts, stats] = await Promise.all([
      getCategoryPosts(category),
      getCategoryStats(category)
    ]);

    const title = `${decodedCategory} - Blog Category`;
    const description = `Explore ${stats.totalPosts} blog posts in the ${decodedCategory} category. Discover insights, tutorials, and stories from our community.`;

    return {
      title,
      description,
      keywords: [
        decodedCategory.toLowerCase(),
        "blog category",
        "articles",
        "tutorials",
        "insights",
        "community posts"
      ],
      openGraph: {
        title,
        description,
        type: "website",
        url: `/blog/category/${category}`,
        siteName: "Learning Platform",
        images: [
          {
            url: "/og-blog-category.jpg",
            width: 1200,
            height: 630,
            alt: `${decodedCategory} Blog Category`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-blog-category.jpg"],
      },
      alternates: {
        canonical: `/blog/category/${category}`,
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
  } catch (error) {
    console.error("Error generating category metadata:", error);
    return {
      title: `${decodedCategory} - Blog Category`,
      description: `Browse blog posts in the ${decodedCategory} category.`,
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  try {
    const { userId } = await auth();
    
    const [posts] = await Promise.all([
      getCategoryPosts(category, userId || undefined),
      getCategoryStats(category)
    ]);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/blog" className="text-blue-600 hover:underline">
              <Button variant="ghost" size="sm">
                ← Back to Blog
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Filter className="h-6 w-6 text-blue-500" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {decodedCategory}
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Explore all posts in the {decodedCategory} category
              </p>
            </div>
            
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard 
                key={post.id} 
                post={post} 
                
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 mb-6">
                There are no published posts in the {decodedCategory} category yet.
              </p>
              <Link href="/blog">
                <Button variant="outline">
                  Browse All Posts
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering category page:", error);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Category
            </h3>
            <p className="text-gray-500 mb-6">
              There was an error loading posts for this category.
            </p>
            <Link href="/blog">
              <Button variant="outline">
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}