import { BlogService } from "@/lib/services/blogService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, BookOpen } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Tags - Discover Related Content",
  description: "Browse all blog tags to discover related content. Find articles and tutorials connected by common themes and topics from our community.",
  keywords: [
    "blog tags",
    "related content",
    "discover articles",
    "content tags",
    "topics",
    "themes",
    "community posts"
  ],
  openGraph: {
    title: "Blog Tags - Discover Related Content",
    description: "Browse all blog tags to discover related content and articles connected by common themes.",
    type: "website",
    url: "/blog/tags",
    siteName: "Learning Platform",
    images: [
      {
        url: "/og-blog-tags.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Tags - Discover Related Content",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Tags - Discover Related Content",
    description: "Browse all blog tags to discover related content and articles connected by common themes.",
    images: ["/og-blog-tags.jpg"],
  },
  alternates: {
    canonical: "/blog/tags",
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

async function getAllTags() {
  try {
    const tags = await BlogService.getPopularTags(100); // Get more tags for the dedicated page
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/blog" className="text-blue-600 hover:underline">
            <Button variant="ghost" size="sm">
              ← Back to Blog
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <Tag className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            All Tags
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Explore blog posts by tags
        </p>
      </div>

      {/* Tags Cloud */}
      {tags.length > 0 ? (
        <Card className="p-6">
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <Link key={tag.name} href={`/blog/tag/${tag.slug}`}>
                  <Badge 
                    variant="outline" 
                    className="hover:bg-green-600 hover:text-white border-green-200 text-green-700 transition-colors cursor-pointer px-3 py-2 text-sm"
                    style={{
                      fontSize: Math.min(16, Math.max(12, 12 + (tag.posts_count * 0.5))) + 'px'
                    }}
                  >
                    #{tag.name}
                    <span className="ml-2 text-xs opacity-70 bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                      {tag.posts_count}
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tags found
            </h3>
            <p className="text-gray-500 mb-6">
              Tags will appear here once blog posts are created with tags.
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
}