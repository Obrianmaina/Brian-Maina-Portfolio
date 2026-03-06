import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

const DB_NAME = "portfolio";

// Define the shape of the update object to avoid 'any'
interface AdminUpdateData {
  email?: string;
  bio?: string;
  password?: string;
}

export async function PATCH(req: Request) {
  try {
    const { newPassword, email, bio } = await req.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData: AdminUpdateData = {};
    
    if (email) {
      updateData.email = email;
    }
    
    if (bio) {
      updateData.bio = bio;
    }
    
    // If updating password, hash it first
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Only proceed if there is actually data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No data provided to update" }, { status: 400 });
    }

    await db.collection("admin_config").updateOne(
      {}, // Assuming one config document exists
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}