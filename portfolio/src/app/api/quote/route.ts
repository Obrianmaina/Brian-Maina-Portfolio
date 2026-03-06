import { NextResponse } from "next/server";
import { Resend } from "resend";
import VerificationEmail from "@/emails/VerificationEmail";
import clientPromise from "@/lib/mongodb";
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, service, details, newsletter, nickname } = await req.json();

    if (!email || !service || !nickname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const verificationToken = randomUUID();
    const client = await clientPromise;
    const db = client.db("portfolio");

    // 1. SAVE THE QUOTE TO THE DATABASE FIRST
    await db.collection("quotes").insertOne({
      name: nickname,
      email: email,
      service: service,
      message: details || "None provided",
      budget: "TBD", // Adding a default since it's expected in your table
      status: 'New',
      createdAt: new Date()
    });

    // 2. HANDLE NEWSLETTER SUBSCRIPTION (If checked)
    if (newsletter) {
      await db.collection("subscribers").updateOne(
        { email: email },
        { 
          $set: { 
            email: email, 
            nickname: nickname,
            subscribed: false, 
            verified: false,   
            verificationToken: verificationToken, 
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    // 3. SEND ADMIN NOTIFICATION EMAIL
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

    // 4. SEND VERIFICATION EMAIL (If newsletter checked)
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