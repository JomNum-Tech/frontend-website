import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFallbackFiles } from '@/lib/fallbackFiles';
import { list } from '@vercel/blob';

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

function getFoldersFromPathnames(pathnames: string[], baseDir: string = ""): string[] {
  // Get unique first-level folders within baseDir
  const folders = new Set<string>();
  const prefix = baseDir ? baseDir.replace(/\/$/, '') + '/' : '';
  for (const pathname of pathnames) {
    if (!pathname.startsWith(prefix)) continue;
    const rest = pathname.slice(prefix.length);
    const parts = rest.split('/');
    if (parts.length > 1 && parts[0]) {
      folders.add(parts[0]);
    }
  }
  return Array.from(folders);
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const directory = url.searchParams.get('directory') || '';
    const listFolders = url.searchParams.get('listFolders') === 'true';

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
    let allPathnames: string[] = [];

    // Try to get files from Vercel Blob if configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { blobs } = await list();
        allPathnames = blobs.map(blob => blob.pathname);
        // Filter files by directory if provided
        const prefix = directory ? directory.replace(/\/$/, '') + '/' : '';
        const filteredBlobs = directory
          ? blobs.filter(blob => {
              // Only files directly in the directory (not subfolders)
              const rest = blob.pathname.slice(prefix.length);
              return blob.pathname.startsWith(prefix) && !rest.includes('/');
            })
          : blobs;
        const blobFiles = filteredBlobs.map(blob => ({
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
      } catch (error) {
        console.error('Failed to fetch from Vercel Blob:', error);
      }
    }

    // Add fallback files
    if (getFallbackFiles().length > 0) {
      const fallback = getFallbackFiles();
      allPathnames = allPathnames.concat(fallback.map(f => f.pathname));
      let fallbackFiles = fallback;
      if (directory) {
        const prefix = directory.replace(/\/$/, '') + '/';
        fallbackFiles = fallbackFiles.filter(file => {
          const rest = file.pathname.slice(prefix.length);
          return file.pathname.startsWith(prefix) && !rest.includes('/');
        });
      }
      files = [...files, ...fallbackFiles];
    }

    if (listFolders) {
      // Return unique folders in the current directory
      const folders = getFoldersFromPathnames(allPathnames, directory);
      return NextResponse.json({ success: true, folders });
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