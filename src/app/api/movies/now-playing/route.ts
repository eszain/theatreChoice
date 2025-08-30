import { NextResponse } from 'next/server';
import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

export async function GET() {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ success: false, error: 'TMDB API key not configured' }, { status: 500 });
  }

  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: 1,
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}