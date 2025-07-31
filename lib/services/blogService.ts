import { sql } from "@/lib/database";
import { clerkClient } from "@clerk/nextjs/server";
import {
  formatServerTimestamp,
  formatServerCommentTimestamp,
  formatServerPostTimestamp,
} from "@/lib/utils/serverTimestamp";
import {
  BlogPost,
  CreateBlogPostData,
  UpdateBlogPostData,
  BlogCategory,
  BlogTag,
  BlogFeed,
  FeaturedPost,
  BlogStats,
  BlogComment,
} from "@/types/blog";

export class BlogService {
  // Helper method to fetch user info from Clerk
  private static async getUserInfo(
    userId: string
  ): Promise<{ name: string; image: string | undefined }> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);

      const name =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`.trim()
          : user.username ||
            user.emailAddresses[0]?.emailAddress ||
            "Anonymous User";

      const image = user.imageUrl || undefined;

      return { name, image };
    } catch (error) {
      console.error("Error fetching user from Clerk:", error);
      return { name: "Anonymous User", image: undefined };
    }
  }

  // Generate slug from title
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  // Create a new blog post
  static async createPost(
    authorId: string,
    data: CreateBlogPostData
  ): Promise<BlogPost> {
    // Fetch author information from Clerk
    const { name: authorName, image: authorImage } = await this.getUserInfo(
      authorId
    );

    const slug = this.generateSlug(data.title);
    const excerpt = data.excerpt || data.content.substring(0, 200) + "...";
    const readingTime =
      data.reading_time || this.calculateReadingTime(data.content);

    const result = await sql`
      INSERT INTO blog_posts (
        title, content, excerpt, author_id, author_name, author_image, slug, published,
        category, tags, featured_image, reading_time
      )
      VALUES (
        ${data.title}, ${data.content}, ${excerpt}, ${authorId}, ${authorName}, 
        ${authorImage}, ${slug}, ${data.published || false}, ${data.category},
        ${data.tags}, ${data.featured_image}, ${readingTime}
      )
      RETURNING *
    `;

    return result[0] as BlogPost;
  }

  // Get all published blog posts with pagination
  static async getAllPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<BlogPost[]> {
    const offset = (page - 1) * limit;

    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE published = true 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Add server-formatted timestamps to each post
    return (result as BlogPost[]).map((post) => {
      const timestampInfo = formatServerPostTimestamp(
        post.created_at,
        post.updated_at
      );
      return {
        ...post,
        created_at_formatted: timestampInfo.created,
        updated_at_formatted: timestampInfo.updated,
        is_edited: timestampInfo.isEdited,
      };
    });
  }

  // Get blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE slug = ${slug} AND published = true
    `;

    if (result.length === 0) return null;

    const post = result[0] as BlogPost;

    // Add server-formatted timestamps
    const timestampInfo = formatServerPostTimestamp(
      post.created_at,
      post.updated_at
    );
    post.created_at_formatted = timestampInfo.created;
    post.updated_at_formatted = timestampInfo.updated;
    post.is_edited = timestampInfo.isEdited;

    return post;
  }

  // Get posts by author
  static async getPostsByAuthor(
    authorId: string,
    includeUnpublished: boolean = false
  ): Promise<BlogPost[]> {
    const query = includeUnpublished
      ? sql`SELECT * FROM blog_posts WHERE author_id = ${authorId} ORDER BY created_at DESC`
      : sql`SELECT * FROM blog_posts WHERE author_id = ${authorId} AND published = true ORDER BY created_at DESC`;

    const result = await query;
    return result as BlogPost[];
  }

  // Update blog post
  static async updatePost(
    postId: number,
    authorId: string,
    data: UpdateBlogPostData
  ): Promise<BlogPost | null> {
    // Get current post to check if it exists and belongs to user
    const currentPost = await sql`
      SELECT * FROM blog_posts WHERE id = ${postId} AND author_id = ${authorId}
    `;

    if (currentPost.length === 0) {
      return null;
    }

    // Prepare update data
    const updateData: Partial<BlogPost> = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
      updateData.slug = this.generateSlug(data.title);
    }

    if (data.content !== undefined) {
      updateData.content = data.content;
      updateData.reading_time = this.calculateReadingTime(data.content);
    }

    if (data.excerpt !== undefined) {
      updateData.excerpt = data.excerpt;
    }

    if (data.published !== undefined) {
      updateData.published = data.published;
    }

    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    if (data.tags !== undefined) {
      updateData.tags = data.tags;
    }

    if (data.featured_image !== undefined) {
      updateData.featured_image = data.featured_image;
    }

    // Perform the update
    const result = await sql`
      UPDATE blog_posts 
      SET 
        title = COALESCE(${updateData.title}, title),
        content = COALESCE(${updateData.content}, content),
        excerpt = COALESCE(${updateData.excerpt}, excerpt),
        published = COALESCE(${updateData.published}, published),
        category = COALESCE(${updateData.category}, category),
        tags = COALESCE(${updateData.tags}, tags),
        featured_image = COALESCE(${updateData.featured_image}, featured_image),
        slug = COALESCE(${updateData.slug}, slug),
        reading_time = COALESCE(${updateData.reading_time}, reading_time),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${postId} AND author_id = ${authorId}
      RETURNING *
    `;

    return (result[0] as BlogPost) || null;
  }

  // Delete blog post
  static async deletePost(postId: number, authorId: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM blog_posts 
      WHERE id = ${postId} AND author_id = ${authorId}
    `;

    return result.length > 0;
  }

  // Get total posts count
  static async getTotalPostsCount(): Promise<number> {
    const result = await sql`
      SELECT COUNT(*) as count FROM blog_posts WHERE published = true
    `;

    return parseInt(result[0].count);
  }

  // Calculate reading time based on content
  static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Get featured posts
  static async getFeaturedPosts(limit: number = 5): Promise<FeaturedPost[]> {
    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE published = true AND is_featured = true 
      ORDER BY featured_order ASC, created_at DESC 
      LIMIT ${limit}
    `;

    return result as FeaturedPost[];
  }

  // Get trending posts (based on views and likes)
  static async getTrendingPosts(limit: number = 10): Promise<BlogPost[]> {
    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE published = true 
      ORDER BY (views_count * 0.3 + likes_count * 0.7) DESC, created_at DESC 
      LIMIT ${limit}
    `;

    return result as BlogPost[];
  }

  // Get posts by category
  static async getPostsByCategory(
    categorySlug: string,
    userId?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BlogPost[]> {
    const offset = (page - 1) * limit;

    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE published = true AND category = ${categorySlug}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Add server-formatted timestamps to each post
    return (result as BlogPost[]).map((post) => {
      const timestampInfo = formatServerPostTimestamp(
        post.created_at,
        post.updated_at
      );
      return {
        ...post,
        created_at_formatted: timestampInfo.created,
        updated_at_formatted: timestampInfo.updated,
        is_edited: timestampInfo.isEdited,
      };
    });
  }

  // Get category statistics
  static async getCategoryStats(category: string): Promise<{
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
  }> {
    const [postsResult, viewsResult, likesResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM blog_posts WHERE published = true AND category = ${category}`,
      sql`SELECT SUM(views_count) as count FROM blog_posts WHERE published = true AND category = ${category}`,
      sql`SELECT SUM(likes_count) as count FROM blog_posts WHERE published = true AND category = ${category}`,
    ]);

    return {
      totalPosts: parseInt(postsResult[0].count),
      totalViews: parseInt(viewsResult[0].count || "0"),
      totalLikes: parseInt(likesResult[0].count || "0"),
    };
  }

  // Get posts by tag
  static async getPostsByTag(
    tag: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BlogPost[]> {
    const offset = (page - 1) * limit;

    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE published = true AND ${tag} = ANY(tags)
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Add server-formatted timestamps to each post
    return (result as BlogPost[]).map((post) => {
      const timestampInfo = formatServerPostTimestamp(
        post.created_at,
        post.updated_at
      );
      return {
        ...post,
        created_at_formatted: timestampInfo.created,
        updated_at_formatted: timestampInfo.updated,
        is_edited: timestampInfo.isEdited,
      };
    });
  }

  // Search posts
  static async searchPosts(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BlogPost[]> {
    const offset = (page - 1) * limit;

    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE published = true AND (
        title ILIKE ${"%" + query + "%"} OR 
        content ILIKE ${"%" + query + "%"} OR 
        excerpt ILIKE ${"%" + query + "%"}
      )
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    return result as BlogPost[];
  }

  // Get all categories
  static async getCategories(): Promise<BlogCategory[]> {
    const result = await sql`
      SELECT c.id, c.name, c.slug, c.description, c.created_at, COUNT(p.id) as posts_count
      FROM blog_categories c
      LEFT JOIN blog_posts p ON p.category = c.slug AND p.published = true
      GROUP BY c.id, c.name, c.slug, c.description, c.created_at
      ORDER BY COUNT(p.id) DESC, c.name ASC
    `;

    return result as BlogCategory[];
  }

  // Get popular tags
  static async getPopularTags(limit: number = 20): Promise<BlogTag[]> {
    const result = await sql`
      SELECT 
        tag as name,
        tag as slug,
        COUNT(*) as posts_count
      FROM blog_posts, unnest(tags) as tag
      WHERE published = true
      GROUP BY tag
      ORDER BY posts_count DESC, tag ASC
      LIMIT ${limit}
    `;

    return result.map((row) => ({
      id: 0, // We'll use name as identifier
      name: row.name,
      slug: row.slug,
      posts_count: parseInt(row.posts_count),
    })) as BlogTag[];
  }

  // Get blog feed (Medium-like homepage)
  static async getBlogFeed(): Promise<BlogFeed> {
    const [featuredPosts, recentPosts, trendingPosts, categories, popularTags] =
      await Promise.all([
        this.getFeaturedPosts(3),
        this.getAllPosts(1, 8),
        this.getTrendingPosts(6),
        this.getCategories(),
        this.getPopularTags(15),
      ]);

    return {
      featured_posts: featuredPosts,
      recent_posts: recentPosts,
      trending_posts: trendingPosts,
      categories,
      popular_tags: popularTags,
    };
  }

  // Get blog statistics
  static async getBlogStats(): Promise<BlogStats> {
    const [postsResult, authorsResult, viewsResult, likesResult] =
      await Promise.all([
        sql`SELECT COUNT(*) as count FROM blog_posts WHERE published = true`,
        sql`SELECT COUNT(DISTINCT author_id) as count FROM blog_posts WHERE published = true`,
        sql`SELECT SUM(views_count) as count FROM blog_posts WHERE published = true`,
        sql`SELECT SUM(likes_count) as count FROM blog_posts WHERE published = true`,
      ]);

    const [trendingPosts, popularTags] = await Promise.all([
      this.getTrendingPosts(5),
      this.getPopularTags(10),
    ]);

    return {
      total_posts: parseInt(postsResult[0].count),
      total_authors: parseInt(authorsResult[0].count),
      total_views: parseInt(viewsResult[0].count || "0"),
      total_likes: parseInt(likesResult[0].count || "0"),
      popular_tags: popularTags,
      trending_posts: trendingPosts,
    };
  }

  // Increment view count
  static async incrementViewCount(
    postId: number,
    userId?: string,
    ipAddress?: string
  ): Promise<void> {
    // Record the view
    await sql`
      INSERT INTO blog_views (post_id, user_id, ip_address)
      VALUES (${postId}, ${userId}, ${ipAddress})
    `;

    // Update the post's view count
    await sql`
      UPDATE blog_posts 
      SET views_count = views_count + 1 
      WHERE id = ${postId}
    `;
  }

  // Toggle like on a post
  static async toggleLike(
    postId: number,
    userId: string
  ): Promise<{ liked: boolean; likesCount: number }> {
    // Check if already liked
    const existingLike = await sql`
      SELECT id FROM blog_likes WHERE post_id = ${postId} AND user_id = ${userId}
    `;

    if (existingLike.length > 0) {
      // Unlike
      await sql`DELETE FROM blog_likes WHERE post_id = ${postId} AND user_id = ${userId}`;
      await sql`UPDATE blog_posts SET likes_count = likes_count - 1 WHERE id = ${postId}`;

      const result =
        await sql`SELECT likes_count FROM blog_posts WHERE id = ${postId}`;
      return { liked: false, likesCount: result[0].likes_count };
    } else {
      // Like
      await sql`INSERT INTO blog_likes (post_id, user_id) VALUES (${postId}, ${userId})`;
      await sql`UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = ${postId}`;

      const result =
        await sql`SELECT likes_count FROM blog_posts WHERE id = ${postId}`;
      return { liked: true, likesCount: result[0].likes_count };
    }
  }

  // Check if user liked a post
  static async isPostLiked(postId: number, userId: string): Promise<boolean> {
    const result = await sql`
      SELECT id FROM blog_likes WHERE post_id = ${postId} AND user_id = ${userId}
    `;
    return result.length > 0;
  }

  // Add comment to a post
  static async addComment(
    postId: number,
    authorId: string,
    content: string,
    parentId?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    // Fetch author information from Clerk
    const { name: authorName, image: authorImage } = await this.getUserInfo(
      authorId
    );

    const result = await sql`
      INSERT INTO blog_comments (post_id, author_id, author_name, author_image, content, parent_id)
      VALUES (${postId}, ${authorId}, ${authorName}, ${authorImage}, ${content}, ${
      parentId || null
    })
      RETURNING *
    `;

    // Update comment count
    await sql`
      UPDATE blog_posts 
      SET comments_count = comments_count + 1 
      WHERE id = ${postId}
    `;

    return result[0];
  }

  // Get comments for a post
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getComments(postId: number): Promise<any[]> {
    const result = await sql`
      SELECT * FROM blog_comments 
      WHERE post_id = ${postId} 
      ORDER BY created_at ASC
    `;

    // Add server-formatted timestamps to each comment
    return result.map((comment) => ({
      ...comment,
      timestamp_formatted: formatServerCommentTimestamp(
        comment.created_at,
        comment.updated_at
      ),
    }));
  }

  // Update comment
  static async updateComment(
    commentId: number,
    authorId: string,
    content: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const result = await sql`
      UPDATE blog_comments 
      SET content = ${content}
      WHERE id = ${commentId} AND author_id = ${authorId}
      RETURNING *
    `;

    return result[0] || null;
  }

  // Delete comment
  static async deleteComment(
    commentId: number,
    authorId: string
  ): Promise<boolean> {
    // Get the comment to check post_id for updating count
    const comment = await sql`
      SELECT post_id FROM blog_comments WHERE id = ${commentId} AND author_id = ${authorId}
    `;

    if (comment.length === 0) {
      return false;
    }

    const result = await sql`
      DELETE FROM blog_comments 
      WHERE id = ${commentId} AND author_id = ${authorId}
    `;

    if (result.length > 0) {
      // Update comment count
      await sql`
        UPDATE blog_posts 
        SET comments_count = comments_count - 1 
        WHERE id = ${comment[0].post_id}
      `;
      return true;
    }

    return false;
  }

  // Get post with full details (for detail page)
  static async getPostWithDetails(
    slug: string,
    userId?: string
  ): Promise<
    (BlogPost & { comments: BlogComment[]; is_liked: boolean }) | null
  > {
    const post = await this.getPostBySlug(slug);
    if (!post) return null;

    const [comments, isLiked] = await Promise.all([
      this.getComments(post.id),
      userId ? this.isPostLiked(post.id, userId) : false,
    ]);

    return {
      ...post,
      comments: comments as BlogComment[],
      is_liked: isLiked,
    };
  }
}
