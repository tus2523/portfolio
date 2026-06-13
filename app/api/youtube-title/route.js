import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Call the public YouTube oEmbed endpoint
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
    const res = await fetch(oembedUrl);

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch oEmbed metadata' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ title: data.title });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
