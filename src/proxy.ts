import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_URL = (process.env.BENTO_PUBLIC_ADMIN_URL || '').replace(/\/$/, '');

export function proxy(request: NextRequest) {
  if (!ADMIN_URL) return NextResponse.next();

  const corsHeaders = {
    'Access-Control-Allow-Origin': ADMIN_URL,
    'Access-Control-Allow-Headers': 'authorization',
  };

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
