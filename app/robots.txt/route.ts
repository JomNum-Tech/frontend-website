export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com';
  
  const robots = `User-agent: *
Allow: /

# Blog specific rules
Allow: /blog
Allow: /blog/*
Allow: /blog/category/*
Allow: /blog/tag/*

# Disallow admin and auth pages
Disallow: /admin
Disallow: /api
Disallow: /_next
Disallow: /auth

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/blog-sitemap.xml

# Crawl delay
Crawl-delay: 1`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}