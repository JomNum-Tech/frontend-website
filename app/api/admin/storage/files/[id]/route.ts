import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { del } from '@vercel/blob';
import { getFallbackFiles, removeFallbackFile } from '@/lib/fallbackFiles';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete file:', id);

    let deleted = false;

    // Try to delete from Vercel Blob if configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        // The Vercel Blob API expects the full pathname, not just the id.
        // Try to find the full pathname from the list of blobs.
        const { list } = await import('@vercel/blob');
        const { blobs } = await list();
        const blob = blobs.find(
          (b) => b.pathname.split('/').pop() === id || b.pathname === id
        );
        if (blob) {
          await del(blob.pathname);
          deleted = true;
          console.log('File deleted from Vercel Blob successfully');
        } else {
          console.warn('File not found in Vercel Blob:', id);
        }
      } catch (error) {
        console.error('Failed to delete from Vercel Blob:', error);
        // Continue to try fallback deletion
      }
    }

    // Try to delete from fallback storage
    if (!deleted) {
      try {
        // Remove from fallback files if present
        const fallbackFiles = getFallbackFiles();
        const fallbackFile = fallbackFiles.find(
          (file) => file.id === id || file.pathname === id
        );
        if (fallbackFile) {
          removeFallbackFile(fallbackFile.id);
          deleted = true;
          console.log('File deleted from fallback storage successfully');
        }
      } catch (error) {
        console.error('Failed to delete from fallback storage:', error);
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { error: 'File not found in any storage' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}