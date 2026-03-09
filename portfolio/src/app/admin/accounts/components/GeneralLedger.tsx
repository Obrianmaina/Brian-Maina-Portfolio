"use client";

import { Receipt } from "lucide-react";
import { Transaction } from "../types";
import { getCurrencySymbol } from "../utils";

interface GeneralLedgerProps {
    transactions: Transaction[];
    markingPaid: string | null;
    onMarkAsPaid: (id: string) => void;
}

export default function GeneralLedger({ transactions, markingPaid, onMarkAsPaid }: GeneralLedgerProps) {
    return (
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
                    transactions.slice(0, 10).map(tx => (
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
                                    {tx.type === 'receipt' ? '+' : tx.type === 'expense' ? '-' : ''}
                                    {getCurrencySymbol(tx.currency || 'EUR')}{parseFloat(String(tx.amount)).toFixed(2)}
                                </p>
                                {tx.type === 'invoice' && tx.status === 'pending' && (
                                    <button
                                        onClick={() => onMarkAsPaid(tx._id)}
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
    );
}
