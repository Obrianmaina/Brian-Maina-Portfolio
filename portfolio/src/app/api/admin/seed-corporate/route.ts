import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// Import your existing static corporate data
import { companyProjects } from "@/app/portfolio/corporateData"; 

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Since the static data doesn't have _id fields, we just spread it directly!
    const documentsToInsert = companyProjects.map((company) => ({
      ...company,
      createdAt: new Date()
    }));

    // Insert into a new "corporate" collection
    const result = await db.collection("corporate").insertMany(documentsToInsert);

    return NextResponse.json({ 
      success: true, 
      message: "Corporate data successfully migrated to MongoDB!",
      insertedCount: result.insertedCount 
    }, { status: 200 });

  } catch (error) {
    console.error("Corporate Seed API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}