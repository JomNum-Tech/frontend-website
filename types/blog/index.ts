export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  author_name: string;
  author_image?: string;
  slug: string;
  published: boolean;
  featured_image?: string;
  tags?: string[];
  category?: string;
  reading_time?: number;
  views_count?: number;
  likes_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
  // Server-formatted timestamps
  created_at_formatted?: string;
  updated_at_formatted?: string;
  is_edited?: boolean;
}

export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  category?: string;
  tags?: string[];
  featured_image?: string;
  reading_time?: number;
}

export interface UpdateBlogPostData {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  category?: string;
  tags?: string[];
  featured_image?: string;
}

export interface UserFollow {
  id: number;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  image?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following?: boolean;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: BlogAuthor;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  posts_count: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
}

export interface BlogComment {
  id: number;
  post_id: number;
  author_id: string;
  author_name: string;
  author_image?: string;
  content: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  // Server-formatted timestamp
  timestamp_formatted?: string;
}

export interface BlogLike {
  id: number;
  post_id: number;
  user_id: string;
  created_at: string;
}

export interface BlogView {
  id: number;
  post_id: number;
  user_id?: string;
  ip_address?: string;
  created_at: string;
}

export interface BlogStats {
  total_posts: number;
  total_authors: number;
  total_views: number;
  total_likes: number;
  popular_tags: BlogTag[];
  trending_posts: BlogPost[];
}

export interface FeaturedPost extends BlogPost {
  is_featured: boolean;
  featured_order?: number;
}

export interface BlogFeed {
  featured_posts: FeaturedPost[];
  recent_posts: BlogPost[];
  trending_posts: BlogPost[];
  categories: BlogCategory[];
  popular_tags: BlogTag[];
}