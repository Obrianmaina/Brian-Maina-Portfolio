import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  // Strict limit for sensitive routes
  limiter: Ratelimit.slidingWindow(5, '60 s'),
});

export const config = {
  matcher: [
    '/api/request-code', 
    '/api/verify-code', 
    '/api/admin-login', 
    '/api/comments',
    '/api/blogs' // We only want to rate limit write/delete ops, handled inside or via matcher
  ],
};

export default async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  // Apply rate limiting to all matched routes
  // For /api/blogs, we generally want to allow GET but limit POST/PUT/DELETE
  if (request.nextUrl.pathname === '/api/blogs' && request.method === 'GET') {
    return NextResponse.next();
  }

  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new Response('Too many requests. Please try again later.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }
  } catch (error) {
    // Fail open strategy to ensure availability if KV is down
    console.error("Rate Limit Error (Fail Open):", error);
  }

  return NextResponse.next();
}