import { BlogService } from "@/lib/services/blogService";

export async function GET() {
  try {
    const posts = await BlogService.getAllPosts(1, 50); // Get latest 50 posts
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yoursite.com";

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Learning Platform Blog</title>
    <description>Insights, tutorials, and stories from our community of learners and creators</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>noreply@yoursite.com (Learning Platform)</managingEditor>
    <webMaster>noreply@yoursite.com (Learning Platform)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Learning Platform Blog</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${
        post.excerpt || post.content.substring(0, 200) + "..."
      }]]></description>
      <content:encoded><![CDATA[${post.content.replace(
        /\n/g,
        "<br>"
      )}]]></content:encoded>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <author>noreply@yoursite.com (${post.author_name})</author>
      ${
        post.category ? `<category><![CDATA[${post.category}]]></category>` : ""
      }
      ${
        post.featured_image
          ? `<enclosure url="${post.featured_image}" type="image/jpeg"/>`
          : ""
      }
      ${
        post.tags
          ? post.tags
              .map((tag) => `<category><![CDATA[${tag}]]></category>`)
              .join("")
          : ""
      }
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
