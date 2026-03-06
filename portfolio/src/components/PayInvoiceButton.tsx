'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import { Invoice } from '@/types';

export default function PayInvoiceButton({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: invoice.clientEmail,
          amount: invoice.amount,
          currency: invoice.currency,
          invoiceId: invoice._id,
        }),
      });

      const data = await res.json();
      
      if (data.checkoutUrl) {
        // Redirect the client to the Paystack checkout page
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to initiate payment.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while connecting to the payment gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Pay ${invoice.currency} ${invoice.amount}`}
    </Button>
  );
}