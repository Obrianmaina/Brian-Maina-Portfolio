import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  // Allow 5 requests from an IP in a 1-minute window.
  limiter: Ratelimit.slidingWindow(5, '60 s'),
});

export const config = {
  // Run this middleware only on the API routes we want to protect
  matcher: ['/api/request-code', '/api/verify-code'],
};

export default async function middleware(request: NextRequest) {
  // You can retrieve the IP address from the request headers.
  const ip = request.ip ?? '127.0.0.1';
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);

  // If the request is blocked, return a "Too Many Requests" response.
  if (!success) {
    return new Response('Too many requests.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }

  // If the request is allowed, continue to the API route.
  return NextResponse.next();
}
