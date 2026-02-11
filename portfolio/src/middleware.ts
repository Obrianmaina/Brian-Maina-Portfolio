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
  // UPDATED: Get the IP address from the 'x-forwarded-for' header
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

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
  } catch (error) {
    // CRITICAL FIX: Fail Open Strategy
    // If Upstash/KV is sleeping, times out, or throws "fetch failed", 
    // we catch the error here.
    // We log it for debugging, but we DO NOT crash the app.
    // We simply let the code proceed to the return NextResponse.next() below.
    console.error("Rate Limit Error (Fail Open):", error);
  }

  // If the request is allowed (or if the rate limiter failed), continue to the API route.
  return NextResponse.next();
}