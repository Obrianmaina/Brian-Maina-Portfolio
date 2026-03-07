"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Receipt, TrendingUp, Calendar, FileText, CheckCircle, Clock, RefreshCw } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Transaction = {
  _id: string;
  clientName: string;
  date: string;
  type: 'invoice' | 'receipt';
  amount: string | number;
  currency?: string;
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
          {Number(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const getCurrencySymbol = (currencyCode: string) => {
  switch (currencyCode) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'KES': return 'KSh';
    default: return currencyCode;
  }
};

export default function AccountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "KES">("USD");
  const [serviceDescription, setServiceDescription] = useState("");
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [docType, setDocType] = useState<'invoice' | 'receipt'>('invoice');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isFetchingRate, setIsFetchingRate] = useState(false);

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

  useEffect(() => {
    if (currency === "KES") {
      setExchangeRate(1);
      return;
    }

    const fetchRate = async () => {
      setIsFetchingRate(true);
      try {
        const res = await fetch(`/api/exchange-rate?base=${currency}`);
        const data = await res.json();
        
        if (data.rate) {
          setExchangeRate(data.rate);
        } else {
          setExchangeRate(0); 
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate", error);
        setExchangeRate(0); 
      } finally {
        setIsFetchingRate(false);
      }
    };

    fetchRate();
  }, [currency]);

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
          currency, 
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

  // Function to manually mark an invoice as paid
  const handleMarkAsPaid = async (id: string) => {
    showModal(
      'confirm', 
      'Update Payment Status', // Updated Title
      'Are you sure you want to mark this invoice as paid? This will update your financial records immediately.', // Updated Message
      async () => {
        setMarkingPaid(id);
        try {
          const res = await fetch("/api/admin/accounts", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          
          if (res.ok) {
            fetchTransactions();
            showModal('success', 'Update Successful', 'The invoice has been marked as paid.');
          } else {
            showModal('error', 'Update Failed', 'Could not update the invoice status.');
          }
        } catch (error) {
          showModal('error', 'Error', 'An unexpected error occurred.');
        } finally {
          setMarkingPaid(null);
        }
      }
    );
  };


  const estimatedPayoutKES = useMemo(() => {
    const rawAmount = parseFloat(amount) || 0;
    const grossKES = rawAmount * exchangeRate;
    const feePercentage = currency === "KES" ? 0.015 : 0.038;
    const netKES = grossKES - (grossKES * feePercentage);
    return netKES;
  }, [amount, exchangeRate, currency]);

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
    let pending = 0;
    
    monthlyTransactions.forEach(tx => {
      const amt = parseFloat(String(tx.amount));
      
      if (tx.type === 'invoice') {
        billed += amt;
        if (tx.status === 'pending') {
          pending += amt;
        }
      }
      
      if (tx.status === 'paid') {
        collected += amt;
      }
    });

    return { 
      billed, 
      collected, 
      pending 
    };
  }, [monthlyTransactions]);

  const formatYAxis = (tickItem: number) => `${tickItem}`;

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
                  <TrendingUp size={20} className="mr-2 text-emerald-500" /> All-Time Revenue Volume
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
                      <input type="text" required value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="e.g. Website Redesign Phase 1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 md:col-span-1">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Currency</label>
                            <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value as "USD" | "EUR" | "GBP" | "KES")}
                            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                            >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="KES">KES (KSh)</option>
                            </select>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Amount</label>
                                <div className="flex items-center w-full p-3 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-amber-500 transition-all bg-white">
    <span className="text-gray-500 font-bold select-none mr-2 whitespace-nowrap">
      {getCurrencySymbol(currency)}
    </span>
    <input 
      type="number" 
      step="0.01" 
      required 
      value={amount} 
      onChange={(e) => setAmount(e.target.value)} 
      className="w-full outline-none bg-transparent" 
      placeholder="0.00" 
    />
                                
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase flex items-center">
                          Estimated M-Pesa Payout
                          {isFetchingRate && <RefreshCw size={12} className="ml-2 animate-spin text-blue-500" />}
                        </p>
                        
                        {exchangeRate === 0 && currency !== 'KES' ? (
                           <p className="text-sm font-bold text-red-500 mt-1">
                             No internet connection / Rate failed
                           </p>
                        ) : (
                           <p className="text-xl font-bold text-blue-900 mt-1">
                             KSh {estimatedPayoutKES.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        {exchangeRate > 0 && currency !== 'KES' && (
                          <p className="text-[10px] text-gray-400 font-bold">1 {currency} = {exchangeRate} KES</p>
                        )}
                        <p className="text-[10px] text-gray-400">& ~{currency === 'KES' ? '1.5%' : '3.8%'} Paystack fee</p>
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
                            <span className={tx.status === 'paid' ? 'text-green-400' : 'text-amber-400'}>
                              {tx.status.toUpperCase()}
                            </span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`font-bold ${tx.type === 'receipt' ? 'text-green-400' : 'text-gray-100'}`}>
                            {tx.type === 'receipt' ? '+' : ''}{getCurrencySymbol(tx.currency || 'EUR')}{parseFloat(String(tx.amount)).toFixed(2)}
                          </p>
                          {tx.type === 'invoice' && tx.status === 'pending' && (
                            <button 
                              onClick={() => handleMarkAsPaid(tx._id)}
                              disabled={markingPaid === tx._id}
                              className="text-[10px] mt-1 bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-0.5 rounded transition-colors disabled:opacity-50 inline-block"
                            >
                              {markingPaid === tx._id ? "..." : "Mark Paid"}
                            </button>
                          )}
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
                  <h4 className="font-semibold text-amber-800">Total Billed Vol.</h4>
                </div>
                <p className="text-3xl font-bold text-amber-600">{monthlyStats.billed.toFixed(2)}</p>
                <p className="text-xs text-amber-700/70 mt-2">Invoices sent this month</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                <div className="flex items-center mb-2">
                  <CheckCircle size={20} className="text-emerald-500 mr-2" />
                  <h4 className="font-semibold text-emerald-800">Total Collected Vol.</h4>
                </div>
                <p className="text-3xl font-bold text-emerald-600">{monthlyStats.collected.toFixed(2)}</p>
                <p className="text-xs text-emerald-700/70 mt-2">Receipts issued this month</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                <div className="flex items-center mb-2">
                  <Clock size={20} className="text-blue-500 mr-2" />
                  <h4 className="font-semibold text-blue-800">Pending Value</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600">{monthlyStats.pending.toFixed(2)}</p>
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
                         <th className="px-4 py-3">Status</th>
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
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                               {tx.status.toUpperCase()}
                             </span>
                           </td>
                           <td className="px-4 py-3 text-right">
                             <div className="flex items-center justify-end gap-3">
                               <span className={`font-bold ${tx.type === 'receipt' ? 'text-green-600' : 'text-gray-900'}`}>
                                 {getCurrencySymbol(tx.currency || 'EUR')}{parseFloat(String(tx.amount)).toFixed(2)}
                               </span>
                               {tx.type === 'invoice' && tx.status === 'pending' && (
                                 <button 
                                   onClick={() => handleMarkAsPaid(tx._id)}
                                   disabled={markingPaid === tx._id}
                                   className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold transition-colors disabled:opacity-50"
                                 >
                                   {markingPaid === tx._id ? "..." : "Mark Paid"}
                                 </button>
                               )}
                             </div>
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