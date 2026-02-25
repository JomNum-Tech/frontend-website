import { auth } from "@clerk/nextjs/server";
import { BlogService } from "@/lib/services/blogService";
import { BlogCard } from "@/components/blog/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

async function getTagPosts(tag: string, userId?: string) {
  try {
    const decodedTag = decodeURIComponent(tag);
    const posts = await BlogService.getPostsByTag(decodedTag, 1, 50);
    return posts;
  } catch (error) {
    console.error("Error fetching tag posts:", error);
    return [];
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  try {
    const posts = await getTagPosts(tag);

    const title = `#${decodedTag} - Blog Tag`;
    const description = `Discover ${posts.length} blog posts tagged with #${decodedTag}. Find related articles, tutorials, and insights from our community.`;

    return {
      title,
      description,
      keywords: [
        decodedTag.toLowerCase(),
        "blog tag",
        "articles",
        "tutorials",
        "related posts",
        "community content"
      ],
      openGraph: {
        title,
        description,
        type: "website",
        url: `/blog/tag/${tag}`,
        siteName: "Learning Platform",
        images: [
          {
            url: "/og-blog-tag.jpg",
            width: 1200,
            height: 630,
            alt: `#${decodedTag} Blog Tag`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-blog-tag.jpg"],
        
      },
      alternates: {
        canonical: `/blog/tag/${tag}`,
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
    console.error("Error generating tag metadata:", error);
    return {
      title: `#${decodedTag} - Blog Tag`,
      description: `Browse blog posts tagged with #${decodedTag}.`,
    };
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  try {
    const { userId } = await auth();
    const posts = await getTagPosts(tag, userId || undefined);

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
                <Tag className="h-6 w-6 text-green-500" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  #{decodedTag}
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                All posts tagged with {decodedTag}
              </p>
            </div>

          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
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
                There are no published posts tagged with {decodedTag} yet.
              </p>
              <Link href="/blog">
                <Button variant="outline">Browse All Posts</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering tag page:", error);

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Tag
            </h3>
            <p className="text-gray-500 mb-6">
              There was an error loading posts for this tag.
            </p>
            <Link href="/blog">
              <Button variant="outline">Back to Blog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}
