import { NextResponse } from "next/server";
import { Resend } from "resend";
import NewsletterEmail from "@/emails/NewsletterEmail";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers"; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session"); 

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Add imageUrl to the destructured JSON payload
    const { subject, message, imageUrl } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const subscribers = await db.collection("subscribers").find({ 
      verified: true, 
      subscribed: true 
    }).toArray();

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers found" }, { status: 404 });
    }

    const emailsToSend = subscribers.map((sub) => ({
      from: "Brian Maina <hello@brianmaina.de>",
      to: sub.email,
      subject: subject,
      react: NewsletterEmail({ 
        nickname: sub.nickname || "there", 
        userEmail: sub.email,
        message: message,
        imageUrl: imageUrl // Pass the image URL down to the component
      }),
    }));

    await resend.batch.send(emailsToSend);

    return NextResponse.json({ 
      success: true, 
      sentCount: subscribers.length 
    }, { status: 200 });

  } catch (error) {
    console.error("Broadcast API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}