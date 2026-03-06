import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import TransactionEmail from "@/emails/TransactionEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Fetch Accounts API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { clientName, clientEmail, amount, description, type, mpesaMessage } = await req.json();

    if (!clientName || !clientEmail || !amount || !description || !type) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const transaction = {
      clientName,
      clientEmail,
      amount,
      description,
      type,
      status: type === 'invoice' ? 'pending' : 'paid',
      date: new Date(),
      mpesaMessage: type === 'receipt' ? mpesaMessage : null,
    };

    const result = await db.collection("transactions").insertOne(transaction);
    const referenceNumber = result.insertedId.toString().slice(-6).toUpperCase();

    // The download portal link where the client will enter their reference number
    const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/documents`;

    await resend.emails.send({
      from: "Brian Maina <hello@brianmaina.de>",
      to: clientEmail,
      subject: type === 'invoice' ? `Invoice from Brian Maina (#${referenceNumber})` : `Receipt from Brian Maina (#${referenceNumber})`,
      react: TransactionEmail({ 
        clientName, 
        amount, 
        description, 
        type, 
        referenceNumber,
        downloadLink,
        mpesaMessage: type === 'receipt' ? mpesaMessage : undefined
      }),
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Accounts API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}