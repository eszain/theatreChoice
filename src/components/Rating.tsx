'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Rating({ movieId, theatreId }: { movieId: number, theatreId: string }) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, theatreId, rating }),
    });

    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded"
        disabled={isSubmitting}
      >
        <option value="0" disabled>Rate</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <button type="submit" disabled={isSubmitting || rating === 0} className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
        Submit
      </button>
    </form>
  );
}