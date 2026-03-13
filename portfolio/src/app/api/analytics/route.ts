import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Prevent Next.js from caching this API route
export const dynamic = 'force-dynamic';

const DB_NAME = "portfolio";

export async function POST(req: Request) {
  try {
    const { target, type } = await req.json();

    if (!target) {
      return NextResponse.json({ error: "Target is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Increment the hit count for this specific target
    await db.collection("analytics").updateOne(
      { target, type },
      { 
        $inc: { hits: 1 },
        $set: { lastHit: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Analytics failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const stats = await db.collection("analytics")
      .find({})
      .sort({ hits: -1 })
      .toArray();

    // THIS IS THE CRUCIAL PART: Fetch recent access logs
    const accessLogs = await db.collection("access_logs")
      .find({})
      .sort({ accessedAt: -1 })
      .limit(50) 
      .toArray();

    // Return both stats and accessLogs
    return NextResponse.json({ stats, accessLogs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}