"use client";

import { Receipt } from "lucide-react";
import { Transaction } from "../types";
import { getCurrencySymbol } from "../utils";
import DownloadDocumentBtn from "@/components/DownloadDocumentBtn";
import { DocumentData } from "@/components/pdf/DocumentTemplate";

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

            <div className="mt-auto space-y-2 overflow-y-auto pr-2">
                {transactions.length === 0 ? (
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                        <p className="text-sm text-gray-400">No transactions recorded yet.</p>
                    </div>
                ) : (
                    transactions.slice(0, 10).map(tx => {
                        const amt = parseFloat(String(tx.amount)).toFixed(2);
                        const amtColor = tx.type === 'receipt' ? 'text-green-400'
                            : tx.type === 'expense' ? 'text-rose-400'
                            : 'text-gray-100';
                        const amtPrefix = tx.type === 'receipt' ? '+' : tx.type === 'expense' ? '-' : '';
                        const statusColor = tx.type === 'expense' ? 'bg-rose-500/10 text-rose-400'
                            : tx.status === 'paid' ? 'bg-green-500/10 text-green-400'
                            : 'bg-amber-500/10 text-amber-400';
                        const statusLabel = tx.type === 'expense' ? 'EXPENSE'
                            : tx.status.toUpperCase();

                        return (
                            <div
                                key={tx._id}
                                className="bg-gray-800 border border-gray-700/50 rounded-xl px-4 py-3 flex items-center gap-3"
                            >
                                {/* Left: name + date — now wider */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-100 truncate text-sm">
                                        {tx.clientName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                {/* Right: status on top, amount below, actions beside */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                                            {statusLabel}
                                        </span>
                                        <span className={`text-sm font-bold tabular-nums ${amtColor}`}>
                                            {amtPrefix}{getCurrencySymbol(tx.currency || 'EUR')}{amt}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 border-l border-gray-700 pl-2">
                                        {tx.type === 'invoice' && tx.status === 'pending' && (
                                            <button
                                                onClick={() => onMarkAsPaid(tx._id)}
                                                disabled={markingPaid === tx._id}
                                                className="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-lg transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
                                            >
                                                {markingPaid === tx._id ? "…" : "Mark paid"}
                                            </button>
                                        )}

                                        <DownloadDocumentBtn
                                            data={tx as DocumentData}
                                            type={tx.status === 'paid' || tx.type === 'receipt' ? 'receipt' : 'invoice'}
                                            iconOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}