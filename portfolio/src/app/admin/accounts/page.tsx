"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Receipt } from "lucide-react";
import AdminModal from "@/components/AdminModal";

type Transaction = {
  _id: string;
  clientName: string;
  date: string;
  type: 'invoice' | 'receipt';
  amount: string | number;
  status: 'paid' | 'pending';
};

export default function AccountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [docType, setDocType] = useState<'invoice' | 'receipt'>('invoice');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/accounts");
      if (res.ok) setTransactions(await res.json());
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  const showModal = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void) => {
    setModal({ show: true, type, title, message, onConfirm });
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const handleSendDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !amount || !serviceDescription) {
      showModal('error', 'Incomplete', 'All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          amount: parseFloat(amount),
          description: serviceDescription,
          type: docType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showModal('success', 'Document Sent!', `The ${docType} was successfully sent to ${clientName}.`);
        setClientName("");
        setClientEmail("");
        setAmount("");
        setServiceDescription("");
        setDocType('invoice');
        fetchTransactions();
      } else {
        showModal('error', 'Failed to Send', data.error || "Could not process the document.");
      }
    } catch {
      showModal('error', 'Error', "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>
        <h2 className="text-3xl font-bold mb-8 border-l-4 border-amber-400 pb-2 px-4 text-gray-800">
          Financial Hub
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Document</h3>
              <form onSubmit={handleSendDocument} className="space-y-5">

                <div className="flex gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setDocType('invoice')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === 'invoice' ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Send Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocType('receipt')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === 'receipt' ? 'bg-green-100 border-green-500 text-green-800 shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Send Receipt
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Client Name</label>
                    <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Client Email</label>
                    <input type="email" required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="jane@example.com" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Service Description</label>
                  <input type="text" required value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g., Website Redesign Phase 1" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Amount (EUR)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500 font-bold">€</span>
                    <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 pl-8 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="0.00" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70 ${docType === 'invoice' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
                >
                  {loading ? "Processing..." : <><Send size={20} className="mr-2" /> Send {docType === 'invoice' ? 'Invoice' : 'Receipt'}</>}
                </button>
              </form>
            </div>
          </div>

          {/* Ledger Section */}
          <div className="bg-gray-900 text-white p-6 rounded-2xl flex flex-col h-full shadow-lg max-h-[600px]">
            <div className="w-12 h-12 bg-gray-800 text-amber-400 rounded-xl flex items-center justify-center mb-6 shrink-0">
              <Receipt size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 shrink-0">General Ledger</h3>
            <p className="text-gray-400 text-sm mb-6 shrink-0">Your recent transaction history.</p>

            <div className="mt-auto space-y-3 overflow-y-auto pr-2">
              {transactions.length === 0 ? (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                  <p className="text-sm text-gray-400">No transactions recorded yet.</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-100 truncate max-w-[150px]">{tx.clientName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className={tx.type === 'receipt' ? 'text-green-400' : 'text-amber-400'}>
                          {tx.type.toUpperCase()}
                        </span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold ${tx.type === 'receipt' ? 'text-green-400' : 'text-gray-100'}`}>
                        {tx.type === 'receipt' ? '+' : ''}€{parseFloat(String(tx.amount)).toFixed(2)}
                      </p>
                      <p className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${tx.status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}