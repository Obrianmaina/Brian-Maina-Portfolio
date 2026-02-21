import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: Fetch all blogs
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Fetch all blogs, sorting by newest first
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST: Create a new blog
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Create a URL friendly slug from the title
    const slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const client = await clientPromise;
    const db = client.db("portfolio");
    
    await db.collection("blogs").insertOne({ 
      ...body, 
      slug, 
      createdAt: new Date() 
    });
    
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

// PUT: Update an existing blog
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, content, featuredImage, photoCredit, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    // Re-generate slug in case the title changed
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("blogs").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title, 
          slug, 
          description,
          content, 
          featuredImage, 
          photoCredit,
          isPublished,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE: Remove a blog
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}