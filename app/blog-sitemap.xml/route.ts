import { BlogService } from "@/lib/services/blogService";

export async function GET() {
  try {
    // Get all published posts
    const posts = await BlogService.getAllPosts(1, 1000); // Get a large number of posts
    const categories = await BlogService.getCategories();
    const tags = await BlogService.getPopularTags(100);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com';

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main blog page -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Categories pages -->
  <url>
    <loc>${baseUrl}/blog/categories</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Tags pages -->
  <url>
    <loc>${baseUrl}/blog/tags</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Individual blog posts -->
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at || post.created_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Category pages -->
  ${categories.map(category => `
  <url>
    <loc>${baseUrl}/blog/category/${encodeURIComponent(category.slug)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Tag pages -->
  ${tags.map(tag => `
  <url>
    <loc>${baseUrl}/blog/tag/${encodeURIComponent(tag.slug)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}