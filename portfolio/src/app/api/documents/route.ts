import { NextResponse } from "next/server";
import { Resend } from "resend";
import VerificationEmail from "@/emails/VerificationEmail";
import clientPromise from "@/lib/mongodb";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, service, details, newsletter, nickname } = await req.json();

    if (!email || !service || !nickname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // 1. Save the quote to the database so it appears in the admin dashboard
    await db.collection("quotes").insertOne({
      name: nickname,
      email: email,
      service: service,
      message: details || "",
      status: 'New', // Default status for the CRM
      createdAt: new Date(),
    });

    // 2. Generate a unique token for verification if they opted into the newsletter
    const verificationToken = randomUUID();

    if (newsletter) {
      // Save them as unverified initially
      await db.collection("subscribers").updateOne(
        { email: email },
        { 
          $set: { 
            email: email, 
            nickname: nickname,
            subscribed: false, // Set to false until they verify
            verified: false,   // New verification status
            verificationToken: verificationToken, // Save the token
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    // 3. Send the quote to yourself
    await resend.emails.send({
      from: "Portfolio Form <noreply@brianmaina.de>", 
      to: "request@brianmaina.de",
      subject: `New Freelance Inquiry: ${service}`,
      text: `
        New quote request received!
        Client Name: ${nickname}
        Client Email: ${email}
        Requested Service: ${service}
        Project Details: ${details || "None provided"}
      `,
    });

    // 4. Send the Verification Email with the verification token if they subscribed
   if (newsletter) {
      await resend.emails.send({
        from: "Brian Maina <hello@brianmaina.de>",
        to: email,
        subject: "Action Required: Verify your email",
        react: VerificationEmail({ userEmail: email, nickname: nickname, token: verificationToken }), 
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET method to fetch all quotes for the admin dashboard
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Fetch quotes, newest first
    const quotes = await db.collection("quotes").find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(quotes, { status: 200 });
  } catch (error) {
    console.error("Fetch Quotes API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH method to update the status of a quote
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("quotes").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update Quote API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}