import { NextResponse } from "next/server";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import clientPromise from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, service, details, newsletter, nickname } = await req.json();

    if (!email || !service || !nickname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newsletter) {
      const client = await clientPromise;
      const db = client.db("portfolio");

      await db.collection("subscribers").updateOne(
        { email: email },
        { 
          $set: { 
            email: email, 
            nickname: nickname, // Save the nickname here
            subscribed: true,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    // Send the internal notification to yourself
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
        Newsletter Opt-in: ${newsletter ? "Yes" : "No"}
      `,
    });

    // Send the personalized Welcome Email
    if (newsletter) {
      await resend.emails.send({
        from: "Brian Maina <hello@brianmaina.de>",
        to: email,
        subject: "Great connecting with you",
        react: WelcomeEmail({ userEmail: email, nickname: nickname }),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}