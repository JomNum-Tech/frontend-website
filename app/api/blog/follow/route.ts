import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { FollowService } from '@/lib/services/followService';
import { initializeDatabase } from '@/lib/database';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// POST /api/blog/follow - Follow a user
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { followingId } = await request.json();

    if (!followingId) {
      return NextResponse.json(
        { error: 'Following ID is required' },
        { status: 400 }
      );
    }

    const success = await FollowService.followUser(userId, followingId);

    if (success) {
      return NextResponse.json({ message: 'Successfully followed user' });
    } else {
      return NextResponse.json(
        { error: 'Failed to follow user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/follow - Unfollow a user
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { followingId } = await request.json();

    if (!followingId) {
      return NextResponse.json(
        { error: 'Following ID is required' },
        { status: 400 }
      );
    }

    const success = await FollowService.unfollowUser(userId, followingId);

    if (success) {
      return NextResponse.json({ message: 'Successfully unfollowed user' });
    } else {
      return NextResponse.json(
        { error: 'Failed to unfollow user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}