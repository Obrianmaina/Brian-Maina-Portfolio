import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch only apps where isVisible is true, sorted by newest first
    const apps = await db.collection("apps")
      .find({ isVisible: true })
      .sort({ _id: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, data: apps }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch apps" }, { status: 500 });
  }
}