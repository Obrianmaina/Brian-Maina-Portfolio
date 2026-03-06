import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// GET all corporate projects (Publicly accessible for the frontend)
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const corporateProjects = await db.collection("corporate").find({}).sort({ _id: -1 }).toArray();
    
    return NextResponse.json(corporateProjects, { status: 200 });
  } catch (error) {
    console.error("Fetch Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new corporate entry (Requires admin)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("corporate").insertOne(data);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Create Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a corporate project (Requires admin)
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("corporate").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}