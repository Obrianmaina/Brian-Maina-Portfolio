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
          invoiceId: invoice._id, 
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.checkoutUrl) {
        
        // Check if the backend sent a currency conversion message
        if (data.conversionMessage) {
          // Display the rate and amount to the user for confirmation
          const proceed = window.confirm(`${data.conversionMessage}\n\nClick OK to proceed to the secure payment gateway.`);
          
          if (!proceed) {
            // User canceled the transaction after seeing the exchange rate
            setLoading(false);
            return; 
          }
        }

        // Redirect the client to the Paystack checkout page
        window.location.href = data.checkoutUrl;
      } else {
        alert(`Payment Error: ${data.error || data.message || 'Failed to initiate payment'}`);
        console.error("Checkout API Error Details:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
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