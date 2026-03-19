'use client';

import { useState } from 'react';
import Button from '@/components/ui/button';
import { Invoice } from '@/types';

export default function PayInvoiceButton({ invoice }: { invoice: Invoice }) {
  const [loading, setLoading] = useState(false);
  
  // Custom states to handle the beautiful UI popup
  const [showModal, setShowModal] = useState(false);
  const [conversionData, setConversionData] = useState<{ message: string; url: string } | null>(null);

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
          // Open our custom UI modal and stop the initial loading spinner
          setConversionData({
            message: data.conversionMessage,
            url: data.checkoutUrl
          });
          setShowModal(true);
          setLoading(false);
        } else {
          // No conversion needed, redirect directly to Paystack
          window.location.href = data.checkoutUrl;
        }

      } else {
        alert(`Payment Error: ${data.error || data.message || 'Failed to initiate payment'}`);
        console.error("Checkout API Error Details:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert('An error occurred while connecting to the payment gateway.');
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (conversionData?.url) {
      // Show loading feedback on the modal button, then redirect
      setLoading(true);
      window.location.href = conversionData.url;
    }
  };

  const handleCancel = () => {
    // Simply hide the modal and reset data if they cancel
    setShowModal(false);
    setConversionData(null);
  };

  return (
    <>
      <Button onClick={handlePayment} disabled={loading && !showModal}>
        {loading && !showModal ? 'Processing...' : `Pay ${invoice.currency} ${invoice.amount}`}
      </Button>

      {/* Modern, Branded Tailwind Popup Modal */}
      {showModal && conversionData && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-colors duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200 transition-colors">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3 transition-colors">
                Currency Conversion
              </h3>
              
              {/* Parse the message text and apply clean spacing */}
              <div className="text-gray-600 dark:text-gray-300 mb-6 space-y-2 leading-relaxed transition-colors">
                {conversionData.message.split('\n').map((line, index) => {
                   if (!line.trim()) return null;
                   return <p key={index}>{line}</p>;
                })}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 transition-colors">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceed}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-xl shadow-md dark:shadow-none transition-colors disabled:opacity-50 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {loading ? 'Redirecting...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}