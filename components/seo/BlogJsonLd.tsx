import { BlogPost } from "@/types/blog";

interface BlogJsonLdProps {
  post: BlogPost;
  url: string;
}

export function BlogJsonLd({ post, url }: BlogJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    image: post.featured_image ? [post.featured_image] : [],
    datePublished: new Date(post.created_at).toISOString(),
    dateModified: post.updated_at ? new Date(post.updated_at).toISOString() : new Date(post.created_at).toISOString(),
    author: {
      "@type": "Person",
      name: post.author_name,
      image: post.author_image,
    },
    publisher: {
      "@type": "Organization",
      name: "Learning Platform",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: post.category || "General",
    keywords: post.tags?.join(", ") || "",
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.reading_time || 5}M`,
    inLanguage: "en-US",
    url: url,
    isAccessibleForFree: true,
    ...(post.views_count && {
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ReadAction",
          userInteractionCount: post.views_count,
        },
        ...(post.likes_count ? [{
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/LikeAction",
          userInteractionCount: post.likes_count,
        }] : []),
        ...(post.comments_count ? [{
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: post.comments_count,
        }] : []),
      ],
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BlogListJsonLdProps {
  posts: BlogPost[];
  url: string;
  title: string;
  description: string;
}

export function BlogListJsonLd({ posts, url, title, description }: BlogListJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: title,
    description: description,
    url: url,
    publisher: {
      "@type": "Organization",
      name: "Learning Platform",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
    blogPost: posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      image: post.featured_image,
      datePublished: new Date(post.created_at).toISOString(),
      dateModified: post.updated_at ? new Date(post.updated_at).toISOString() : new Date(post.created_at).toISOString(),
      author: {
        "@type": "Person",
        name: post.author_name,
        image: post.author_image,
      },
      url: `/blog/${post.slug}`,
      articleSection: post.category || "General",
      keywords: post.tags?.join(", ") || "",
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}