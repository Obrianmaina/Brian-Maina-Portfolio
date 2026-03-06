import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, currency, invoiceId } = body;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack requires the amount in cents
        currency,
        reference: `INV_${invoiceId}_${Date.now()}`,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify?reference=`, 
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