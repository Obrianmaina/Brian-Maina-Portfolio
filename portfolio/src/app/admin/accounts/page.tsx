"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Receipt, TrendingUp, Calendar, FileText, CheckCircle, Clock, RefreshCw, Calculator, Download } from "lucide-react";
import AdminModal from "@/components/AdminModal";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Transaction = {
    _id: string;
    clientName: string;
    date: string;
    type: 'invoice' | 'receipt' | 'expense';
    amount: string | number;
    currency?: string;
    status: 'paid' | 'pending';
    description: string;
    mpesaMessage?: string;
    expenseCategory?: string;
    withholdingTax?: number;
    amountPaidKES?: number;
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
    const [docType, setDocType] = useState<'invoice' | 'receipt' | 'expense'>('invoice');
    const [expenseCategory, setExpenseCategory] = useState("software");
    const [hasWHT, setHasWHT] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Fetch all rates at once
    const [rates, setRates] = useState<Record<string, number>>({ USD: 1, EUR: 1, GBP: 1, KES: 1 });
    const [isFetchingRates, setIsFetchingRates] = useState(false);

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
        const fetchAllRates = async () => {
            setIsFetchingRates(true);
            try {
                const [usdRes, eurRes, gbpRes] = await Promise.all([
                    fetch('/api/exchange-rate?base=USD'),
                    fetch('/api/exchange-rate?base=EUR'),
                    fetch('/api/exchange-rate?base=GBP')
                ]);

                const usd = await usdRes.json();
                const eur = await eurRes.json();
                const gbp = await gbpRes.json();

                setRates({
                    USD: usd.rate || 1,
                    EUR: eur.rate || 1,
                    GBP: gbp.rate || 1,
                    KES: 1
                });
            } catch (error) {
                console.error("Failed to fetch rates", error);
            } finally {
                setIsFetchingRates(false);
            }
        };

        fetchAllRates();
    }, []);

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

    const handleDownloadKRA = () => {
        const year = new Date().getFullYear();
        window.open(`/api/admin/accounts/export?year=${year}`, '_blank');
    };

    const handleSendDocument = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clientName || !amount || !serviceDescription || (docType === 'receipt' && !mpesaMessage)) {
            showModal('error', 'Incomplete', 'All required fields must be filled.');
            return;
        }

        if (docType !== 'expense' && !clientEmail) {
            showModal('error', 'Incomplete', 'Client email is required for invoices and receipts.');
            return;
        }

        const whtAmount = hasWHT && docType !== 'expense' ? parseFloat(amount) * 0.05 : 0;

        setLoading(true);
        try {
            const res = await fetch("/api/admin/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName,
                    clientEmail: docType === 'expense' ? undefined : clientEmail,
                    amount: parseFloat(amount),
                    currency,
                    description: serviceDescription,
                    type: docType,
                    mpesaMessage: docType === 'receipt' ? mpesaMessage : undefined,
                    expenseCategory: docType === 'expense' ? expenseCategory : undefined,
                    withholdingTax: whtAmount,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showModal('success', 'Success!', `The ${docType} was successfully processed.`);
                setClientName("");
                setClientEmail("");
                setAmount("");
                setServiceDescription("");
                setMpesaMessage("");
                setDocType('invoice');
                setHasWHT(false);
                fetchTransactions();
            } else {
                showModal('error', 'Failed', data.error || "Could not process the document.");
            }
        } catch {
            showModal('error', 'Error', "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        showModal(
            'confirm',
            'Update Payment Status',
            'Are you sure you want to mark this invoice as paid? This will update your financial records immediately.',
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
        const whtDeduction = hasWHT && docType !== 'expense' ? rawAmount * 0.05 : 0;
        const netClientPayment = rawAmount - whtDeduction;

        const currentRate = rates[currency] || 1;
        const grossKES = netClientPayment * currentRate;
        const feePercentage = currency === "KES" ? 0.015 : 0.038;
        const netKES = grossKES - (grossKES * feePercentage);
        return netKES;
    }, [amount, rates, currency, hasWHT, docType]);

    const taxSummary = useMemo(() => {
        let grossRevenueKES = 0;
        let totalExpensesKES = 0;
        let totalWithheldTaxKES = 0;

        const currentYear = new Date().getFullYear();

        transactions.forEach(tx => {
            const txYear = new Date(tx.date).getFullYear();
            if (txYear !== currentYear) return;

            const txAmount = parseFloat(String(tx.amount));
            const txRate = rates[tx.currency || 'EUR'] || 1;

            const amountInKES = (tx.status === 'paid' && tx.amountPaidKES)
                ? tx.amountPaidKES
                : txAmount * txRate;

            const whtAmount = tx.withholdingTax ? parseFloat(String(tx.withholdingTax)) : 0;
            const whtInKES = whtAmount * txRate;

            if (tx.status === 'paid' && tx.type !== 'expense') {
                grossRevenueKES += amountInKES;
                totalWithheldTaxKES += whtInKES;
            } else if (tx.type === 'expense') {
                totalExpensesKES += amountInKES;
            }
        });

        const netProfit = grossRevenueKES - totalExpensesKES;
        const TAX_EXEMPT_CLAUSE = 288000; // 24,000 monthly x 12 months

        const taxableIncome = Math.max(0, netProfit - TAX_EXEMPT_CLAUSE);
        const grossTax = taxableIncome * 0.30;

        const estimatedTaxDue = Math.max(0, grossTax - totalWithheldTaxKES);

        const totalTitheKES = grossRevenueKES * 0.10;
        const freeToSpendKES = netProfit - estimatedTaxDue - totalTitheKES;

        return {
            grossRevenueKES,
            totalExpensesKES,
            netProfit,
            taxableIncome,
            totalWithheldTaxKES,
            estimatedTaxDue,
            totalTitheKES,
            freeToSpendKES
        };
    }, [transactions, rates]);


    const allChartData = useMemo(() => {
        const paidTransactions = transactions.filter(t => t.status === 'paid' && t.type !== 'expense');
        const grouped = paidTransactions.reduce((acc: Record<string, number>, curr) => {
            const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = 0;

            const amt = parseFloat(String(curr.amount));
            const txRate = rates[curr.currency || 'EUR'] || 1;
            const amountInKES = curr.amountPaidKES ? curr.amountPaidKES : amt * txRate;

            acc[dateStr] += amountInKES;
            return acc;
        }, {} as Record<string, number>);

        let data = Object.keys(grouped).map(date => ({ date, revenue: grouped[date] })).reverse();

        if (data.length === 1) {
            const dayBefore = new Date(data[0].date);
            dayBefore.setDate(dayBefore.getDate() - 1);
            const prevDateStr = dayBefore.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            data = [{ date: prevDateStr, revenue: 0 }, ...data];
        }

        return data;
    }, [transactions, rates]);

    const monthlyTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            const txMonthStr = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
            return txMonthStr === reportMonth;
        });
    }, [transactions, reportMonth]);

    const monthlyChartData = useMemo(() => {
        const paidMonthly = monthlyTransactions.filter(t => t.status === 'paid' && t.type !== 'expense');
        const grouped = paidMonthly.reduce((acc: Record<string, number>, curr) => {
            const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!acc[dateStr]) acc[dateStr] = 0;

            const amt = parseFloat(String(curr.amount));
            const txRate = rates[curr.currency || 'EUR'] || 1;
            const amountInKES = curr.amountPaidKES ? curr.amountPaidKES : amt * txRate;

            acc[dateStr] += amountInKES;
            return acc;
        }, {} as Record<string, number>);

        let data = Object.keys(grouped).map(date => ({ date, revenue: grouped[date] })).reverse();

        if (data.length === 1) {
            data = [{ date: "Start", revenue: 0 }, ...data];
        }

        return data;
    }, [monthlyTransactions, rates]);

    const monthlyStats = useMemo(() => {
        let billed = 0;
        let collected = 0;
        let pending = 0;
        let expenses = 0;
        let wht = 0;

        monthlyTransactions.forEach(tx => {
            const amt = parseFloat(String(tx.amount));
            const txRate = rates[tx.currency || 'EUR'] || 1;

            const currentEstimatedKES = amt * txRate;
            const exactPaidKES = tx.amountPaidKES ? tx.amountPaidKES : currentEstimatedKES;

            const originalWht = parseFloat(String(tx.withholdingTax || 0));
            const whtKES = originalWht * txRate;

            if (tx.type === 'expense') {
                expenses += exactPaidKES;
            } else if (tx.type === 'invoice') {
                billed += currentEstimatedKES;
                if (tx.status === 'pending') {
                    pending += currentEstimatedKES;
                }
            }

            if (tx.status === 'paid' && tx.type !== 'expense') {
                collected += exactPaidKES;
                wht += whtKES;
            }
        });

        const netProfit = collected - expenses;
        const MONTHLY_EXEMPTION = 24000; // The monthly tax-free band
        const taxableIncome = Math.max(0, netProfit - MONTHLY_EXEMPTION);
        const grossTax = taxableIncome * 0.30;
        const estimatedTax = Math.max(0, grossTax - wht);

        // Calculate Tithe and Free to Spend
        const tithe = collected * 0.10;
        const freeToSpend = netProfit - estimatedTax - tithe;

        return {
            billed,
            collected,
            pending,
            expenses,
            estimatedTax,
            tithe,
            freeToSpend
        };
    }, [monthlyTransactions, rates]);


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
                            Reports & Tax
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
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorAllRevenue)"
                                                dot={{ r: 4, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2 }}
                                                activeDot={{ r: 6, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Record</h3>
                                    <form onSubmit={handleSendDocument} className="space-y-5">

                                        <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
                                            <button type="button" onClick={() => setDocType('invoice')} className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === 'invoice' ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>Send Invoice</button>
                                            <button type="button" onClick={() => setDocType('receipt')} className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === 'receipt' ? 'bg-green-100 border-green-500 text-green-800 shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>Send Receipt</button>
                                            <button type="button" onClick={() => setDocType('expense')} className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === 'expense' ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>Log Expense</button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">{docType === 'expense' ? 'Vendor Name' : 'Client Name'}</label>
                                                <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder={docType === 'expense' ? "e.g. Adobe Inc." : "Jane Doe"} />
                                            </div>

                                            {docType !== 'expense' && (
                                                <div className="space-y-1">
                                                    <label className="text-sm font-semibold text-gray-700 ml-1">Client Email</label>
                                                    <input type="email" required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder="jane@example.com" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700 ml-1">{docType === 'expense' ? 'Item Description' : 'Service Description'}</label>
                                            <input type="text" required value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" placeholder={docType === 'expense' ? "e.g. Monthly Creative Cloud" : "e.g. Website Redesign Phase 1"} />
                                        </div>

                                        {docType === 'expense' && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">Expense Category</label>
                                                <select
                                                    value={expenseCategory}
                                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                                >
                                                    <option value="software">Software & Subscriptions (e.g. Adobe, Figma, Gemini)</option>
                                                    <option value="hosting">Web Hosting & Domains (e.g. Strato)</option>
                                                    <option value="utilities">Utilities (e.g. Electricity, Internet)</option>
                                                    <option value="hardware">Hardware & Equipment</option>
                                                    <option value="other">Other Business Expense</option>
                                                </select>
                                            </div>
                                        )}

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

                                        {docType !== 'expense' && (
                                            <div className="flex items-center pt-2 pb-2">
                                                <input
                                                    type="checkbox"
                                                    id="hasWHT"
                                                    checked={hasWHT}
                                                    onChange={(e) => setHasWHT(e.target.checked)}
                                                    className="w-4 h-4 text-amber-500 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                                                />
                                                <label htmlFor="hasWHT" className="ml-2 text-sm font-semibold text-gray-700">
                                                    Apply 5% Withholding Tax (Corporate Clients)
                                                </label>
                                            </div>
                                        )}

                                        {docType !== 'expense' && (
                                            <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase flex items-center">
                                                        Estimated M-Pesa Payout
                                                        {isFetchingRates && <RefreshCw size={12} className="ml-2 animate-spin text-blue-500" />}
                                                    </p>

                                                    {rates[currency] === 0 && currency !== 'KES' ? (
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
                                                    {rates[currency] > 0 && currency !== 'KES' && (
                                                        <p className="text-[10px] text-gray-400 font-bold">1 {currency} = {rates[currency]} KES</p>
                                                    )}
                                                    <p className="text-[10px] text-gray-400">& ~{currency === 'KES' ? '1.5%' : '3.8%'} Paystack fee</p>
                                                </div>
                                            </div>
                                        )}

                                        {docType === 'receipt' && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700 ml-1">M-Pesa Confirmation Message</label>
                                                <textarea required value={mpesaMessage} onChange={(e) => setMpesaMessage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 h-24" placeholder="Paste the exact M-Pesa message here..." />
                                            </div>
                                        )}

                                        <button type="submit" disabled={loading} className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center bg-amber-500 disabled:opacity-70 ${docType === 'invoice' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : docType === 'expense' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}>
                                            {loading ? "Processing..." : <><Send size={20} className="mr-2" /> {docType === 'invoice' ? 'Send Invoice' : docType === 'expense' ? 'Save Expense' : 'Send Receipt'}</>}
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
                                                        <span className={tx.type === 'expense' ? 'text-rose-400' : tx.status === 'paid' ? 'text-green-400' : 'text-amber-400'}>
                                                            {tx.type === 'expense' ? 'EXPENSE' : tx.status.toUpperCase()}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className={`font-bold ${tx.type === 'receipt' ? 'text-green-400' : tx.type === 'expense' ? 'text-rose-400' : 'text-gray-100'}`}>
                                                        {tx.type === 'receipt' ? '+' : tx.type === 'expense' ? '-' : ''}{getCurrencySymbol(tx.currency || 'EUR')}{parseFloat(String(tx.amount)).toFixed(2)}
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

                        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mt-8">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                <div className="flex items-center">
                                    <Calculator size={24} className="text-gray-800 mr-3" />
                                    <h3 className="text-xl font-bold text-gray-800">Annual Financial & Allocation Summary ({new Date().getFullYear()})</h3>
                                </div>

                                <button
                                    onClick={handleDownloadKRA}
                                    className="flex items-center text-sm bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-xl font-bold transition-colors shadow-sm"
                                >
                                    <Download size={16} className="mr-2" />
                                    Export CSV
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Gross Revenue</p>
                                    <p className="text-xl font-bold text-gray-900">KSh {taxSummary.grossRevenueKES.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Deductible Expenses</p>
                                    <p className="text-xl font-bold text-gray-900">KSh {taxSummary.totalExpensesKES.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Taxable Income</p>
                                    <p className="text-xl font-bold text-gray-900">KSh {taxSummary.taxableIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 font-medium mb-1">WHT Credits</p>
                                    <p className="text-xl font-bold text-gray-900">KSh {taxSummary.totalWithheldTaxKES.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Final Tax Payable</p>
                                    <p className="text-2xl font-bold text-indigo-600">KSh {taxSummary.estimatedTaxDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>

                                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
                                    <p className="text-sm text-gray-500 font-medium mb-1">10% Tithe Allocation</p>
                                    <p className="text-2xl font-bold text-purple-600">KSh {taxSummary.totalTitheKES.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>

                                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Free to Spend</p>
                                    <p className="text-2xl font-bold text-emerald-600">KSh {taxSummary.freeToSpendKES.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-8">
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
                                <p className="text-3xl font-bold text-amber-600">
                                    KSh {monthlyStats.billed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-amber-700/70 mt-2">Invoices sent this month</p>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                                <div className="flex items-center mb-2">
                                    <CheckCircle size={20} className="text-emerald-500 mr-2" />
                                    <h4 className="font-semibold text-emerald-800">Total Collected Vol.</h4>
                                </div>
                                <p className="text-3xl font-bold text-emerald-600">
                                    KSh {monthlyStats.collected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-emerald-700/70 mt-2">Receipts issued this month</p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                                <div className="flex items-center mb-2">
                                    <Clock size={20} className="text-blue-500 mr-2" />
                                    <h4 className="font-semibold text-blue-800">Pending Value</h4>
                                </div>
                                <p className="text-3xl font-bold text-blue-600">
                                    KSh {monthlyStats.pending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-blue-700/70 mt-2">Expected vs Collected</p>
                            </div>
                        </div>

                        {monthlyChartData.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-8 h-80 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                                    <TrendingUp size={20} className="mr-2 text-blue-500" /> Monthly Revenue Trend
                                </h3>
                                <div className="flex-1 w-full h-full min-h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorMonthlyRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} dy={10} />
                                            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorMonthlyRevenue)"
                                                dot={{ r: 4, fill: "#ffffff", stroke: "#3b82f6", strokeWidth: 2 }}
                                                activeDot={{ r: 6, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
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
                                                <th className="px-4 py-3">Vendor / Client</th>
                                                <th className="px-4 py-3">Description</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Orig. Amount</th>
                                                <th className="px-4 py-3 text-right rounded-r-lg">Amount (KES)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monthlyTransactions.map((tx) => {
                                                // Calculate the exact KES amount for this specific row
                                                const amt = parseFloat(String(tx.amount));
                                                const txRate = rates[tx.currency || 'EUR'] || 1;
                                                const kesAmount = tx.amountPaidKES ? tx.amountPaidKES : (amt * txRate);

                                                return (
                                                    <tr key={tx._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900">{tx.clientName}</td>
                                                        <td className="px-4 py-3">{tx.description}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.type === 'expense' ? 'bg-rose-100 text-rose-700' : tx.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                {tx.type === 'expense' ? 'EXPENSE' : tx.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <span className={`font-medium ${tx.type === 'receipt' ? 'text-green-600' : tx.type === 'expense' ? 'text-rose-600' : 'text-gray-900'}`}>
                                                                    {tx.type === 'expense' ? '-' : ''}{getCurrencySymbol(tx.currency || 'EUR')}{amt.toFixed(2)}
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
                                                        <td className="px-4 py-3 text-right font-bold text-gray-800">
                                                            {tx.type === 'expense' ? '-' : ''}KSh {kesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                                            <tr>
                                                <td colSpan={4} className="px-4 py-3 font-bold text-gray-700 text-right uppercase text-xs tracking-wider">Total Income (Collected)</td>
                                                <td colSpan={2} className="px-4 py-3 font-bold text-emerald-600 text-right text-base">
                                                    KSh {monthlyStats.collected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="border-t border-gray-200">
                                                <td colSpan={4} className="px-4 py-3 font-bold text-gray-700 text-right uppercase text-xs tracking-wider">Total Expenses</td>
                                                <td colSpan={2} className="px-4 py-3 font-bold text-rose-600 text-right text-base">
                                                    KSh {monthlyStats.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="border-t border-gray-200 bg-gray-100">
                                                <td colSpan={4} className="px-4 py-3 font-black text-gray-900 text-right uppercase text-sm tracking-wider">Net Monthly Result</td>
                                                <td colSpan={2} className={`px-4 py-3 font-black text-right text-lg ${(monthlyStats.collected - monthlyStats.expenses) >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                                    KSh {(monthlyStats.collected - monthlyStats.expenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="border-t border-gray-200 bg-indigo-50">
                                                <td colSpan={4} className="px-4 py-3 font-black text-indigo-900 text-right uppercase text-xs tracking-wider">Est. Tax Obligation</td>
                                                <td colSpan={2} className="px-4 py-3 font-black text-indigo-700 text-right text-base">
                                                    KSh {monthlyStats.estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="border-t border-gray-200 bg-purple-50">
                                                <td colSpan={4} className="px-4 py-3 font-black text-purple-900 text-right uppercase text-xs tracking-wider">10% Tithe Allocation</td>
                                                <td colSpan={2} className="px-4 py-3 font-black text-purple-700 text-right text-base">
                                                    KSh {monthlyStats.tithe.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="border-t border-gray-200 bg-emerald-100">
                                                <td colSpan={4} className="px-4 py-4 font-black text-emerald-900 text-right uppercase text-sm tracking-wider">Free to Spend</td>
                                                <td colSpan={2} className="px-4 py-4 font-black text-emerald-700 text-right text-xl">
                                                    KSh {monthlyStats.freeToSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        </tfoot>
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