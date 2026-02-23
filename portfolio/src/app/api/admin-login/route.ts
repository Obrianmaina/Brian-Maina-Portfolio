import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    // Use timingSafeEqual to prevent timing attacks
    const inputBuffer = Buffer.from(password);
    const secretBuffer = Buffer.from(correctPassword);

    if (inputBuffer.length === secretBuffer.length && crypto.timingSafeEqual(inputBuffer, secretBuffer)) {
      const response = NextResponse.json({ success: true });
      
      // Set a secure, HTTP-only session cookie
      // In a real production app, consider using a JWT or signed session ID
      // For this implementation, we use the password as a simple token check 
      // (Better: use a specific ADMIN_TOKEN secret)
      (await cookies()).set('admin_session', correctPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Bad request" }, { status: 400 });
  }
}