"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Inbox, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import AdminModal from "@/components/AdminModal";

type Quote = {
  _id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Closed';
  createdAt: string;
};

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
  }>({ show: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quote");
      if (res.ok) {
        setQuotes(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch quotes", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Quote['status']) => {
    try {
      const res = await fetch("/api/quote", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setQuotes(quotes.map(q => q._id === id ? { ...q, status: newStatus } : q));
      } else {
        setModal({ show: true, type: 'error', title: 'Error', message: 'Failed to update status.' });
      }
    } catch (error) {
      setModal({ show: true, type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, show: false }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Proposal Sent': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Hub
        </button>
        
        <div className="flex items-center mb-8 border-l-4 border-blue-500 pl-4">
          <Inbox size={28} className="text-blue-500 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Lead Management</h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading leads...</div>
        ) : quotes.length === 0 ? (
          <div className="bg-gray-50 p-12 rounded-2xl border border-gray-200 text-center">
            <Inbox size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No leads yet</h3>
            <p className="text-gray-500">When potential clients request a quote, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-4 rounded-tl-xl">Date</th>
                  <th className="px-4 py-4">Client Details</th>
                  <th className="px-4 py-4">Project Request</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-4 whitespace-nowrap align-top">
                      <div className="flex items-center text-gray-500">
                        <Clock size={14} className="mr-1.5" />
                        {new Date(quote.createdAt || new Date()).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-bold text-gray-900 text-base">{quote.name}</p>
                      <a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline flex items-center mt-1">
                        <Mail size={14} className="mr-1.5" /> {quote.email}
                      </a>
                    </td>
                    <td className="px-4 py-4 align-top max-w-xs">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-700 border border-gray-200">
                          {quote.service}
                        </span>
                        <span className="px-2 py-1 bg-green-50 rounded-md text-xs font-semibold text-green-700 border border-green-200">
                          {quote.budget}
                        </span>
                      </div>
                      <p className="text-gray-600 italic line-clamp-3">&ldquo;{quote.message}&rdquo;</p>
                    </td>
                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      <select
                        value={quote.status || 'New'}
                        onChange={(e) => updateStatus(quote._id, e.target.value as Quote['status'])}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none ${getStatusColor(quote.status || 'New')}`}
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      <button 
                        onClick={() => router.push(`/admin/accounts?email=${encodeURIComponent(quote.email)}&name=${encodeURIComponent(quote.name)}`)}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Create Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}