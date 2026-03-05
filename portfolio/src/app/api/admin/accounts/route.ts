import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import TransactionEmail from "@/emails/TransactionEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

// NEW: GET method to fetch the ledger
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Fetch all transactions, sorted by newest first
    const transactions = await db.collection("transactions").find({}).sort({ date: -1 }).toArray();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Fetch Accounts API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// EXISTING: POST method for creating documents
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { clientName, clientEmail, amount, description, type } = await req.json();

    if (!clientName || !clientEmail || !amount || !description || !type) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Log the transaction in the database
    const transaction = {
      clientName,
      clientEmail,
      amount,
      description,
      type, // 'invoice' or 'receipt'
      status: type === 'invoice' ? 'pending' : 'paid',
      date: new Date(),
    };

    const result = await db.collection("transactions").insertOne(transaction);

    // Generate a clean ID for the reference number
    const referenceNumber = result.insertedId.toString().slice(-6).toUpperCase();

    // Send the email to the client
    await resend.emails.send({
      from: "Brian Maina <hello@brianmaina.de>",
      to: clientEmail,
      subject: type === 'invoice' ? `Invoice from Brian Maina (#${referenceNumber})` : `Receipt from Brian Maina (#${referenceNumber})`,
      react: TransactionEmail({ 
        clientName, 
        amount, 
        description, 
        type, 
        referenceNumber 
      }),
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Accounts API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}