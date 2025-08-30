import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

async function getMovies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/now-playing`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }
  return res.json();
}

export default async function Home() {
  const moviesData = await getMovies();
  const movies = moviesData.data.results;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((movie: any) => (
            <Link href={`/movies/${movie.id}`} key={movie.id}>
              <div className="border rounded-lg overflow-hidden cursor-pointer">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full"
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg">{movie.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
