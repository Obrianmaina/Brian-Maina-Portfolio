"use client";

import { Send, RefreshCw } from "lucide-react";
import { DocType, CurrencyCode, Rates } from "../types";
import { getCurrencySymbol, maskMpesaBalance } from "../utils";

interface CreateRecordFormProps {
    docType: DocType;
    setDocType: (t: DocType) => void;
    clientName: string; setClientName: (v: string) => void;
    clientEmail: string; setClientEmail: (v: string) => void;
    amount: string; setAmount: (v: string) => void;
    currency: CurrencyCode; setCurrency: (v: CurrencyCode) => void;
    serviceDescription: string; setServiceDescription: (v: string) => void;
    mpesaMessage: string; setMpesaMessage: (v: string) => void;
    expenseCategory: string; setExpenseCategory: (v: string) => void;
    hasWHT: boolean; setHasWHT: (v: boolean) => void;
    rates: Rates;
    isFetchingRates: boolean;
    estimatedPayoutKES: number;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export default function CreateRecordForm({
    docType, setDocType,
    clientName, setClientName,
    clientEmail, setClientEmail,
    amount, setAmount,
    currency, setCurrency,
    serviceDescription, setServiceDescription,
    mpesaMessage, setMpesaMessage,
    expenseCategory, setExpenseCategory,
    hasWHT, setHasWHT,
    rates, isFetchingRates, estimatedPayoutKES,
    loading, onSubmit
}: CreateRecordFormProps) {
    const typeBtn = (type: DocType, label: string, active: string, base: string) => (
        <button
            type="button"
            onClick={() => setDocType(type)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold border transition-all ${docType === type ? active : base}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Record</h3>
            <form onSubmit={onSubmit} className="space-y-5">

                <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
                    {typeBtn('invoice', 'Send Invoice', 'bg-amber-100 border-amber-500 text-amber-800 shadow-sm', 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50')}
                    {typeBtn('receipt', 'Send Receipt', 'bg-green-100 border-green-500 text-green-800 shadow-sm', 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50')}
                    {typeBtn('expense', 'Log Expense', 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm', 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">
                            {docType === 'expense' ? 'Vendor Name' : 'Client Name'}
                        </label>
                        <input
                            type="text" required value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder={docType === 'expense' ? "e.g. Adobe Inc." : "Jane Doe"}
                        />
                    </div>
                    {docType !== 'expense' && (
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Client Email</label>
                            <input
                                type="email" required value={clientEmail}
                                onChange={e => setClientEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="jane@example.com"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                        {docType === 'expense' ? 'Item Description' : 'Service Description'}
                    </label>
                    <input
                        type="text" required value={serviceDescription}
                        onChange={e => setServiceDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder={docType === 'expense' ? "e.g. Monthly Creative Cloud" : "e.g. Website Redesign Phase 1"}
                    />
                </div>

                {docType === 'expense' && (
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Expense Category</label>
                        <select
                            value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)}
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
                            value={currency} onChange={e => setCurrency(e.target.value as CurrencyCode)}
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
                                type="number" step="0.01" required value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full outline-none bg-transparent" placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                {docType !== 'expense' && (
                    <div className="flex items-center pt-2 pb-2">
                        <input
                            type="checkbox" id="hasWHT" checked={hasWHT}
                            onChange={e => setHasWHT(e.target.checked)}
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
                                <p className="text-sm font-bold text-red-500 mt-1">No internet connection / Rate failed</p>
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
                        <textarea
                            required value={mpesaMessage}
                            onChange={e => setMpesaMessage(maskMpesaBalance(e.target.value))}
                            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 h-24"
                            placeholder="Paste the exact M-Pesa message here..."
                        />
                    </div>
                )}

                <button
                    type="submit" disabled={loading}
                    className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70 ${
                        docType === 'invoice' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                        : docType === 'expense' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                        : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                    }`}
                >
                    {loading ? "Processing..." : (
                        <><Send size={20} className="mr-2" />
                        {docType === 'invoice' ? 'Send Invoice' : docType === 'expense' ? 'Save Expense' : 'Send Receipt'}</>
                    )}
                </button>
            </form>
        </div>
    );
}