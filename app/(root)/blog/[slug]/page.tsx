import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { BlogService } from "@/lib/services/blogService";
import { FollowService } from "@/lib/services/followService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FollowButton } from "@/components/blog/FollowButton";
import { LikeButton } from "@/components/blog/LikeButton";
import { CommentSection } from "@/components/blog/CommentSection";
import { BlogPostClient } from "@/components/blog/BlogPostClient";
import { ServerTimestamp } from "@/components/ui/ServerTimestamp";
import { Eye, Clock, Edit, Share2, Bookmark } from "lucide-react";
import { BlogPost, BlogComment } from "@/types/blog";
import { Metadata } from "next";
import { BlogJsonLd } from "@/components/seo/BlogJsonLd";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(
  slug: string,
  userId?: string
): Promise<(BlogPost & { comments: BlogComment[]; is_liked: boolean }) | null> {
  try {
    // This now automatically fetches Clerk profile images for the author and commenters
    const post = await BlogService.getPostWithDetails(slug, userId);

    if (post && userId) {
      await BlogService.incrementViewCount(post.id, userId);
    }

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

async function getAuthorInfo(authorId: string, currentUserId?: string) {
  try {
    // This now automatically fetches Clerk profile data including image
    return await FollowService.getAuthorInfo(authorId, currentUserId);
  } catch (error) {
    console.error("Error fetching author info:", error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const post = await getBlogPost(slug);
    
    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const title = `${post.title} | Blog`;
    const description = post.excerpt || post.content.substring(0, 160) + "...";
    const publishedTime = new Date(post.created_at).toISOString();
    const modifiedTime = post.updated_at ? new Date(post.updated_at).toISOString() : publishedTime;

    return {
      title,
      description,
      keywords: post.tags || [],
      authors: [{ name: post.author_name }],
      openGraph: {
        title,
        description,
        type: "article",
        url: `/blog/${slug}`,
        siteName: "Learning Platform",
        publishedTime,
        modifiedTime,
        authors: [post.author_name],
        tags: post.tags || [],
        images: post.featured_image ? [
          {
            url: post.featured_image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ] : [
          {
            url: "/og-blog-default.jpg",
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [post.featured_image || "/og-blog-default.jpg"],
        creator: `@${post.author_name.replace(/\s+/g, '').toLowerCase()}`,
      },
      alternates: {
        canonical: `/blog/${slug}`,
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
      other: {
        "article:author": post.author_name,
        "article:published_time": publishedTime,
        "article:modified_time": modifiedTime,
        "article:section": post.category || "General",
        "article:tag": post.tags?.join(", ") || "",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "Read our latest blog post with insights and tutorials.",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const { userId } = await auth();

    const post = await getBlogPost(slug, userId || undefined);

    if (!post) {
      return <BlogPostClient slug={slug} />;
    }

    const authorInfo = await getAuthorInfo(post.author_id, userId || undefined);
    const isOwner = userId === post.author_id;

    return (
      <>
        <BlogJsonLd post={post} url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/blog/${post.slug}`} />
        <div className="container mx-auto px-12 py-8">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="justify-between aspect-video overflow-hidden rounded-lg mb-8 relative shadow-lg max-w-2xl mx-auto">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>
        )}

        <Card>
          <CardHeader className="pb-6">
            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-blue-200 shadow-sm">
                  <AvatarImage
                    src={post.author_image || ""}
                    alt={post.author_name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                    {post.author_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg leading-tight text-gray-900">
                    {post.author_name}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <ServerTimestamp 
                        formattedTime={post.created_at_formatted || 'Unknown time'}
                      />
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-blue-400" />
                      {post.views_count || 0} views
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                        {post.reading_time || 5} min read
                      </span>
                    </span>
                  </div>
                  {authorInfo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium text-gray-700">
                        {authorInfo.followers_count}
                      </span>{" "}
                      followers
                      <span className="mx-1">•</span>
                      <span className="font-medium text-gray-700">
                        {authorInfo.posts_count}
                      </span>{" "}
                      posts
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {post.category && (
                  <Link href={`/blog/category/${encodeURIComponent(post.category)}`}>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      {post.category}
                    </Badge>
                  </Link>
                )}
                {post.published && (
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Published
                  </Badge>
                )}
                {isOwner && (
                  <Link href={`/blog/${post.slug}/edit`} className="hover:underline">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="mr-1 h-4 w-4 text-blue-500" />
                      Edit
                    </Button>
                  </Link>
                )}
                {userId && userId !== post.author_id && authorInfo && (
                  <FollowButton
                    userId={post.author_id}
                    isFollowing={authorInfo.is_following || false}
                  />
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3 text-gray-900 tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg sm:text-xl text-gray-600 mb-5 font-medium">
                {post.excerpt}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs sm:text-sm bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 rounded-full font-semibold hover:bg-blue-100 transition"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-b py-4 gap-3 sm:gap-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <LikeButton
                  postSlug={post.slug}
                  initialLiked={post.is_liked || false}
                  initialCount={post.likes_count || 0}
                  userId={userId || undefined}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 transition"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 transition"
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </div>

              <div className="text-xs sm:text-sm text-gray-500 font-medium text-right">
                {post.updated_at !== post.created_at && (
                  <span className="inline-flex items-center gap-1">
                    <span className="hidden sm:inline">Last updated</span>
                    <ServerTimestamp 
                        formattedTime={post.created_at_formatted || 'Unknown time'}
                      />
                  </span>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Content */}
            <div className="prose prose-lg max-w-none mb-10 px-1 sm:px-2 md:px-4 transition-colors duration-200 bg-white/90 rounded-lg">
              {post.content.split("\n").map((paragraph, index) =>
                paragraph.trim() ? (
                  <p
                    key={index}
                    className="mb-5 leading-relaxed text-gray-800 dark:text-gray-100 tracking-wide text-[1.08rem] first:mt-0 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ) : (
                  <div key={index} className="my-3" />
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection
            postSlug={post.slug}
            initialComments={post.comments || []}
            userId={userId || undefined}
          />
        </div>
      </div>
      </>
    );
  } catch (error) {
    console.error(
      "Server-side rendering failed, falling back to client-side:",
      error
    );
    return <BlogPostClient slug={slug} />;
  }
}
