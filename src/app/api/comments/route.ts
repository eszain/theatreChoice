import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';

export async function POST(request: Request) {
  await dbConnect();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { movieId, comment } = await request.json();

    if (!movieId || !comment) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof comment !== 'string' || comment.length < 1 || comment.length > 1000) {
      return NextResponse.json({ success: false, error: 'Invalid comment length' }, { status: 400 });
    }

    const newComment = new Comment({ movieId, userId, comment });
    await newComment.save();
    return NextResponse.json({ success: true, data: newComment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
export async function PUT(request: Request) {
  await dbConnect();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { commentId, comment } = await request.json();

    if (!commentId || !comment) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof comment !== 'string' || comment.length < 1 || comment.length > 1000) {
      return NextResponse.json({ success: false, error: 'Invalid comment length' }, { status: 400 });
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, userId },
      { comment },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json({ success: false, error: 'Comment not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedComment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { commentId } = await request.json();

    if (!commentId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const deletedComment = await Comment.findOneAndDelete({ _id: commentId, userId });

    if (!deletedComment) {
      return NextResponse.json({ success: false, error: 'Comment not found or user not authorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');

  if (!movieId) {
    return NextResponse.json({ success: false, error: 'Movie ID is required' }, { status: 400 });
  }

  try {
    const comments = await Comment.find({ movieId: Number(movieId) }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}