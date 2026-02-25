import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const posts = await BlogService.getAllPosts(page, limit);
    const totalCount = await BlogService.getTotalPostsCount();

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const postId = parseInt(resolvedParams.slug);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      content, 
      excerpt, 
      published, 
      category, 
      tags, 
      featured_image 
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const posts = await BlogService.getPostsByAuthor(userId, true);
    const post = posts.find(p => p.id === postId);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or access denied' },
        { status: 404 }
      );
    }

    const updatedPost = await BlogService.updatePost(postId, userId, {
      title,
      content,
      excerpt,
      published,
      category,
      tags,
      featured_image
    });

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Post not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}