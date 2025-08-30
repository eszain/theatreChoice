import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Theatre from '@/models/Theatre';

export async function GET() {
  await dbConnect();

  try {
    const theaters = await Theatre.find({});
    return NextResponse.json({ success: true, data: theaters });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}