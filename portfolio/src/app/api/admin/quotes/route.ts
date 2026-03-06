import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// GET all quotes
export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const quotes = await db.collection("quotes").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(quotes, { status: 200 });
  } catch (error) {
    console.error("Fetch Quotes Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH to update quote status
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("quotes").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update Quote Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}