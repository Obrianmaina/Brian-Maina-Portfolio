import { NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Resend } from 'resend';
import TransactionEmail from '@/emails/TransactionEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const db = client.db("portfolio"); 

      // 4. Fetch the original pending invoice from the database
      const transaction = await db.collection('transactions').findOne({ 
        _id: new ObjectId(invoiceId) 
      });

      if (!transaction) {
        console.error('Transaction not found for invoice:', invoiceId);
        return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
      }

      // 5. Generate an automatic payment confirmation message
      // Paystack tells us how they paid (e.g., 'card', 'mobile_money') and the last 4 digits
      const channel = paymentData.authorization?.channel || 'secure gateway';
      const last4 = paymentData.authorization?.last4 ? ` ending in ${paymentData.authorization.last4}` : '';
      const autoPaymentMessage = `Payment successfully processed via ${channel.toUpperCase()}${last4}. Transaction Reference: ${paymentData.reference}`;

      // 6. Update the invoice status to paid and save the automated message
      await db.collection('transactions').updateOne(
        { _id: new ObjectId(invoiceId) },
        { 
          $set: { 
            status: 'paid',
            paidAt: new Date(),
            mpesaMessage: autoPaymentMessage // We reuse this field for the auto-message
          } 
        }
      );
      
      // 7. Automatically send the branded receipt email to the client
      const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/documents`;

      await resend.emails.send({
        from: "Brian Maina <hello@brianmaina.de>",
        to: transaction.clientEmail,
        subject: `Receipt from Brian Maina (#${transaction.referenceNumber})`,
        react: TransactionEmail({ 
          clientName: transaction.clientName, 
          amount: transaction.amount, 
          currency: transaction.currency || "KES",
          description: transaction.description, 
          type: 'receipt', // Switch the email type to 'receipt'
          referenceNumber: transaction.referenceNumber,
          downloadLink,
          mpesaMessage: autoPaymentMessage // Pass the automated message to the template
        }),
      });

      console.log('Successfully processed payment and sent automated receipt for:', invoiceId);
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 });
  }
}