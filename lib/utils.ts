import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detects and returns the content type of a file
 * Uses multiple fallback mechanisms to ensure a content type is always returned
 * 
 * @param file - The file object to detect content type for
 * @returns The detected content type string
 */
export function detectFileType(file: File): string {
  // First try: Use the browser-provided type if available and not empty
  if (file.type && file.type !== '') {
    return file.type;
  }
  
  // Second try: Infer from file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension) {
    // Common MIME type mapping for frequently used file types
    const mimeTypes: Record<string, string> = {
      // Images
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      
      // Documents
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Text
      'txt': 'text/plain',
      'csv': 'text/csv',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'ts': 'text/typescript',
      'json': 'application/json',
      'xml': 'application/xml',
      
      // Archives
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'flac': 'audio/flac',
      'm4a': 'audio/m4a',
      
      // Video
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'mkv': 'video/x-matroska',
      
      // Other
      'ttf': 'font/ttf',
      'otf': 'font/otf',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
    };
    
    if (extension in mimeTypes) {
      return mimeTypes[extension];
    }
  }
  
  // Third try: Use a generic type based on file name patterns
  const fileName = file.name.toLowerCase();
  
  if (/\.(jpe?g|png|gif|webp|bmp|svg|ico|tiff?)$/i.test(fileName)) {
    return 'image/unknown';
  }
  
  if (/\.(docx?|odt|rtf|pages|tex|md|markdown)$/i.test(fileName)) {
    return 'application/document';
  }
  
  if (/\.(xlsx?|ods|csv|numbers)$/i.test(fileName)) {
    return 'application/spreadsheet';
  }
  
  if (/\.(pptx?|odp|key)$/i.test(fileName)) {
    return 'application/presentation';
  }
  
  if (/\.(mp3|wav|ogg|flac|aac|m4a|wma)$/i.test(fileName)) {
    return 'audio/unknown';
  }
  
  if (/\.(mp4|webm|mov|avi|wmv|flv|mkv|m4v)$/i.test(fileName)) {
    return 'video/unknown';
  }
  
  if (/\.(zip|rar|7z|tar|gz|bz2)$/i.test(fileName)) {
    return 'application/archive';
  }
  
  // Last resort: generic binary
  return 'application/octet-stream';
}
