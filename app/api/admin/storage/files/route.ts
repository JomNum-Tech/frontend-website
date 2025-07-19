import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFallbackFiles } from '@/lib/fallbackFiles';
import { list } from '@vercel/blob';


export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let files: Array<{
      id: string;
      name: string;
      url: string;
      size: number;
      type: string;
      uploadedAt: string;
      pathname: string;
      storageType: string;
      uploadedBy?: string;
    }> = [];

    // Try to get files from Vercel Blob if configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        console.log('Fetching files from Vercel Blob...');
        const { blobs } = await list();

        // Transform blobs to file metadata format
        const blobFiles = blobs.map(blob => ({
          id: blob.pathname.split('/').pop() || blob.pathname,
          name: blob.pathname.split('/').pop() || 'Unknown',
          url: blob.url,
          size: blob.size || 0,
          type: getMimeType(blob.pathname),
          uploadedAt: blob.uploadedAt?.toISOString() || new Date().toISOString(),
          pathname: blob.pathname,
          storageType: 'vercel-blob'
        }));

        files = [...files, ...blobFiles];
        console.log(`Found ${blobFiles.length} files in Vercel Blob`);
      } catch (error) {
        console.error('Failed to fetch from Vercel Blob:', error);
      }
    }

    // Add fallback files
    if (getFallbackFiles().length > 0) {
      console.log(`Found ${getFallbackFiles().length} fallback files`);
      files = [...files, ...getFallbackFiles()];
    }

    return NextResponse.json({
      success: true,
      files: files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    });

  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}

function getMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };

  return mimeTypes[extension || ''] || 'application/octet-stream';
} 