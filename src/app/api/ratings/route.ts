import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Rating from '@/models/Rating';

export async function POST(request: Request) {
  await dbConnect();
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { movieId, theatreId, rating } = await request.json();

    if (!movieId || !theatreId || !rating) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 10) {
      return NextResponse.json({ success: false, error: 'Invalid rating value' }, { status: 400 });
    }

    const updatedRating = await Rating.findOneAndUpdate(
      { movieId, theatreId, userId },
      { rating },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedRating });
  } catch (error) {
    console.error('Error in POST /api/ratings:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Server Error', details: errorMessage }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();
  const movieId = request.nextUrl.searchParams.get('movieId');

  if (!movieId) {
    return NextResponse.json({ success: false, error: 'Movie ID is required' }, { status: 400 });
  }

  try {
    const averageRatings = await Rating.aggregate([
      { $match: { movieId: Number(movieId) } },
      {
        $group: {
          _id: '$theatreId',
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'theatres',
          localField: '_id',
          foreignField: '_id',
          as: 'theatreDetails',
        },
      },
      { $unwind: '$theatreDetails' },
      {
        $project: {
          _id: 0,
          theatreId: '$_id',
          theatreName: '$theatreDetails.name',
          averageRating: { $round: ['$averageRating', 1] },
          count: 1,
        },
      },
      { $sort: { averageRating: -1 } },
    ]);

    return NextResponse.json({ success: true, data: averageRatings });
  } catch (error) {
    console.error('Error in GET /api/ratings:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Server Error', details: errorMessage }, { status: 500 });
  }
}