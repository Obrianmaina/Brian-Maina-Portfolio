import { NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // 1. Verify the request came from Paystack
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // 2. Process the successful payment
    if (event.event === 'charge.success') {
      const paymentData = event.data;
      const reference = paymentData.reference;
      
      // Extract the MongoDB _id from the reference string
      const invoiceId = reference.split('_')[1]; 

      // 3. Connect to MongoDB
      const client = await clientPromise;
      const db = client.db(); // This connects to your default database in the URI

      // 4. Update the invoice status
      await db.collection('invoices').updateOne(
        { _id: new ObjectId(invoiceId) },
        { 
          $set: { 
            status: 'paid',
            paidAt: new Date()
          } 
        }
      );
      
      console.log('Successfully updated invoice to paid:', invoiceId);
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 });
  }
}