import { BlogService } from "@/lib/services/blogService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Folder, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Categories - Browse by Topic",
  description: "Explore all blog categories and discover content organized by topics. Find articles, tutorials, and insights across various subjects from our community.",
  keywords: [
    "blog categories",
    "topics",
    "browse content",
    "articles by category",
    "tutorials",
    "insights",
    "organized content"
  ],
  openGraph: {
    title: "Blog Categories - Browse by Topic",
    description: "Explore all blog categories and discover content organized by topics.",
    type: "website",
    url: "/blog/categories",
    siteName: "Learning Platform",
    images: [
      {
        url: "/og-blog-categories.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Categories - Browse by Topic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Categories - Browse by Topic",
    description: "Explore all blog categories and discover content organized by topics.",
    images: ["/og-blog-categories.jpg"],
  },
  alternates: {
    canonical: "/blog/categories",
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

async function getAllCategories() {
  try {
    const categories = await BlogService.getCategories();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getAllCategories();

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
          <Folder className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            All Categories
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Browse blog posts by category</p>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 border-orange-200 group-hover:border-orange-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-orange-500" />
                      <span className="text-lg font-semibold group-hover:text-orange-700 transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-orange-400 group-hover:text-orange-700 transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200"
                    >
                      {category.posts_count}{" "}
                      {category.posts_count === 1 ? "post" : "posts"}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      Browse →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-6">
              Categories will appear here once blog posts are created.
            </p>
            <Link href="/blog">
              <Button variant="outline">Browse All Posts</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
