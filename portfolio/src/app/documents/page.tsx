"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { Download, Search } from "lucide-react";

// 1. Define the expected shape of your document data
interface DocumentData {
  type: 'invoice' | 'receipt';
  date: string | Date;
  clientName: string;
  clientEmail: string;
  description: string;
  amount: number | string;
  mpesaMessage?: string;
}

export default function DocumentPortal() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not find a document with that reference.");
        return;
      }

      generatePDF(data, referenceNumber);
      
    } catch (err) {
      setError("An unexpected error occurred while fetching the document.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Replace 'any' with the 'DocumentData' interface
  const generatePDF = (data: DocumentData, ref: string) => {
    const doc = new jsPDF();
    const isReceipt = data.type === 'receipt';
    
    doc.setFontSize(22);
    doc.setTextColor(isReceipt ? "#10b981" : "#f59e0b");
    doc.text(isReceipt ? "RECEIPT" : "INVOICE", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text(`Reference Number: #${ref.toUpperCase()}`, 20, 30);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 20, 38);
    
    doc.text(`Billed To:`, 20, 55);
    doc.text(data.clientName, 20, 62);
    doc.text(data.clientEmail, 20, 69);

    doc.setFontSize(14);
    doc.text("Description", 20, 90);
    doc.text("Amount", 160, 90);
    
    doc.setLineWidth(0.5);
    doc.line(20, 93, 190, 93);

    doc.setFontSize(12);
    doc.text(data.description, 20, 102);
    doc.text(`EUR ${parseFloat(String(data.amount)).toFixed(2)}`, 160, 102);
    
    doc.line(20, 110, 190, 110);
    
    doc.setFontSize(14);
    doc.text("Total:", 130, 120);
    doc.text(`EUR ${parseFloat(String(data.amount)).toFixed(2)}`, 160, 120);

    if (isReceipt && data.mpesaMessage) {
      doc.setFontSize(12);
      doc.setTextColor("#4b5563");
      doc.text("Payment Confirmation:", 20, 140);
      
      const splitMessage = doc.splitTextToSize(data.mpesaMessage, 170);
      doc.setFontSize(10);
      doc.text(splitMessage, 20, 148);
    }

    doc.save(`${data.type}_${ref.toUpperCase()}.pdf`);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Download size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Download Document</h1>
        <p className="text-gray-500 mb-8">Enter your reference number (the serial number after the #) from the email to download your PDF.</p>

        <form onSubmit={handleDownload} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              required
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 uppercase" 
              placeholder="e.g. A1B2C3" 
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {loading ? "Locating..." : "Get PDF"}
          </button>
        </form>
      </div>
    </main>
  );
}