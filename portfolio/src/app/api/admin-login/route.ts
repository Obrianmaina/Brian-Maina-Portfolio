import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD;
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;

    if (!correctPassword || !sessionToken) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    // Use timingSafeEqual to prevent timing attacks
    const inputBuffer = Buffer.from(password);
    const secretBuffer = Buffer.from(correctPassword);

    if (inputBuffer.length === secretBuffer.length && crypto.timingSafeEqual(inputBuffer, secretBuffer)) {
      const response = NextResponse.json({ success: true });
      
      // Set the secure session token instead of the password
      (await cookies()).set('admin_session', sessionToken, {
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