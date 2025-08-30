import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
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