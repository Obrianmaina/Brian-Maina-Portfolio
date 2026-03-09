"use client";

import { TaxSummary } from "../types";
import { AlertTriangle, TrendingUp, ShieldCheck, Landmark, Wallet, ChevronRight } from "lucide-react";

interface YearHealthBarProps {
    taxSummary: TaxSummary;
}

export default function YearHealthBar({ taxSummary }: YearHealthBarProps) {
    if (taxSummary.grossRevenueKES === 0) return null;

    const fmt = (n: number) =>
        n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const year = new Date().getFullYear();

    const whtCoverage = taxSummary.estimatedTaxDue === 0
        ? 100
        : Math.min(100, Math.round(
            (taxSummary.totalWithheldTaxKES /
                (taxSummary.estimatedTaxDue + taxSummary.totalWithheldTaxKES)) * 100
          ));

    const fullyCovered = taxSummary.estimatedTaxDue === 0;
    const instalmentDue = taxSummary.estimatedTaxDue > 40_000;

    // Year progress — how far through the year are we
    const now = new Date();
    const yearProgress = Math.round(
        ((now.getMonth() * 30 + now.getDate()) / 365) * 100
    );

    return (
        <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

            {/* ── Dark header ── */}
            <div className="bg-gray-900 px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                        <Landmark size={17} className="text-amber-400" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-base leading-tight">{year} Tax Overview</p>
                        <p className="text-gray-400 text-xs mt-0.5">Year-to-date · KRA annual return</p>
                    </div>
                </div>

                {/* Status pill */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                    fullyCovered
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-amber-400'
                        : instalmentDue
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                    {fullyCovered
                        ? <><ShieldCheck size={12} /> WHT fully covers liability</>
                        : instalmentDue
                        ? <><AlertTriangle size={12} /> Instalment tax required</>
                        : <><TrendingUp size={12} /> Tax provision on track</>
                    }
                </div>
            </div>

            {/* ── Dual progress bars ── */}
            <div className="bg-gray-800 px-6 py-4 space-y-3">

                {/* WHT coverage bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">WHT Coverage</p>
                        <p className="text-[11px] font-bold text-gray-300">{whtCoverage}%</p>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${fullyCovered ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                            style={{ width: `${whtCoverage}%` }}
                        />
                    </div>
                </div>

                {/* Year elapsed bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Year Elapsed</p>
                        <p className="text-[11px] font-bold text-gray-300">{yearProgress}%</p>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gray-500 transition-all duration-700"
                            style={{ width: `${yearProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── 2×2 stat tiles — forced 2 columns at all breakpoints ── */}
            <div
                className="bg-white divide-gray-100"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #f3f4f6' }}
            >
                {/* Tax Payable — top left */}
                <div className="p-5 flex flex-col gap-1" style={{ borderRight: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
                    <div className={`self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        fullyCovered ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                        Tax Payable
                    </div>
                    <p className={`text-2xl font-black tabular-nums leading-none ${
                        fullyCovered ? 'text-emerald-600' : 'text-indigo-600'
                    }`}>
                        KSh {fmt(taxSummary.estimatedTaxDue)}
                    </p>
                    <p className="text-xs text-gray-400 leading-tight mt-1">
                        {fullyCovered ? 'Fully offset by WHT ✓' : 'Outstanding after WHT'}
                    </p>
                </div>

                {/* WHT Credits — top right */}
                <div className="p-5 flex flex-col gap-1" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <div className="self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 bg-blue-100 text-blue-700">
                        WHT Credits
                    </div>
                    <p className="text-2xl font-black tabular-nums leading-none text-blue-600">
                        KSh {fmt(taxSummary.totalWithheldTaxKES)}
                    </p>
                    <p className="text-xs text-gray-400 leading-tight mt-1">Withheld by clients</p>
                </div>

                {/* Net Profit — bottom left */}
                <div className="p-5 flex flex-col gap-1" style={{ borderRight: '1px solid #f3f4f6' }}>
                    <div className={`self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        taxSummary.netProfit >= 0 ? 'bg-gray-100 text-gray-600' : 'bg-rose-100 text-rose-700'
                    }`}>
                        Net Profit
                    </div>
                    <p className={`text-2xl font-black tabular-nums leading-none ${
                        taxSummary.netProfit >= 0 ? 'text-gray-800' : 'text-rose-600'
                    }`}>
                        KSh {fmt(taxSummary.netProfit)}
                    </p>
                    <p className="text-xs text-gray-400 leading-tight mt-1">Revenue minus expenses</p>
                </div>

                {/* Free to Spend — bottom right */}
                <div className={`p-5 flex flex-col gap-1 ${
                    taxSummary.freeToSpendKES >= 0 ? 'bg-emerald-50' : 'bg-rose-50'
                }`}>
                    <div className={`self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        taxSummary.freeToSpendKES >= 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                    }`}>
                        Free to Spend
                    </div>
                    <p className={`text-2xl font-black tabular-nums leading-none ${
                        taxSummary.freeToSpendKES >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                        KSh {fmt(taxSummary.freeToSpendKES)}
                    </p>
                    <p className="text-xs text-gray-400 leading-tight mt-1">After tax + tithe</p>
                </div>
            </div>

            {/* ── Instalment nudge (conditional) ── */}
            {instalmentDue && (
                <div className="bg-amber-50 border-t border-amber-200 px-6 py-3 flex items-start gap-3">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed flex-1">
                        <span className="font-bold">Quarterly instalments required.</span>{" "}
                        KSh {fmt(taxSummary.estimatedTaxDue)} outstanding exceeds the KSh 40,000 KRA threshold.
                        Pay <span className="font-bold">25% (KSh {fmt(taxSummary.estimatedTaxDue / 4)})</span> by{" "}
                        <span className="font-bold">20th Apr · 20th Jun · 20th Sep · 20th Dec</span>.
                    </p>
                    <ChevronRight size={14} className="text-amber-400 mt-0.5 shrink-0" />
                </div>
            )}
        </div>
    );
}