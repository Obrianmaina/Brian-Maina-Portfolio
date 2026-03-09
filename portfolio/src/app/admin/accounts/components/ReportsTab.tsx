"use client";

import { Calculator, Download, Calendar, FileText, CheckCircle, Clock } from "lucide-react";
import RevenueChart from "./RevenueChart";
import { Transaction, TaxSummary, MonthlyStats, ChartDataPoint, Rates } from "../types";
import { getCurrencySymbol } from "../utils";

interface ReportsTabProps {
    taxSummary: TaxSummary;
    monthlyStats: MonthlyStats;
    monthlyTransactions: Transaction[];
    monthlyChartData: ChartDataPoint[];
    reportMonth: string;
    setReportMonth: (v: string) => void;
    rates: Rates;
    markingPaid: string | null;
    onMarkAsPaid: (id: string) => void;
    onDownloadKRA: () => void;
}

export default function ReportsTab({
    taxSummary, monthlyStats, monthlyTransactions, monthlyChartData,
    reportMonth, setReportMonth, rates, markingPaid, onMarkAsPaid, onDownloadKRA
}: ReportsTabProps) {
    const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const netMonthly = monthlyStats.collected - monthlyStats.expenses;

    // ── Live disclaimer computed values ──────────────────────────────────
    // Determine which KRA monthly band the net profit falls into
    const getActiveBand = (netProfit: number): string => {
        if (netProfit <= 24_000)                          return '10%';
        if (netProfit <= 32_333)                          return '25%';
        if (netProfit <= 500_000)                         return '30%';
        if (netProfit <= 800_000)                         return '32.5%';
        return '35%';
    };
    const activeBand = getActiveBand(netMonthly);

    // Gap between monthly provision and annual true liability
    const monthlyAnnualisedTax = monthlyStats.estimatedTax * 12;
    const annualTrueTax = taxSummary.estimatedTaxDue;
    const savingsBuffer = Math.max(0, monthlyStats.estimatedTax - (annualTrueTax / 12));

    // What the annual free to spend works out to per month
    const annualFreeToSpendMonthly = taxSummary.freeToSpendKES / 12;

    return (
        <div className="fade-in space-y-8">

            {/* Annual Summary */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mt-8">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <div className="flex items-center">
                        <Calculator size={24} className="text-gray-800 mr-3" />
                        <h3 className="text-xl font-bold text-gray-800">
                            Annual Financial & Allocation Summary ({new Date().getFullYear()})
                        </h3>
                    </div>
                    <button
                        onClick={onDownloadKRA}
                        className="flex items-center text-sm bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-xl font-bold transition-colors shadow-sm"
                    >
                        <Download size={16} className="mr-2" /> Export CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {[
                        { label: 'Gross Revenue',       value: taxSummary.grossRevenueKES },
                        { label: 'Deductible Expenses', value: taxSummary.totalExpensesKES },
                        { label: 'Net Profit',          value: taxSummary.netProfit },
                        { label: 'WHT Credits',         value: taxSummary.totalWithheldTaxKES },
                    ].map(({ label, value }) => (
                        <div key={label} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
                            <p className="text-xl font-bold text-gray-900">KSh {fmt(value)}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
                        <p className="text-sm text-gray-500 font-medium mb-1">Final Tax Payable</p>
                        <p className="text-2xl font-bold text-indigo-600">KSh {fmt(taxSummary.estimatedTaxDue)}</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
                        <p className="text-sm text-gray-500 font-medium mb-1">10% Tithe Allocation</p>
                        <p className="text-2xl font-bold text-purple-600">KSh {fmt(taxSummary.totalTitheKES)}</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
                        <p className="text-sm text-gray-500 font-medium mb-1">Free to Spend</p>
                        <p className="text-2xl font-bold text-emerald-600">KSh {fmt(taxSummary.freeToSpendKES)}</p>
                    </div>
                </div>
            </div>

            {/* Month Picker */}
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
                        type="month" value={reportMonth} onChange={e => setReportMonth(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none font-medium"
                    />
                </div>
            </div>

            {/* Monthly Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: FileText,    label: 'Total Billed Vol.',    value: monthlyStats.billed,    note: 'Invoices sent this month',   color: 'amber'   },
                    { icon: CheckCircle, label: 'Total Collected Vol.', value: monthlyStats.collected, note: 'Receipts issued this month', color: 'emerald' },
                    { icon: Clock,       label: 'Pending Value',        value: monthlyStats.pending,   note: 'Expected vs Collected',      color: 'blue'    },
                ].map(({ icon: Icon, label, value, note, color }) => (
                    <div key={label} className={`bg-${color}-50 border border-${color}-200 p-6 rounded-2xl`}>
                        <div className="flex items-center mb-2">
                            <Icon size={20} className={`text-${color}-500 mr-2`} />
                            <h4 className={`font-semibold text-${color}-800`}>{label}</h4>
                        </div>
                        <p className={`text-3xl font-bold text-${color}-600`}>
                            KSh {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs text-${color}-700/70 mt-2`}>{note}</p>
                    </div>
                ))}
            </div>

            {/* Monthly Chart */}
            {monthlyChartData.length > 0 && (
                <RevenueChart
                    data={monthlyChartData}
                    title="Monthly Revenue Trend"
                    color="#3b82f6"
                    gradientId="colorMonthlyRevenue"
                    iconColor="text-blue-500"
                />
            )}

            {/* Monthly Ledger Table */}
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
                                {monthlyTransactions.map(tx => {
                                    const amt = parseFloat(String(tx.amount));
                                    const txRate = rates[tx.currency || 'EUR'] || 1;
                                    const kesAmount = tx.amountPaidKES ?? amt * txRate;
                                    return (
                                        <tr key={tx._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{tx.clientName}</td>
                                            <td className="px-4 py-3">{tx.description}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    tx.type === 'expense'   ? 'bg-rose-100 text-rose-700'
                                                    : tx.status === 'paid' ? 'bg-green-100 text-green-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {tx.type === 'expense' ? 'EXPENSE' : tx.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className={`font-medium ${
                                                        tx.type === 'receipt'   ? 'text-green-600'
                                                        : tx.type === 'expense' ? 'text-rose-600'
                                                        : 'text-gray-900'
                                                    }`}>
                                                        {tx.type === 'expense' ? '-' : ''}
                                                        {getCurrencySymbol(tx.currency || 'EUR')}{amt.toFixed(2)}
                                                    </span>
                                                    {tx.type === 'invoice' && tx.status === 'pending' && (
                                                        <button
                                                            onClick={() => onMarkAsPaid(tx._id)}
                                                            disabled={markingPaid === tx._id}
                                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-semibold transition-colors disabled:opacity-50"
                                                        >
                                                            {markingPaid === tx._id ? "..." : "Mark Paid"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-800">
                                                {tx.type === 'expense' ? '-' : ''}KSh {fmt(kesAmount)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot className="border-t-2 border-gray-200">

                                {/* ── Section 1: Cash P&L ── */}
                                <tr className="bg-gray-50">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-gray-700">
                                        Total Income (Collected)
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-emerald-600">
                                        KSh {fmt(monthlyStats.collected)}
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 border-t border-gray-200">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-gray-700">
                                        Total Expenses
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-rose-600">
                                        − KSh {fmt(monthlyStats.expenses)}
                                    </td>
                                </tr>
                                <tr className="border-t border-gray-200 bg-gray-100">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-sm tracking-wider font-black text-gray-900">
                                        Net Monthly Result
                                    </td>
                                    <td colSpan={2} className={`px-4 py-3 text-right text-lg font-black ${netMonthly >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                        KSh {fmt(netMonthly)}
                                    </td>
                                </tr>

                                {/* ── Section 2: WHT (real cash already withheld) ── */}
                                {monthlyStats.wht > 0 && (
                                    <tr className="border-t border-gray-200 bg-gray-50">
                                        <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-gray-500">
                                            WHT Already Deducted by Clients
                                            <span className="ml-1 normal-case font-normal text-gray-400">(real money withheld)</span>
                                        </td>
                                        <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-gray-500">
                                            − KSh {fmt(monthlyStats.wht)}
                                        </td>
                                    </tr>
                                )}
                                <tr className="border-t border-gray-200 bg-slate-50">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-slate-700">
                                        Spendable Net
                                        <span className="ml-1 normal-case font-normal text-slate-400">(cash in your account)</span>
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-slate-700">
                                        KSh {fmt(monthlyStats.spendableNet)}
                                    </td>
                                </tr>

                                {/* ── Section 3: Allocations ── */}
                                <tr className="border-t-2 border-dashed border-amber-300 bg-amber-50">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-amber-700">
                                        Tax Provision
                                        <span className="ml-1 normal-case font-normal text-amber-500">— set aside monthly, see Annual Summary for true liability</span>
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-amber-700">
                                        ~ KSh {fmt(monthlyStats.estimatedTax)}
                                    </td>
                                </tr>
                                <tr className="border-t border-amber-200 bg-purple-50">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-black text-purple-900">
                                        10% Tithe Allocation
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-black text-purple-700">
                                        KSh {fmt(monthlyStats.tithe)}
                                    </td>
                                </tr>
                                <tr className="border-t border-purple-200 bg-emerald-100">
                                    <td colSpan={4} className="px-4 py-4 text-right uppercase text-sm tracking-wider font-black text-emerald-900">
                                        Free to Spend
                                    </td>
                                    <td colSpan={2} className="px-4 py-4 text-right text-xl font-black text-emerald-700">
                                        KSh {fmt(monthlyStats.freeToSpend)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        {/* Live disclaimer banner */}
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">

                            {/* Header row */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-amber-200 bg-amber-100/60">
                                <span className="text-amber-600 text-sm">⚠</span>
                                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                                    Why does Free to Spend differ from the Annual Summary?
                                </p>
                            </div>

                            {/* Body */}
                            <div className="px-4 py-3 space-y-2">
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    This ledger uses Kenya&apos;s <span className="font-bold">monthly tax bands</span> as a saving discipline,
                                    treating this month as if it were recurring. With{" "}
                                    <span className="font-bold">KSh {fmt(monthlyStats.collected)}</span> collected and{" "}
                                    <span className="font-bold">KSh {fmt(netMonthly)}</span> net profit, income is taxed
                                    progressively across all bands, reaching a top rate of{" "}
                                    <span className="font-bold">{activeBand}</span>, pushing the monthly tax provision to{" "}
                                    <span className="font-bold">~KSh {fmt(monthlyStats.estimatedTax)}</span>.
                                </p>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    The <span className="font-bold">Annual Summary</span> applies the annual bands to your actual
                                    YTD total of <span className="font-bold">KSh {fmt(taxSummary.grossRevenueKES)}</span>, giving a true
                                    KRA liability of <span className="font-bold">KSh {fmt(annualTrueTax)}</span>{" "}
                                    (~KSh {fmt(annualTrueTax / 12)}/mo equivalent). That number is always lower
                                    unless you earn this exact amount every month all year.
                                </p>

                                {/* Live delta callout */}
                                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                                    <div className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2">
                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">Monthly Provision</p>
                                        <p className="text-sm font-black text-amber-700">KSh {fmt(monthlyStats.estimatedTax)}</p>
                                        <p className="text-[10px] text-amber-500 mt-0.5">Set aside this month</p>
                                    </div>
                                    <div className="flex items-center justify-center text-amber-400 font-bold text-sm px-1">vs</div>
                                    <div className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2">
                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">Annual ÷ 12</p>
                                        <p className="text-sm font-black text-amber-700">KSh {fmt(annualTrueTax / 12)}</p>
                                        <p className="text-[10px] text-amber-500 mt-0.5">True KRA liability per month</p>
                                    </div>
                                    <div className="flex items-center justify-center text-amber-400 font-bold text-sm px-1">=</div>
                                    <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Buffer Saved</p>
                                        <p className="text-sm font-black text-emerald-700">KSh {fmt(savingsBuffer)}</p>
                                        <p className="text-[10px] text-emerald-500 mt-0.5">Extra cushion vs KRA bill</p>
                                    </div>
                                </div>

                                <p className="text-[11px] text-amber-700 pt-1 border-t border-amber-200">
                                    <span className="font-bold">Use the Annual Summary</span> for what you actually owe KRA.
                                    Use this monthly provision to stay disciplined — the KSh {fmt(savingsBuffer)} buffer
                                    each month compounds into a <span className="font-bold">KSh {fmt(savingsBuffer * 12)} annual cushion</span> if income stays consistent.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-6">No transactions recorded in this month.</p>
                )}
            </div>
        </div>
    );
}