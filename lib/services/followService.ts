import { sql } from "@/lib/database";
import { UserFollow, BlogAuthor } from "@/types/blog";

export class FollowService {
  // Follow a user
  static async followUser(
    followerId: string,
    followingId: string
  ): Promise<boolean> {
    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    try {
      await sql`
        INSERT INTO user_follows (follower_id, following_id)
        VALUES (${followerId}, ${followingId})
        ON CONFLICT (follower_id, following_id) DO NOTHING
      `;
      return true;
    } catch (error) {
      console.error("Error following user:", error);
      return false;
    }
  }

  // Unfollow a user
  static async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<boolean> {
    try {
      const result = await sql`
        DELETE FROM user_follows 
        WHERE follower_id = ${followerId} AND following_id = ${followingId}
      `;
      return result.length > 0;
    } catch (error) {
      console.error("Error unfollowing user:", error);
      return false;
    }
  }

  // Check if user is following another user
  static async isFollowing(
    followerId: string,
    followingId: string
  ): Promise<boolean> {
    const result = await sql`
      SELECT 1 FROM user_follows 
      WHERE follower_id = ${followerId} AND following_id = ${followingId}
    `;
    return result.length > 0;
  }

  // Get followers of a user
  static async getFollowers(userId: string): Promise<string[]> {
    const result = await sql`
      SELECT follower_id FROM user_follows 
      WHERE following_id = ${userId}
    `;
    return result.map((row) => row.follower_id);
  }

  // Get users that a user is following
  static async getFollowing(userId: string): Promise<string[]> {
    const result = await sql`
      SELECT following_id FROM user_follows 
      WHERE follower_id = ${userId}
    `;
    return result.map((row) => row.following_id);
  }

  // Get followers count
  static async getFollowersCount(userId: string): Promise<number> {
    const result = await sql`
      SELECT COUNT(*) as count FROM user_follows 
      WHERE following_id = ${userId}
    `;
    return parseInt(result[0].count);
  }

  // Get following count
  static async getFollowingCount(userId: string): Promise<number> {
    const result = await sql`
      SELECT COUNT(*) as count FROM user_follows 
      WHERE follower_id = ${userId}
    `;
    return parseInt(result[0].count);
  }

  // Get posts count for a user
  static async getPostsCount(userId: string): Promise<number> {
    const result = await sql`
      SELECT COUNT(*) as count FROM blog_posts 
      WHERE author_id = ${userId} AND published = true
    `;
    return parseInt(result[0].count);
  }

  // Get author info with stats
  static async getAuthorInfo(
    userId: string,
    currentUserId?: string
  ): Promise<BlogAuthor> {
    const [followersCount, followingCount, postsCount] = await Promise.all([
      this.getFollowersCount(userId),
      this.getFollowingCount(userId),
      this.getPostsCount(userId),
    ]);

    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      isFollowing = await this.isFollowing(currentUserId, userId);
    }

    // Note: In a real app, you'd get user info from Clerk
    // For now, we'll use placeholder data
    return {
      id: userId,
      name: "User", // This should come from Clerk user data
      image: undefined,
      followers_count: followersCount,
      following_count: followingCount,
      posts_count: postsCount,
      is_following: isFollowing,
    };
  }

  // Get posts from followed users (feed)
  static async getFollowingFeed(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    const result = await sql`
      SELECT bp.* FROM blog_posts bp
      INNER JOIN user_follows uf ON bp.author_id = uf.following_id
      WHERE uf.follower_id = ${userId} AND bp.published = true
      ORDER BY bp.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return result;
  }
}
