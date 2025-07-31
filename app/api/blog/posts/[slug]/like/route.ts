import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { BlogService } from '@/lib/services/blogService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> | Promise<{ slug: string }> }
) {
  try {

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const post = await BlogService.getPostBySlug(resolvedParams.slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const result = await BlogService.toggleLike(post.id, userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}