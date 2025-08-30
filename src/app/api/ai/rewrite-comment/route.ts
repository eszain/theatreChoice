import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimiter from '@/lib/rate-limiter';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const limiter = rateLimiter({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // 500 users per second
});

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await limiter.check(request, 10, userId); // 10 requests per user per 60 seconds
    const { comment } = await request.json();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Rewrite the following user comment for a movie theatre experience to be more clear, concise, and engaging. Do not add any information that is not present in the original comment.

Original comment: "${comment}"

Rewritten comment:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, data: text });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return NextResponse.json({ success: false, error: 'Error rewriting comment' }, { status: 500 });
  }
}