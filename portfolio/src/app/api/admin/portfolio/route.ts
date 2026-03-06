import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// GET all portfolio items
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const projects = await db.collection("showcases").find({}).sort({ _id: -1 }).toArray();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Fetch Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new portfolio item
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("showcases").insertOne({ ...data, createdAt: new Date() });
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error("Create Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a portfolio item
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("showcases").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}