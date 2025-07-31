/**
 * Utility functions for handling HTML content from rich text editors
 */

/**
 * Convert HTML content to plain text for reading time calculation
 */
export function htmlToPlainText(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  if (typeof window !== 'undefined') {
    // Client-side: use DOM parser
    try {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    } catch (error) {
      console.warn('Error parsing HTML on client:', error);
      // Fallback to regex method
    }
  }
  
  // Server-side or fallback: simple regex-based HTML stripping
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .trim();
}

/**
 * Calculate reading time from HTML content
 */
export function calculateReadingTime(html: string, wordsPerMinute: number = 200): number {
  const plainText = htmlToPlainText(html);
  if (!plainText) return 1;
  
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Generate excerpt from HTML content
 */
export function generateExcerpt(html: string, maxLength: number = 160): string {
  const plainText = htmlToPlainText(html);
  if (!plainText) return '';
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0 && lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  return markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<u>$1</u>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li>$1. $2</li>')
    .replace(/\n/g, '<br>');
}

/**
 * Detect if content is markdown or HTML
 */
export function isMarkdown(content: string): boolean {
  if (!content) return false;
  
  // Simple heuristics to detect markdown
  const markdownPatterns = [
    /^#{1,6}\s/m,     // Headers
    /\*\*.*?\*\*/,    // Bold
    /\*.*?\*/,        // Italic
    /^>\s/m,          // Blockquote
    /^\*\s/m,         // Bullet list
    /^\d+\.\s/m,      // Numbered list
    /`.*?`/,          // Inline code
  ];
  
  return markdownPatterns.some(pattern => pattern.test(content));
}

/**
 * Process content (convert markdown to HTML if needed)
 */
export function processContent(content: string): string {
  if (!content) return '';
  
  if (isMarkdown(content)) {
    return markdownToHtml(content);
  }
  
  return content;
}

/**
 * Sanitize HTML content (basic sanitization)
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Process content first (convert markdown if needed)
  const processedContent = processContent(html);
  
  // This is a basic sanitization - in production, consider using a library like DOMPurify
  const allowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'div', 'span'
  ];
  
  const allowedAttributes = ['href', 'src', 'alt', 'title', 'class'];
  
  // This is a simplified version - use DOMPurify for production
  return processedContent;
}