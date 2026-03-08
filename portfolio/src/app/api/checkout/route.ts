import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // We only trust the email and invoiceId from the client
    const { email, invoiceId } = body;

    if (!invoiceId) {
        return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Connect to the database to securely fetch the true transaction details
    const client = await clientPromise;
    const db = client.db("portfolio");
    const transaction = await db.collection('transactions').findOne({ 
      _id: new ObjectId(invoiceId) 
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Use the secure amount and currency directly from the database record
    const secureAmount = transaction.amount;
    const secureCurrency = 'KES';

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(secureAmount * 100),
        currency: secureCurrency,
        reference: `INV_${invoiceId}_${Date.now()}`,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`, 
      }),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({ checkoutUrl: data.data.authorization_url });
    }

    return NextResponse.json({ error: data.message }, { status: 400 });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}