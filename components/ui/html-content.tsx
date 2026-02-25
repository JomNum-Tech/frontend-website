"use client";

import { sanitizeHtml } from "@/lib/utils/htmlUtils";

interface HtmlContentProps {
  content: string;
  className?: string;
}

export function HtmlContent({ content, className = "" }: HtmlContentProps) {
  // Sanitize the HTML content before rendering
  const sanitizedContent = sanitizeHtml(content);

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        // Custom styles for better rendering
        lineHeight: '1.7',
        fontSize: '16px',
      }}
    />
  );
}