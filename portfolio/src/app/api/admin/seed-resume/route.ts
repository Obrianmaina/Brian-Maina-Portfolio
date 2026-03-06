import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { experienceData } from "@/app/resume/data";
import { educationData, skills } from "@/app/resume/experienceData";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Insert Experience (adding an order field to maintain timeline flow)
    const expToInsert = experienceData.map((exp, index) => ({ ...exp, order: index }));
    await db.collection("experience").insertMany(expToInsert);

    // Insert Education
    const eduToInsert = educationData.map((edu, index) => ({ ...edu, order: index }));
    await db.collection("education").insertMany(eduToInsert);

    // Insert Skills
    const skillsToInsert = skills.map((skill, index) => ({ name: skill, order: index }));
    await db.collection("skills").insertMany(skillsToInsert);

    return NextResponse.json({ success: true, message: "Resume data migrated!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}