import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // Fetch the secret password from the server environment
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error("ADMIN_PASSWORD is not set in environment variables.");
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Bad request" }, { status: 400 });
  }
}


  