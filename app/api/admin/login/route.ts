import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT SET';
    return NextResponse.json({
      error: error.message,
      url_used: url,
      key_length: key.length,
      key_preview: key.slice(0, 30) + '...',
    }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
