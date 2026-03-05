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

    // Generate a unique token for verification
    const verificationToken = randomUUID();

    if (newsletter) {
      const client = await clientPromise;
      const db = client.db("portfolio");

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

    // Send the quote to yourself
    await resend.emails.send({
      from: "Portfolio Form <onboarding@resend.dev>", 
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

    // Send the Verification Email with the verification token
   if (newsletter) {
      await resend.emails.send({
        from: "Brian Maina <hello@brianmaina.de>",
        to: email,
        subject: "Action Required: Verify your email",
        // Call the new component name here
        react: VerificationEmail({ userEmail: email, nickname: nickname, token: verificationToken }), 
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}