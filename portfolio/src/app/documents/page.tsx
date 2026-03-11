"use client";

import { useState, useEffect } from "react";
import { Search, FileText, CheckCircle, Clock, Printer, RefreshCw } from "lucide-react";
import PayInvoiceButton from "@/components/PayInvoiceButton"; 

interface TransactionDocument {
  _id: string;
  referenceNumber: string;
  type: 'invoice' | 'receipt';
  status: 'pending' | 'paid';
  clientName: string;
  clientEmail: string;
  description: string;
  amount: number;
  currency?: string;
  mpesaMessage?: string;
  date: string; 
}

export default function DocumentsPage() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState<TransactionDocument | null>(null);
  const [error, setError] = useState("");

  // Exchange rate state for EUR/GBP to KES conversion
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isConverting, setIsConverting] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDocument(null);

    try {
      const res = await fetch(`/api/documents?ref=${reference}`);
      const data = await res.json();

      if (res.ok) {
        setDocument(data);
      } else {
        setError(data.error || "Could not find a document with that reference.");
      }
    } catch (err) {
      setError("An error occurred while fetching the document.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch live rate if the invoice is in EUR or GBP
  useEffect(() => {
    if (document && ['EUR', 'GBP'].includes(document.currency || '')) {
      setIsConverting(true);
      fetch(`/api/exchange-rate?base=${document.currency}`)
        .then(res => res.json())
        .then(data => {
          if (data.rate) setExchangeRate(data.rate);
        })
        .catch(err => console.error("Failed to fetch rate", err))
        .finally(() => setIsConverting(false));
    } else {
      setExchangeRate(1);
    }
  }, [document]);

  // Determine what to send to Paystack
  const isEuroOrGbp = ['EUR', 'GBP'].includes(document?.currency || '');
  const paystackCurrency = isEuroOrGbp ? 'KES' : (document?.currency || 'USD');
  const paystackAmount = isEuroOrGbp ? ((document?.amount || 0) * exchangeRate) : (document?.amount || 0);

  return (
    // Added print:bg-white to ensure the PDF background is perfectly clean
    <main className="min-h-screen bg-gray-50 py-20 px-6 font-sans flex flex-col items-center print:bg-white print:py-10">
      
      {/* Hide the search portal entirely when the client prints/downloads the PDF */}
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center mb-8 print:hidden">
        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Client Portal</h1>
        <p className="text-gray-500 mb-8">Enter the 6-character reference number from your email to view your document.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="e.g. A1B2C3" 
            maxLength={6}
            required
            className="w-full sm:flex-1 p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-center font-bold tracking-widest uppercase"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {loading ? <Clock size={24} className="animate-spin" /> : <Search size={24} />}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
      </div>

      {document && (
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100 fade-in print:shadow-none print:border-none print:max-w-2xl print:p-0">
          <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                {document.type === 'invoice' ? 'Invoice' : 'Receipt'}
              </p>
              <h2 className="text-2xl font-bold text-gray-900">#{document.referenceNumber}</h2>
            </div>
            {document.status === 'paid' ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <CheckCircle size={14} className="mr-1" /> PAID
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Clock size={14} className="mr-1" /> PENDING
              </span>
            )}
          </div>

          <div className="space-y-4 mb-8 text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Billed To:</span>
              <span className="text-gray-900 font-semibold">{document.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Service:</span>
              <span className="text-gray-900 font-semibold text-right max-w-[200px]">{document.description}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-4">
              <span className="font-bold text-gray-900">Total Amount:</span>
              <span className="font-bold text-2xl text-teal-600">
                {document.currency || "EUR"} {parseFloat(String(document.amount)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons: Hidden during printing */}
          <div className="print:hidden">
            {isEuroOrGbp && document.status === 'pending' && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-sm text-blue-800">
                <p className="flex items-center font-bold mb-1">
                  Currency Notice {isConverting && <RefreshCw size={12} className="ml-2 animate-spin" />}
                </p>
                <p>
                  Our payment gateway processes transactions in Kenyan Shillings (KES). 
                  Your {document.currency} invoice will be securely charged as approximately <strong>KES {paystackAmount.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</strong> based on the live market rate.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {document.type === 'invoice' && document.status === 'pending' && (
                 <div className="w-full" style={isConverting ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
                   <PayInvoiceButton 
                      invoice={{
                        _id: document._id,
                        clientName: document.clientName,
                        clientEmail: document.clientEmail,
                        amount: paystackAmount, 
                        currency: paystackCurrency as "USD" | "KES" | "GBP", 
                        isInternational: true, 
                        status: document.status,
                        createdAt: new Date(document.date)
                      }} 
                   />
                 </div>
              )}
              
              <button 
                onClick={() => window.print()} 
                className="w-full py-4 font-bold rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center"
              >
                <Printer size={20} className="mr-2" /> Download as PDF
              </button>
            </div>
          </div>

          {document.type === 'receipt' && document.mpesaMessage && (
            <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Payment Details</p>
              <p className="text-sm text-gray-700 break-words">{document.mpesaMessage}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}