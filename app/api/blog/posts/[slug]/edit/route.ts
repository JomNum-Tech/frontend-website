import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { BlogService } from '@/lib/services/blogService';
import { initializeDatabase } from '@/lib/database';

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureDbInitialized();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    
    // Get the post by slug (including unpublished posts for the author)
    const posts = await BlogService.getPostsByAuthor(userId, true);
    const post = posts.find(p => p.slug === slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post for edit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureDbInitialized();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    
    // Get the post by slug (including unpublished posts for the author)
    const posts = await BlogService.getPostsByAuthor(userId, true);
    const existingPost = posts.find(p => p.slug === slug);
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

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

    const updatedPost = await BlogService.updatePost(
      existingPost.id,
      userId,
      { 
        title, 
        content, 
        excerpt, 
        published, 
        category, 
        tags, 
        featured_image 
      }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
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