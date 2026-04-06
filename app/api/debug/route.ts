import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT SET';
  return NextResponse.json({
    url,
    key_length: key.length,
    key_start: key.slice(0, 20),
    key_end: key.slice(-10),
  });
}
