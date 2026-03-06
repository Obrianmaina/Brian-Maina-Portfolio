import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// Import your existing static data
import { showcases } from "@/app/portfolio/showcaseData"; 

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Prepare the data by removing any string _id and adding a createdAt date
    const documentsToInsert = showcases.map((project) => {
      // We pull out _id to discard it, and keep everything else in projectData
      const { _id, ...projectData } = project; 
      
      return {
        ...projectData,
        createdAt: new Date()
      };
    });

    // Insert all projects into the "showcases" collection
    const result = await db.collection("showcases").insertMany(documentsToInsert);

    return NextResponse.json({ 
      success: true, 
      message: "Data successfully migrated to MongoDB!",
      insertedCount: result.insertedCount 
    }, { status: 200 });

  } catch (error) {
    console.error("Seed API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}