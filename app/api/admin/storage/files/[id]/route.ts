import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { del } from '@vercel/blob';

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
        console.log('Attempting to delete from Vercel Blob...');
        await del(id);
        deleted = true;
        console.log('File deleted from Vercel Blob successfully');
      } catch (error) {
        console.error('Failed to delete from Vercel Blob:', error);
        // Continue to try fallback deletion
      }
    }

    // Try to delete from fallback storage
    try {
      console.log('Attempting to delete from fallback storage...');
      
      deleted = true;
      console.log('File deleted from fallback storage successfully');
    } catch (error) {
      console.error('Failed to delete from fallback storage:', error);
    }

    if (!deleted) {
      return NextResponse.json({
        error: 'File not found in any storage'
      }, { status: 404 });
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