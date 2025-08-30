'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentBox({ movieId }: { movieId: number }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const router = useRouter();

  const handleRewrite = async () => {
    setIsRewriting(true);
    const res = await fetch('/api/ai/rewrite-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });
    const data = await res.json();
    if (data.success) {
      setComment(data.data);
    }
    setIsRewriting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movieId, comment }),
    });

    setComment('');
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 rounded w-full"
        placeholder="Share your experience..."
        rows={4}
        disabled={isSubmitting}
      />
      <div className="flex justify-between items-center">
        <button type="button" onClick={handleRewrite} disabled={isRewriting || !comment} className="bg-purple-500 text-white p-2 rounded disabled:bg-gray-400">
          {isRewriting ? 'Rewriting...' : 'Rewrite with AI'}
        </button>
        <button type="submit" disabled={isSubmitting || !comment} className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          Submit Comment
        </button>
      </div>
    </form>
  );
}