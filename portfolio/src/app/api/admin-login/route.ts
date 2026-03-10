import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { verify } from 'otplib'; // Updated import for v13

export async function POST(req: Request) {
  try {
    const { password, token } = await req.json();
    
    const correctPassword = process.env.ADMIN_PASSWORD;
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;
    const totpSecret = process.env.ADMIN_TOTP_SECRET;

    if (!correctPassword || !sessionToken || !totpSecret) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    // 1. Verify the static password
    const inputBuffer = Buffer.from(password);
    const secretBuffer = Buffer.from(correctPassword);
    const isPasswordValid = inputBuffer.length === secretBuffer.length && crypto.timingSafeEqual(inputBuffer, secretBuffer);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // 2. Verify the Google Authenticator Token (Now Async in v13)
    const isTokenValid = await verify({ token, secret: totpSecret });

    if (!isTokenValid) {
      return NextResponse.json({ success: false, message: "Invalid authenticator code" }, { status: 401 });
    }

    // 3. Success! Set the secure session token
    (await cookies()).set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Bad request" }, { status: 400 });
  }
}