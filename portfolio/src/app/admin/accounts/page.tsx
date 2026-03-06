"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Receipt, TrendingUp, Calendar, FileText, CheckCircle, Clock } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Transaction = {
  _id: string;
  clientName: string;
  date: string;
  type: 'invoice' | 'receipt';
  amount: string | number;
  status: 'paid' | 'pending';
  description: string;
  mpesaMessage?: string;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number | string }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
        <p className="text-gray-500 text-sm font-semibold mb-1">{label}</p>
        <p className="text-emerald-600 font-bold text-lg">
          €{Number(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function AccountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');

  // Document Creation State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [docType, setDocType] = useState<'invoice' | 'receipt'>('invoice');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Report State (defaults to current month YYYY-MM)
  const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

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
    if (!clientName || !clientEmail || !amount || !serviceDescription || (docType === 'receipt' && !mpesaMessage)) {
      showModal('error', 'Incomplete', 'All required fields must be filled.');
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
          mpesaMessage: docType === 'receipt' ? mpesaMessage : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showModal('success', 'Document Sent!', `The ${docType} was successfully sent to ${clientName}.`);
        setClientName("");
        setClientEmail("");
        setAmount("");
        setServiceDescription("");
        setMpesaMessage("");
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

  // DATA PROCESSING FOR DASHBOARD
  const allChartData = useMemo(() => {
    const paidTransactions = transactions.filter(t => t.status === 'paid');
    const grouped = paidTransactions.reduce((acc: Record<string, number>, curr) => {
      const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr] += parseFloat(String(curr.amount));
      return acc;
    }, {} as Record<string, number>); 

    return Object.keys(grouped).map(date => ({ date, revenue: grouped[date] })).reverse(); 
  }, [transactions]);

  // DATA PROCESSING FOR MONTHLY REPORT
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const txMonthStr = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      return txMonthStr === reportMonth;
    });
  }, [transactions, reportMonth]);

  const monthlyChartData = useMemo(() => {
    const paidMonthly = monthlyTransactions.filter(t => t.status === 'paid');
    const grouped = paidMonthly.reduce((acc: Record<string, number>, curr) => {
      const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr] += parseFloat(String(curr.amount));
      return acc;
    }, {} as Record<string, number>); 

    return Object.keys(grouped).map(date => ({ date, revenue: grouped[date] })).reverse(); 
  }, [monthlyTransactions]);

  const monthlyStats = useMemo(() => {
    let billed = 0;
    let collected = 0;
    
    monthlyTransactions.forEach(tx => {
      const amt = parseFloat(String(tx.amount));
      if (tx.type === 'invoice') billed += amt;
      if (tx.status === 'paid' && tx.type === 'receipt') collected += amt;
    });

    return { 
      billed, 
      collected, 
      pending: billed > collected ? billed - collected : 0 
    };
  }, [monthlyTransactions]);

  const formatYAxis = (tickItem: number) => `€${tickItem}`;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 fade-in">
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.push('/admin')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to Hub
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
          <h2 className="text-3xl font-bold border-l-4 border-amber-400 pl-4 text-gray-800">
            Financial Hub
          </h2>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'report' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly Report
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            {allChartData.length > 0 && (
              <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-80 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-emerald-500" /> All-Time Revenue
                </h3>
                <div className="flex-1 w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={allChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAllRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tickFormatter={formatYAxis} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAllRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Document</h3>
                  <form onSubmit={handleSendDocument} className="space-y-5">
                    <div className="flex gap-4 mb-4">
                      <button type="button" onClick={() => setDocType('invoice')} className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === 'invoice' ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>Send Invoice</button>
                      <button type="button" onClick={() => setDocType('receipt')} className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === 'receipt' ? 'bg-green-100 border-green-500 text-green-800 shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>Send Receipt</button>
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

                    {docType === 'receipt' && (
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">M-Pesa Confirmation Message</label>
                        <textarea required value={mpesaMessage} onChange={(e) => setMpesaMessage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 h-24" placeholder="Paste the exact M-Pesa message here..." />
                      </div>
                    )}

                    <button type="submit" disabled={loading} className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70 ${docType === 'invoice' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}>
                      {loading ? "Processing..." : <><Send size={20} className="mr-2" /> Send {docType === 'invoice' ? 'Invoice' : 'Receipt'}</>}
                    </button>
                  </form>
                </div>
              </div>

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
                    transactions.slice(0, 10).map((tx) => (
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
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="fade-in space-y-8">
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Monthly Snapshot</h3>
                <p className="text-gray-500 text-sm">Select a month to view detailed statistics.</p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Calendar size={18} />
                </div>
                <input 
                  type="month" 
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                <div className="flex items-center mb-2">
                  <FileText size={20} className="text-amber-500 mr-2" />
                  <h4 className="font-semibold text-amber-800">Total Billed</h4>
                </div>
                <p className="text-3xl font-bold text-amber-600">€{monthlyStats.billed.toFixed(2)}</p>
                <p className="text-xs text-amber-700/70 mt-2">Invoices sent this month</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                <div className="flex items-center mb-2">
                  <CheckCircle size={20} className="text-emerald-500 mr-2" />
                  <h4 className="font-semibold text-emerald-800">Total Collected</h4>
                </div>
                <p className="text-3xl font-bold text-emerald-600">€{monthlyStats.collected.toFixed(2)}</p>
                <p className="text-xs text-emerald-700/70 mt-2">Receipts issued this month</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                <div className="flex items-center mb-2">
                  <Clock size={20} className="text-blue-500 mr-2" />
                  <h4 className="font-semibold text-blue-800">Pending Value</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600">€{monthlyStats.pending.toFixed(2)}</p>
                <p className="text-xs text-blue-700/70 mt-2">Expected vs Collected</p>
              </div>
            </div>

            {monthlyChartData.length > 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-80 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-emerald-500" /> Collection Trend for {new Date(reportMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex-1 w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMonthRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tickFormatter={formatYAxis} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMonthRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center text-gray-400">
                <TrendingUp size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="font-medium">No collected revenue data for this month.</p>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
               <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Monthly Ledger</h3>
               {monthlyTransactions.length > 0 ? (
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-600">
                     <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                       <tr>
                         <th className="px-4 py-3 rounded-l-lg">Date</th>
                         <th className="px-4 py-3">Client</th>
                         <th className="px-4 py-3">Description</th>
                         <th className="px-4 py-3">Type</th>
                         <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                       </tr>
                     </thead>
                     <tbody>
                       {monthlyTransactions.map((tx) => (
                         <tr key={tx._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                           <td className="px-4 py-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                           <td className="px-4 py-3 font-medium text-gray-900">{tx.clientName}</td>
                           <td className="px-4 py-3">{tx.description}</td>
                           <td className="px-4 py-3">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.type === 'receipt' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                               {tx.type.toUpperCase()}
                             </span>
                           </td>
                           <td className={`px-4 py-3 text-right font-bold ${tx.type === 'receipt' ? 'text-green-600' : 'text-gray-900'}`}>
                             €{parseFloat(String(tx.amount)).toFixed(2)}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <p className="text-gray-500 text-center py-6">No transactions recorded in this month.</p>
               )}
            </div>
          </div>
        )}

      </div>
      <AdminModal modal={modal} close={closeModal} />
    </main>
  );
}