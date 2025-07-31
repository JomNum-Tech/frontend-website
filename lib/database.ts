import { neon } from "@neondatabase/serverless";

if (!process.env.NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL is not defined");
}

export const sql = neon(process.env.NEON_DATABASE_URL);

// Database initialization
export async function initializeDatabase() {
  try {
    // First, add new columns to existing blog_posts table
    await sql`
      ALTER TABLE blog_posts 
      ADD COLUMN IF NOT EXISTS featured_image VARCHAR(500),
      ADD COLUMN IF NOT EXISTS category VARCHAR(100),
      ADD COLUMN IF NOT EXISTS tags TEXT[],
      ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS featured_order INTEGER
    `;

    // Update timestamp columns to use TIMESTAMPTZ for proper timezone handling
    try {
      await sql`
        ALTER TABLE blog_posts 
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'
      `;
    } catch (error) {
      console.warn('Warning: Could not update blog_posts timestamp columns:', error);
    }

    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        posts_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create tags table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        posts_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create comments table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
        author_id VARCHAR(255) NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_image VARCHAR(500),
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES blog_comments(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Update existing comment timestamp columns to use TIMESTAMPTZ
    try {
      await sql`
        ALTER TABLE blog_comments 
        ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'UTC',
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'UTC'
      `;
    } catch (error) {
      console.warn('Warning: Could not update blog_comments timestamp columns:', error);
    }

    // Create trigger function for updating updated_at timestamp
    try {
      await sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql'
      `;

      // Create trigger for blog_comments table
      await sql`
        DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments
      `;

      await sql`
        CREATE TRIGGER update_blog_comments_updated_at
          BEFORE UPDATE ON blog_comments
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
      `;

      // Create trigger for blog_posts table (if not already exists)
      await sql`
        DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts
      `;

      await sql`
        CREATE TRIGGER update_blog_posts_updated_at
          BEFORE UPDATE ON blog_posts
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column()
      `;
    } catch (error) {
      console.warn("Warning: Could not create updated_at triggers:", error);
      // Continue without triggers - manual timestamp updates will still work
    }

    // Create likes table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_likes (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      )
    `;

    // Create views table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_views (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
        user_id VARCHAR(255),
        ip_address VARCHAR(45),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create user_follows table for following functionality
    await sql`
      CREATE TABLE IF NOT EXISTS user_follows (
        id SERIAL PRIMARY KEY,
        follower_id VARCHAR(255) NOT NULL,
        following_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured, featured_order)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(views_count)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_likes ON blog_posts(likes_count)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_likes_post ON blog_likes(post_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_views_post ON blog_views(post_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_follows_following ON user_follows(following_id)`;

    // Insert default categories
    await sql`
      INSERT INTO blog_categories (name, slug, description) VALUES
      ('Technology', 'technology', 'Latest trends and insights in technology'),
      ('Education', 'education', 'Educational content and learning resources'),
      ('Programming', 'programming', 'Programming tutorials and best practices'),
      ('Web Development', 'web-development', 'Web development tips and techniques'),
      ('Career', 'career', 'Career advice and professional development'),
      ('Tutorials', 'tutorials', 'Step-by-step guides and tutorials')
      ON CONFLICT (slug) DO NOTHING
    `;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}
