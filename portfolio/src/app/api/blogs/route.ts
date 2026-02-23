import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

// Reverting to the original database name used in your earlier files
const DB_NAME = "portfolio";

interface BlogUpdate {
  title: string;
  description: string;
  content: string;
  featuredImage: string;
  photoCredit: string;
  isPublished: boolean;
  updatedAt: Date;
}

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === process.env.ADMIN_PASSWORD;
}

function generateUniqueSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Add 4 random hex chars to prevent collisions
  const suffix = crypto.randomBytes(2).toString('hex');
  return `${baseSlug}-${suffix}`;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Fetch all blogs to filter in memory
    const allBlogs = await db.collection("blogs").find({}).toArray();
    const adminStatus = await isAdmin();
    
    const filteredBlogs = allBlogs
      .filter(blog => {
        // If admin, show everything
        if (adminStatus) return true;
        
        // If not admin, show if explicitly published OR if the field is missing (legacy support)
        return blog.isPublished === true || blog.isPublished === undefined;
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
    return NextResponse.json(filteredBlogs);
  } catch (error) {
    console.error("GET Blogs Error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { title, description, content, featuredImage, photoCredit, isPublished } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = generateUniqueSlug(title);
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const newBlog = {
      title,
      slug,
      description,
      content,
      featuredImage,
      photoCredit,
      isPublished: !!isPublished,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection("blogs").insertOne(newBlog);
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, title, description, content, featuredImage, photoCredit, isPublished } = body;

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData: BlogUpdate = {
      title,
      description,
      content,
      featuredImage,
      photoCredit,
      isPublished: !!isPublished,
      updatedAt: new Date()
    };

    const result = await db.collection("blogs").updateOne(
      { _id: new ObjectId(id as string) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}