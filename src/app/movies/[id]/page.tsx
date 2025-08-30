import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import Rating from '@/components/Rating';
import CommentBox from '@/components/CommentBox';

async function getMovieDetails(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`);
  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }
  return res.json();
}

async function getMovieRatings(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ratings?movieId=${id}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch movie ratings:', res.statusText);
      return { success: true, data: [] }; // Return empty data on error
    }
    return res.json();
  } catch (error) {
    console.error('Error in getMovieRatings:', error);
    return { success: true, data: [] }; // Return empty data on fetch failure
  }
}

async function getMovieComments(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments?movieId=${id}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch movie comments:', res.statusText);
      return { success: true, data: [] }; // Return empty data on error
    }
    return res.json();
  } catch (error) {
    console.error('Error in getMovieComments:', error);
    return { success: true, data: [] }; // Return empty data on fetch failure
  }
}

async function getTheatres() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/theaters`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch theatres');
  }
  return res.json();
}

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  const { id } = awaitedParams;
  const movie = await getMovieDetails(id);
  const ratingsData = await getMovieRatings(id);
  const commentsData = await getMovieComments(id);
  const theatresData = await getTheatres();

  const ratings = ratingsData.data;
  const comments = commentsData.data;
  const theatres = theatresData.data;

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">
          <Link href="/">Theatre App</Link>
        </h1>
        <div>
          <SignedOut>
            <Link href="/sign-in" className="mr-4">Sign In</Link>
            <Link href="/sign-up">Sign Up</Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main className="p-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full rounded-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="mb-4">{movie.overview}</p>
            <h2 className="text-2xl font-bold mb-2">Cast</h2>
            {/* Cast information would require another API call, skipping for now */}
            <h2 className="text-2xl font-bold mt-8 mb-2">Rate Theatres</h2>
            <ul>
              {theatres.map((theatre: any) => (
                <li key={theatre._id} className="mb-2 flex justify-between items-center">
                  <span className="font-bold">{theatre.name}</span>
                  <Rating movieId={movie.id} theatreId={theatre._id} />
                </li>
              ))}
            </ul>
            <h2 className="text-2xl font-bold mt-8 mb-2">Top 5 Theatres</h2>
            <ul>
              {ratings && ratings.length > 0 ? (
                ratings.slice(0, 5).map((rating: any) => (
                  <li key={rating.theatreId} className="mb-2">
                    <span className="font-bold">{rating.theatreName}:</span> {rating.averageRating.toFixed(1)}/10 ({rating.count} votes)
                  </li>
                ))
              ) : (
                <li>No theatre ratings yet.</li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <SignedIn>
            <CommentBox movieId={movie.id} />
          </SignedIn>
          <ul className="mt-4 space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((comment: any) => (
                <li key={comment._id} className="border-b pb-2">
                  <p>{comment.comment}</p>
                  <p className="text-sm text-gray-500">by User {comment.userId.slice(0, 6)}...</p>
                </li>
              ))
            ) : (
              <li>No comments yet.</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}