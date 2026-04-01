import * as React from "react";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import LeadReplyEmail from "@/emails/LeadReplyEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRecord {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  resendId?: string | null;
  status: "draft" | "scheduled" | "sent";
}

interface QuoteDoc {
  _id?: ObjectId;
  status?: string;
  lastContactedDate?: string;
  emailHistory?: EmailRecord[];
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, email, subject, message, action, emailId } = body;

    if (!id || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let resendData = null;
    const isDraft = action === "draft";

    // Only send to Resend if it's NOT a draft
    if (!isDraft) {
      const sendAt = new Date(Date.now() + 60 * 1000).toISOString();

      // Fix: Let Resend handle the React component natively using the 'react' key
      const { data, error } = await resend.emails.send({
        from: "Brian Maina <brian@brianmaina.de>",
        to: email,
        subject: subject,
        react: React.createElement(LeadReplyEmail, { body: message }),
        scheduledAt: sendAt,
      });

      if (error) {
        console.error("Resend API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      resendData = data;
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection<QuoteDoc>("quotes");

    const recordId = emailId || new ObjectId().toString();

    const emailRecord: EmailRecord = {
      id: recordId,
      subject,
      body: message,
      sentAt: new Date().toISOString(),
      resendId: resendData?.id ?? null,
      status: isDraft ? "draft" : "scheduled",
    };

    if (emailId) {
      // Updating an existing draft safely without using 'any'
      const setFields: Record<string, unknown> = {
        "emailHistory.$": emailRecord,
      };

      if (!isDraft) {
        setFields["status"] = "Contacted";
        setFields["lastContactedDate"] = new Date().toISOString();
      }

      await collection.updateOne(
        { _id: new ObjectId(id), "emailHistory.id": emailId },
        { $set: setFields }
      );
    } else {
      // Pushing a new record safely
      if (!isDraft) {
        await collection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "Contacted",
              lastContactedDate: new Date().toISOString(),
            },
            $push: { emailHistory: emailRecord },
          }
        );
      } else {
        await collection.updateOne(
          { _id: new ObjectId(id) },
          { $push: { emailHistory: emailRecord } }
        );
      }
    }

    return NextResponse.json({ success: true, emailRecord }, { status: 200 });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}